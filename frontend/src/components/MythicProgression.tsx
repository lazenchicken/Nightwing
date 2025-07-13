import React from 'react';
import { useRaiderProfile } from '../hooks/useRaiderProfile';
import styles from './MythicProgression.module.css';

export default function MythicProgression({ realm, name }: { realm: string; name: string }) {
  const { profile, loading } = useRaiderProfile(realm, name);

  if (loading || !profile) return <div>Loading Mythic+…</div>;

  return (
    <div className={styles.card}>
      <h4>Mythic+ Scores</h4>
      <ul>
        {profile.mythic_plus_scores_by_season.current.dungeons.map(d => (
          <li key={d.name}>
            {d.name}: +{d.level} ({new Date(d.date).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
