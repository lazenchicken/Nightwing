import { useState, useEffect } from 'react';
import axios from 'axios';

export interface RaIOProfile {
  name: string;
  realm: string;
  mythic_plus_scores_by_season: {
    current: { dungeons: Array<{ name: string; level: number; date: string }> }
  };
  raid_progression: Record<string, { bosses: Array<{ boss: string; heroic_kills: number; mythic_kills: number }> }>;
}

export function useRaiderProfile(realm: string, name: string) {
  const [profile, setProfile] = useState<RaIOProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get<RaIOProfile>('/api/raiderio', {
      params: { realm, name, fields: 'mythic_plus_scores_by_season:current,raid_progression' }
    })
    .then(r => setProfile(r.data))
    .finally(() => setLoading(false));
  }, [realm, name]);

  return { profile, loading };
}
