import axios from 'axios';

export interface GearSlotAverage {
  slot: string;
  communityAvg: number;
  bis: number;
}

export interface GearAverageResponse {
  item_level_equipped: number;
  items: Array<{
    slot: string;
    item_level: number;
    icon: string;
  }>;
  averages: GearSlotAverage[];
}

/**
 * Fetches community & BIS averages for each gear slot via your backend.
 */
export async function getGearAverages(realm: string, name: string, spec?: string): Promise<GearAverageResponse> {
  const res = await axios.get<GearAverageResponse>('/api/gearAverage', {
    params: { realm, name, spec }
  });
  return res.data;
}
