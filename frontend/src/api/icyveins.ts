import axios from 'axios';

export interface IcyVeinsWeight {
  stat: string;
  weight: number;
}

/**
 * Scrapes Icy Veins for a given spec slug (e.g. "druid-balance-pve").
 */
export async function getIcyVeinsWeights(slug: string): Promise<IcyVeinsWeight[]> {
  const res = await axios.get<IcyVeinsWeight[]>(`/api/icyveins/${slug}`);
  return res.data;
}
