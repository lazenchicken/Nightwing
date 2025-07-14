// frontend/src/hooks/useStatComparison.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Stat {
  stat: string;
  icy:   number;
  archon:number;
  actual:number;
}

export function useStatComparison(
  spec: string,
  realm: string,
  character: string
) {
  const [data,    setData]    = useState<Stat[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,  setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get<Stat[]>('/api/stat-comparison', {
        params: { spec, realm, character },
      })
      .then(r => {
        setData(r.data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [spec, realm, character]);

  const sortedByActual = [...data].sort((a,b)=> b.actual - a.actual);

  return { data, sortedByActual, loading, error };
}
