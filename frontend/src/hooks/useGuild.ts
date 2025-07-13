import { useState, useEffect } from 'react';
import axios from 'axios';

export function useGuild(realm: string, guildName: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/guild/${realm}/${guildName}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [realm, guildName]);

  return { data, loading };
}
