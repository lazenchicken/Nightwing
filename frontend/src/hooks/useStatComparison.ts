// frontend/src/hooks/useStatComparison.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Stat {
  stat: string;
  icy: number;
  archon: number;
  actual: number;
}

export function useStatComparison() {
  const [data, setData] = useState<Stat[]>([]);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  setLoading(true);
  fetch(`/api/stat-comparison?spec=${spec}&realm=${realm}&character=${character}`)
    .then(r => r.json())
    .then(json => {
      console.log('stat-comparison payload:', json);
      setData(json);
      setLoading(false);
    })
    .catch(e => {
      setError(e.message);
      setLoading(false);
    });
}, [spec, realm, character]);

  // Sort a copy of the data by the `actual` field descending
  const sortedByActual = [...data].sort((a, b) => b.actual - a.actual);

  // Return a CLEAN object literal, no stray commas or comments inside
  return { sortedByActual, error };
}
