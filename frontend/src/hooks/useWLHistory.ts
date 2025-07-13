import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from './useStore';

export interface WLHistoryPoint {
  timestamp: string;
  weight: number;
}

export function useWLHistory(stat: string) {
  const { realm, character } = useStore();
  const [data, setData] = useState<WLHistoryPoint[]>([]);

  useEffect(() => {
    if (!stat) return;
    axios
      .get<{ history: WLHistoryPoint[] }>('/api/warcraftlogs/history', {
        params: { realm, character, stat },
      })
      .then(r => setData(r.data.history))
      .catch(() => setData([]));
  }, [realm, character, stat]);

  return { data };
}
