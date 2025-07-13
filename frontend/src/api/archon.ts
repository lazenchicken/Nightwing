import axios from 'axios';

export interface ArchonStat {
  stat: string;
  avgWeight: number;
}

export async function getArchonStats(specId: string): Promise<ArchonStat[]> {
  const res = await axios.get<ArchonStat[]>('/api/archon', {
    params: { spec: specId }
  });
  return res.data;
}
