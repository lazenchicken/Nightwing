import axios from 'axios';
import { TalentIcon } from '../components/Loadout';

export interface TalentsResponse {
  classTalents: TalentIcon[];
  heroTalents: TalentIcon[];
  specTalents: TalentIcon[];
}

/**
 * Fetch talents icons for a given character.
 */
export async function getTalents(realm: string, name: string, spec?: string): Promise<TalentsResponse> {
  const res = await axios.get<TalentsResponse>('/api/talents', {
    params: { realm, name, spec }
  });
  return res.data;
}
