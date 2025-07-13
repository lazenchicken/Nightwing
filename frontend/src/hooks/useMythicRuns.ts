import { useState, useEffect } from 'react';
import axios from 'axios';

export interface DungeonRun {
  dungeon: string;
  best_run: { mythic_level: number; clear_time_ms: number };
  completed_at: string;
}

export function useMythicRuns(realm: string, name: string) {
  const [runs, setRuns] = useState<DungeonRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/raiderio', {
      params: { realm, name, fields: 'mythic_plus_recent_runs' }
    })
      .then(res => setRuns(res.data.mythic_plus_recent_runs))
      .finally(() => setLoading(false));
  }, [realm, name]);

  return { runs, loading };
}
