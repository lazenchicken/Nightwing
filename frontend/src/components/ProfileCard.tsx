import React from 'react';
import { useRaiderProfile } from '../hooks/useRaiderProfile';
import styles from './ProfileCard.module.css';

export default function ProfileCard({ realm, name }: { realm: string; name: string }) {
  const { profile, loading } = useRaiderProfile(realm, name);
  // Sample data for placeholder
  const sampleProfile: any = {
    name: name,
    realm: realm,
    mythic_plus_scores_by_season: { current: { dungeons: [
      { name: 'Dungeon A', level: 1000, date: '' },
      { name: 'Dungeon B', level: 1000, date: '' },
      { name: 'Dungeon C', level: 1000, date: '' },
      { name: 'Dungeon D', level: 37,   date: '' }
    ] } },
    raid_progression: {
      'Liberation of Undermine': {
        bosses: Array.from({ length: 8 }, (_, i) => ({
          boss: `Boss ${i+1}`,
          heroic_kills: i < 6 ? 1 : 0,
          mythic_kills: i < 3 ? 1 : 0
        }))
      }
    }
  };
  // Use sampleProfile when loading, no profile, or missing key data
  const displayProfile: any =
    loading || !profile || !profile.mythic_plus_scores_by_season
      ? sampleProfile
      : profile;
  // derive avatar URL from WoW Armory render service
  const realmSlug = (displayProfile.realm ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const nameSlug = (displayProfile.name ?? '').toLowerCase();
  const avatarUrl = `https://render-us.worldofwarcraft.com/character/${realmSlug}/${nameSlug}.jpg`;
  // aggregate stats
  const score = (
    displayProfile.mythic_plus_scores_by_season?.current?.dungeons ?? []
  ).reduce((sum: number, d: any) => sum + d.level, 0);
  // extract first raid progression entry
  const raidEntries = Object.entries(displayProfile.raid_progression) as [string, any][];
  const [raidName, raidProg] = raidEntries[0] || ['Unknown', { bosses: [] }];
  const total = raidProg.bosses.length;
  const mythic = raidProg.bosses.filter((b: any) => b.mythic_kills).length;
  const heroic = raidProg.bosses.filter((b: any) => b.heroic_kills).length;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={avatarUrl} alt={`${displayProfile.name} avatar`} className={styles.icon} />
        <div className={styles.nameSection}>
          <h4 className={styles.name}>{displayProfile.name}</h4>
          <div className={styles.server}>(US) {displayProfile.realm}</div>
        </div>
        <a
          href={`https://raider.io/characters/${displayProfile.realm}/${displayProfile.name}`}
          target="_blank" rel="noopener noreferrer"
          className={styles.link}
        >↗</a>
      </div>
      <div className={styles.stats}>
        <div className={styles.box}>
          <div className={styles.boxValue}>{score.toLocaleString()}</div>
          <div className={styles.boxLabel}>Best Mythic+ Score</div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxValue}>{mythic}/{total} M</div>
          <div className={styles.boxLabel}>{raidName}</div>
        </div>
        <div className={styles.box}>
          <div className={styles.boxValue}>{heroic}/{total} H</div>
          <div className={styles.boxLabel}>{raidName}</div>
        </div>
      </div>
    </div>
  );
}
