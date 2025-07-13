import { Router } from 'express';
import axios from 'axios';
import { cacheable } from '../cache';

const router = Router();

router.post('/', async (req, res) => {
  const chars: Array<{ realm: string; name: string }> = req.body.characters || [];
  try {
    const results = await Promise.all(
      chars.map(({ realm, name }) =>
        cacheable(`group::${realm}::${name}`, 300, async () => {
          const r = await axios.get('https://raider.io/api/v1/characters/profile', {
            params: {
              realm,
              name,
              fields: 'mythic_plus_scores_by_season:current,gear,raid_progression',
              apikey: process.env.RAIDERIO_KEY
            }
          });
          return { realm, name, ...r.data };
        })
      )
    );
    res.json(results);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
