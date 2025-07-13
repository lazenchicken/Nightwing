import { Router } from 'express';
import axios from 'axios';
import { cacheable } from '../cache';

const router = Router();

router.get('/:realm/:guildName', async (req, res) => {
  const { realm, guildName } = req.params;
  try {
    const data = await cacheable(`guild::${realm}::${guildName}`, 300, async () => {
      const r = await axios.get('https://raider.io/api/v1/guilds/profile', {
        params: {
          region: 'us',
          realm,
          guildName,
          fields: 'members,mythic_plus_best_runs,raid_progression',
          apikey: process.env.RAIDERIO_KEY
        }
      });
      return r.data.members.map((m: any) => ({
        character: { name: m.name, realm },
        spec_role: m.spec_role,
        mythic_plus_scores_by_season: { current: m.mythic_plus_best_runs },
        raid_progression: m.raid_progression
      }));
    });
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
