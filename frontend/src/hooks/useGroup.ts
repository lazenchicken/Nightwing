import { useState } from 'react';
import axios from 'axios';

export function useGroup() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroup = (characters: Array<{ realm: string; name: string }>) => {
    setLoading(true);
    axios.post('/api/group', { characters })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  };

  return { data, loading, fetchGroup };
}
