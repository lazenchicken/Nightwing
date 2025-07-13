import { useState, useEffect } from 'react';
import axios from 'axios';

export interface MemberProfile {
  realm: string;
  name: string;
  raid_progression: any;
}

export function useRaidingRoster(guildRealm: string, guildName: string) {
  const [roster, setRoster] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/guild/${guildRealm}/${guildName}`)
      .then(res => {
        const members = res.data.members.map((m: any) => ({
          realm: m.character.realm,
          name: m.character.name,
          raid_progression: m.raid_progression
        }));
        setRoster(members);
      })
      .finally(() => setLoading(false));
  }, [guildRealm, guildName]);

  return { roster, loading };
}
