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
    const icy = await cacheable<{ stat: string; weight: number }[]>(
      icyKey,
      600,
      async () => {
        const { data: html } = await axios.get(
          `https://www.icy-veins.com/wow/${spec}`
        );
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
      }
    );

    // 2) Archon.gg weights
    const archonKey = `archon:${spec}`;
    const archon = await cacheable<{ stat: string; avgWeight: number }[]>(
      archonKey,
      600,
      async () => {
        // Use Archon.gg parse-weight endpoint similar to Warcraft Logs
        const r = await axios.get(
          'https://api.archon.gg/v1/parses/weight',
          {
            params: { realm, character, spec },
            headers: { 'x-api-key': process.env.ARCHON_KEY }
          }
        );
        return r.data;
      }
    );

    // 3) “Actual” weights from Warcraft Logs
    const actualKey = `actual:${realm}:${character}:${spec}`;
    const actual = await cacheable<{ stat: string; computedWeight: number }[]>(
      actualKey,
      600,
      async () => {
        const r = await axios.get(
          'https://www.warcraftlogs.com/v1/parses/weight',
          {
            params: { realm, character, spec },
            headers: { Authorization: `Bearer ${process.env.WARCRAFTLOGS_KEY}` }
          }
        );
        return r.data;
      }
    );

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
