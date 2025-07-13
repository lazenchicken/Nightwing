import { useState, useEffect } from 'react';
import axios from 'axios';

export interface AuthUser {
  battletag: string;
  realm: string;
  character: string;
  classKey?: string;
  specKey?: string;
  theme: 'dark' | 'light';
  dateRange: '7d' | '30d' | 'all';
  bossFilter: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<AuthUser>('/user/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
