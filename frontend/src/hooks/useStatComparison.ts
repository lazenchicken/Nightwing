// frontend/src/hooks/useStatComparison.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Stat {
  stat: string;
  icy: number;
  archon: number;
  actual: number;
}

export function useStatComparison(
  spec: string,
  realm: string,
  character: string
) {
  const [data, setData] = useState<Stat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!spec || !realm || !character) {
      // don't run until we have all three values
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get<Stat[]>(
        `/api/stat-comparison`,
        {
          params: { spec, realm, character }
        }
      )
      .then((res) => {
        console.log('stat-comparison payload:', res.data);
        setData(res.data);
      })
      .catch((e) => {
        console.error('stat-comparison error:', e);
        setError(e.message || 'Unknown error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [spec, realm, character]);

  // Sort a copy of the data by the `actual` field descending
  const sortedByActual = [...data].sort((a, b) => b.actual - a.actual);

  return { data, sortedByActual, error, loading };
}
