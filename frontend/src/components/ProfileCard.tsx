import React from 'react';
import { useRaiderProfile } from '../hooks/useRaiderProfile';
import styles from './ProfileCard.module.css';

export default function ProfileCard({ realm, name }: { realm: string; name: string }) {
  const { profile, loading } = useRaiderProfile(realm, name);
  if (loading) return <div className={styles.card}>Loading…</div>;
  if (!profile) return <div className={styles.card}>Error</div>;

  const cls = profile.class.toLowerCase(), spec = profile.spec.toLowerCase();
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={`https://wow.zamimg.com/images/wow/icons/large/${cls}.jpg`} className={styles.icon} />
        <img src={`https://wow.zamimg.com/images/wow/icons/large/${spec}.jpg`} className={styles.icon} />
        <div className={styles.name}>Player</div>
      </div>
      <div className={styles.details}>
        <div>ILVL: <strong>{profile.gear.item_level_equipped}</strong></div>
        <div>Faction: <strong>{profile.faction}</strong></div>
        <div>Region: <strong>{profile.region.toUpperCase()}</strong></div>
      </div>
    </div>
  );
}
