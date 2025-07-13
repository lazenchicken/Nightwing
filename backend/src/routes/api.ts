// backend/src/routes/api.ts
import express from 'express';
import axios from 'axios';
import { cacheable } from '../cache';
const router = express.Router();

// … your existing proxy routes here …

//  ──────────────────────────────────────────────────────
//  STAT COMPARISON
//  ──────────────────────────────────────────────────────
// GET /api/stat-comparison?spec=<specSlug>&character=<charName>&realm=<realmName>
// src/routes/api.ts
router.get('/stat-comparison', (req, res) => {
  const { spec, realm, character } = req.query;
  if (!spec || !realm || !character) {
    return res.status(400).json({ error: 'spec, character & realm are required' });
  }

  try {
    // 1) Icy Veins weights
    const icyKey = `icy:${spec}`;
    const icy: { stat: string; weight: number }[] = await cacheable(
      icyKey, 600, async () => {
        const html = (await axios.get(`https://www.icy-veins.com/wow/${spec}`)).data;
        const cheerio = require('cheerio');
        const $ = cheerio.load(html);
        const out: any[] = [];
        $('h2:contains("Stat Priority")').next('table').find('tbody tr').each((_, tr) => {
          const cols = $(tr).find('td');
          const stat = cols.eq(0).text().trim();
          const weight = parseFloat(cols.eq(1).text().replace(/[^0-9.]/g,''));
          if (stat && !isNaN(weight)) out.push({ stat, weight });
        });
        return out;
      }
    );

    // 2) Archon.gg weights
    const archonKey = `archon:${spec}`;
    const archon: { stat: string; avgWeight: number }[] = await cacheable(
      archonKey, 600, async () => {
        const { data } = await axios.get('https://api.archon.gg/stats', {
          headers: { 'x-api-key': process.env.ARCHON_KEY },
          params: { spec },
        });
        return data; // assume [{ stat, avgWeight }, …]
      }
    );

    // 3) “Actual” weights from Warcraft Logs
    const actualKey = `actual:${realm}:${character}:${spec}`;
    const actual: { stat: string; computedWeight: number }[] = await cacheable(
      actualKey, 600, async () => {
        const url = 'https://www.warcraftlogs.com/v1/parses/weight';
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${process.env.WARCRAFTLOGS_KEY}` },
          params: { character, realm, spec },
        });
        return data; 
      }
    );

    // 4) Merge them by stat name
    const stats = icy.map(iv => iv.stat);
    const merged = stats.map(stat => ({
      stat,
      icy:   icy.find(i => i.stat===stat)!.weight,
      archon: archon.find(a => a.stat===stat)?.avgWeight ?? 0,
      actual: actual.find(a => a.stat===stat)?.computedWeight ?? 0
    }));

    res.json(merged);

  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
