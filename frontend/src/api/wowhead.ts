import axios from 'axios';

export interface WowheadIcon {
  url: string;
}

/**
 * Fetch the full URL for a given Wowhead icon name (e.g. "spell_nature_wispsplode").
 */
export async function getWowheadIcon(iconName: string): Promise<string> {
  const res = await axios.get<WowheadIcon>('/api/wowhead', {
    params: { icon: iconName }
  });
  return res.data.url;
}
