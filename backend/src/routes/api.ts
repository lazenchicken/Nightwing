import { Router } from 'express';
import axios from 'axios';
import { cacheable } from '../cache';

const router = Router();

// … your other proxy routes here …

// ──────────────────────────────────────────────────────
// STAT COMPARISON
// ──────────────────────────────────────────────────────
// GET /api/stat-comparison?spec=<specSlug>&character=<charName>&realm=<realmName>
router.get('/stat-comparison', async (req, res) => {
  const { spec, realm, character } = req.query as Record<string,string>;

  if (!spec || !realm || !character) {
    return res
      .status(400)
      .json({ error: 'spec, character & realm are required' });
  }

  try {
    // 1) Icy Veins weights
    const icyKey = `icy:${spec}`;
    let icy: { stat: string; weight: number }[] = [];
    try {
      icy = await cacheable(icyKey, 600, async () => {
        const { data: html } = await axios.get(`https://www.icy-veins.com/wow/${spec}`);
        const cheerio = require('cheerio');
        const $ = cheerio.load(html);
        const out: { stat: string; weight: number }[] = [];
        $('h2:contains("Stat Priority")')
          .next('table')
          .find('tbody tr')
          .each((_: any, row: any) => {
            const cols = $(row).find('td');
            const stat = cols.eq(0).text().trim();
            const weight = parseFloat(cols.eq(1).text().replace(/[^0-9.]/g, ''));
            if (stat && !isNaN(weight)) out.push({ stat, weight });
          });
        return out;
      });
    } catch (e: any) {
      console.error('Icy Veins fetch failed:', e.message);
    }

    // 2) Archon.gg weights
    const archonKey = `archon:${spec}`;
    let archon: { stat: string; avgWeight: number }[] = [];
    try {
      archon = await cacheable(archonKey, 600, async () => {
        const r = await axios.get('https://api.archon.gg/v1/parses/weight', {
          params: { realm, character, spec },
          headers: { 'x-api-key': process.env.ARCHON_KEY }
        });
        return r.data;
      });
    } catch (e: any) {
      console.error('Archon.gg fetch failed:', e.message);
    }

    // 3) “Actual” weights from Warcraft Logs
    const actualKey = `actual:${realm}:${character}:${spec}`;
    let actual: { stat: string; computedWeight: number }[] = [];
    try {
      actual = await cacheable(actualKey, 600, async () => {
        // Warcraft Logs expects lowercase, slugified realm and name, and spec with underscores
        const realmSlug = realm.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const nameSlug = character.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const specParam = spec.replace(/-/g, '_');
        const r = await axios.get('https://www.warcraftlogs.com/v1/parses/weight', {
          params: { realm: realmSlug, name: nameSlug, spec: specParam },
          headers: { Authorization: `Bearer ${process.env.WARCRAFTLOGS_KEY}` }
        });
        return r.data;
      });
    } catch (e: any) {
      console.error('Warcraft Logs fetch failed:', e.message);
    }

    // 4) Merge them by stat name
    const stats = icy.map(i => i.stat);
    const merged = stats.map(stat => ({
      stat,
      icy: icy.find(i => i.stat === stat)!.weight,
      archon:
        archon.find(a => a.stat === stat)?.avgWeight ||
        0,
      actual:
        actual.find(a => a.stat === stat)?.computedWeight ||
        0
    }));

    return res.json(merged);
  } catch (e: any) {
    console.error('stat-comparison error:', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
