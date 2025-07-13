import axios from 'axios';

export interface RaIOProfile {
  name: string;
  realm: string;
  region: string;
  faction: 'Alliance' | 'Horde';
  class: string;
  spec: string;
  gear: { item_level_equipped: number; items: any[] };
  mythic_plus_scores_by_season: { current: { dungeons: any[] } };
  raid_progression: any;
}

export async function getRaiderProfile(realm: string, name: string): Promise<RaIOProfile> {
  const res = await axios.get<RaIOProfile>('/api/raiderio', {
    params: { realm, name, fields: 'gear,mythic_plus_scores_by_season:current,raid_progression' }
  });
  return res.data;
}
