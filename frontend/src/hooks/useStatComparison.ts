import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from './useStore';

export interface StatComparison {
  stat: string;
  icy: number;
  archon: number;
  actual: number;
}

export function useStatComparison() {
  const specKey = useStore(s => s.specKey);
  const [data, setData] = useState<StatComparison[]>([]);

  useEffect(() => {
    axios
      .get<StatComparison[]>('/api/stat-comparison', { params: { spec: specKey } })
      .then(r => setData(r.data))
      .catch(() => setData([]));
  }, [specKey]);

  return { data };
}
