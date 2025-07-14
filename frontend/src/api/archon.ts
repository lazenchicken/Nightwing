import axios from 'axios';

export interface ArchonStat {
  stat: string;
  avgWeight: number;
}

/**
 * Fetch Archon.gg stat weights via Warcraft Logs parse-weight proxy
 */
export async function getArchonStats(realm: string, name: string, spec: string): Promise<ArchonStat[]> {
  const res = await axios.get<ArchonStat[]>('/api/archon', {
    params: { realm, name, spec }
  });
  return res.data;
}
