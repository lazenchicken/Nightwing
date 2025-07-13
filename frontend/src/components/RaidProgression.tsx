import React from 'react';
import { useRaiderProfile } from '../hooks/useRaiderProfile';
import styles from './RaidProgression.module.css';

export default function RaidProgression({ realm, name }: { realm: string; name: string }) {
  const { profile, loading } = useRaiderProfile(realm, name);

  if (loading || !profile) return <div>Loading Raid…</div>;

  return (
    <div className={styles.card}>
      <h4>Raid Progression</h4>
      {Object.entries(profile.raid_progression).map(([raid, prog]) => (
        <div key={raid}>
          <h5>{raid}</h5>
          <ul>
            {prog.bosses.map(b => (
              <li key={b.boss}>{b.boss}: H{b.heroic_kills} / M{b.mythic_kills}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
