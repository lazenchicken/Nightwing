import React from 'react';
import styles from './Loadout.module.css';
import { FiCopy } from 'react-icons/fi';

export interface GearItem {
  id: string;
  iconUrl: string;
  itemLevel: number;
}

export interface TalentIcon {
  id: string;
  iconUrl: string;
}

export interface LoadoutProps {
  averageIlvl: number;
  setPieces: number;
  gear: GearItem[];
  classTalents: TalentIcon[];
  heroTalents: TalentIcon[];
  specTalents: TalentIcon[];
}

export default function Loadout({
  averageIlvl,
  setPieces,
  gear,
  classTalents,
  heroTalents,
  specTalents,
}: LoadoutProps) {
  return (
    <div className={styles.loadout}>
      <div className={styles.gearSection}>
        <div className={styles.headerRow}>
          <h2>Gear</h2>
          <div className={styles.statsRow}>
            <span>{averageIlvl} Item Level</span>
            <span>{setPieces} Set Pieces (T33)</span>
          </div>
        </div>
        <div className={styles.gearGrid}>
          {gear.map(item => (
            <div key={item.id} className={styles.gearItem}>
              <img src={item.iconUrl} alt="gear" />
              <div className={styles.ilvlBadge}>{item.itemLevel}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.talentSection}>
        <div className={styles.headerRow}>
          <h2>Talent Build</h2>
          <button className={styles.copyButton} title="Copy">
            <FiCopy />
          </button>
        </div>
        <div className={styles.talentGridContainer}>
          <div className={styles.talentColumn}>
            <div className={styles.talentColumnHeader}>CLASS TALENTS</div>
            <div className={styles.talentGrid}>
              {classTalents.map(t => (
                <img key={t.id} src={t.iconUrl} alt="class talent" />
              ))}
            </div>
          </div>
          <div className={styles.talentColumn}>
            <div className={styles.talentColumnHeader}>HERO TALENTS</div>
            <div className={styles.talentGrid}>
              {heroTalents.map(t => (
                <img key={t.id} src={t.iconUrl} alt="hero talent" />
              ))}
            </div>
          </div>
          <div className={styles.talentColumn}>
            <div className={styles.talentColumnHeader}>SPEC TALENTS</div>
            <div className={styles.talentGrid}>
              {specTalents.map(t => (
                <img key={t.id} src={t.iconUrl} alt="spec talent" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
