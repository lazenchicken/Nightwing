import axios from 'axios';

export interface BestParse {
  percentile: number;
  fightName: string;
}

export async function getBestParse(realm: string, name: string): Promise<BestParse> {
  const res = await axios.get<BestParse>('/api/warcraftlogs/best', { params: { realm, name } });
  return res.data;
}
