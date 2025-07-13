import axios from 'axios';

export interface SearchResult {
  name: string;
  realm: string;
  profile_url: string;
}

/**
 * Returns up to 10 Raider.IO character search results for the given query.
 */
export async function searchCharacters(query: string): Promise<SearchResult[]> {
  const res = await axios.get<SearchResult[]>('/api/search/characters', {
    params: { search: query }
  });
  return res.data;
}
