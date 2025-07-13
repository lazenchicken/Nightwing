import { Router } from 'express';
import axios from 'axios';
import { cacheable } from '../cache';

const router = Router();

router.get('/characters', async (req, res) => {
  const q = String(req.query.search || '');
  if (!q) return res.status(400).json({ error: 'search param required' });
  try {
    const results = await cacheable(`search::${q}`, 300, async () => {
      const r = await axios.get('https://raider.io/api/v1/characters/search', {
        params: { query: q, limit: 10, apikey: process.env.RAIDERIO_KEY }
      });
      return r.data.results;
    });
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
