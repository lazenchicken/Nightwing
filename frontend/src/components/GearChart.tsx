import React from 'react';
import styles from './GearChart.module.css';
import { ArchonStat } from '../api/archon';
import { IcyVeinsWeight } from '../api/icyveins';
import { TalentIcon } from './Loadout';

export interface GearItem {
  id: string;
  iconUrl: string;
  itemLevel: number;
}

interface GearChartProps {
  gear: GearItem[];
  archonGear: GearItem[];
  icyGear: GearItem[];
  averageIlvl: number;
  setPieces: number;
  archonAverageIlvl: number;
  icyBestIlvl: number;
  archonStats?: ArchonStat[];
  icyWeights?: IcyVeinsWeight[];
  classTalents?: TalentIcon[];
  heroTalents?: TalentIcon[];
  specTalents?: TalentIcon[];
}

export default function GearChart({ gear, archonGear, icyGear, averageIlvl, setPieces, archonAverageIlvl, icyBestIlvl,
  archonStats = [], icyWeights = [], classTalents = [], heroTalents = [], specTalents = []
}: GearChartProps) {
  // Use placeholder arrays if no data, to render template cells
  const placeholderCount = 10;
  const equippedItems = gear.length > 0 ? gear : Array.from({ length: placeholderCount }, (_, i) => ({ id: `slot-${i}`, iconUrl: '', itemLevel: 0 }));
  const archonItems = archonGear.length > 0 ? archonGear : Array.from({ length: placeholderCount }, (_, i) => ({ id: `slot-${i}`, iconUrl: '', itemLevel: 0 }));
  const icyItems = icyGear.length > 0 ? icyGear : Array.from({ length: placeholderCount }, (_, i) => ({ id: `slot-${i}`, iconUrl: '', itemLevel: 0 }));
  // Combine talents for display
  const talentList: TalentIcon[] = [...classTalents, ...heroTalents, ...specTalents];
  return (
    <div className={styles.gearTable}>
      {/* Header with title and stats */}
      <div className={styles.headerRow}>
        <h2>Gear</h2>
        <div className={styles.statsRow}>
          <span>{averageIlvl} Item Level</span>
          <span>{setPieces} Set Pieces (T33)</span>
        </div>
      </div>
      {/* Equipped gear */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>Equipped</div>
            {equippedItems.map(item => (
              <div key={item.id} className={styles.cell}>
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt="" />
                ) : (
                  <div className={styles.placeholder} />
                )}
                <div className={styles.levelBadge}>{item.itemLevel || ''}</div>
              </div>
            ))}
        <div className={styles.summaryCell}>{averageIlvl}</div>
      </div>
      {/* Archon.gg gear */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>Archon.gg</div>
            {archonItems.map(item => (
              <div key={item.id} className={styles.cell}>
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt="" />
                ) : (
                  <div className={styles.placeholder} />
                )}
                <div className={styles.levelBadge}>{item.itemLevel || ''}</div>
              </div>
            ))}
        <div className={styles.summaryCell}>{archonAverageIlvl}</div>
      </div>
      {/* Icy Veins gear */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>Icy Veins</div>
            {icyItems.map(item => (
              <div key={item.id} className={styles.cell}>
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt="" />
                ) : (
                  <div className={styles.placeholder} />
                )}
                <div className={styles.levelBadge}>{item.itemLevel || ''}</div>
              </div>
            ))}
        <div className={styles.summaryCell}>{icyBestIlvl}</div>
      </div>
      {/* Recommendations for Archon.gg and Icy Veins */}
      <div className={styles.recommendations}>
        <div className={styles.recommendationSection}>
          <h3>Archon.gg Stat Weights</h3>
          <table className={styles.recommendationTable}>
            <thead><tr><th>Stat</th><th>Weight</th></tr></thead>
            <tbody>
              {archonStats.map(s => (
                <tr key={s.stat}><td>{s.stat}</td><td>{s.avgWeight}</td></tr>
              ))}
            </tbody>
          </table>
          {talentList.length > 0 && (
            <>
              <h4>Average Talent Tree</h4>
              <div className={styles.talentGrid}>
                {talentList.map(t => (
                  <div key={t.id} className={styles.talentIcon}>
                    {t.iconUrl ? <img src={t.iconUrl} alt="" /> : <div className={styles.talentPlaceholder} />}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.recommendationSection}>
          <h3>Icy Veins Stat Weights</h3>
          <table className={styles.recommendationTable}>
            <thead><tr><th>Stat</th><th>Weight</th></tr></thead>
            <tbody>
              {icyWeights.map(w => (
                <tr key={w.stat}><td>{w.stat}</td><td>{w.weight}</td></tr>
              ))}
            </tbody>
          </table>
          {talentList.length > 0 && (
            <>
              <h4>Recommended Talent Tree</h4>
              <div className={styles.talentGrid}>
                {talentList.map(t => (
                  <div key={t.id} className={styles.talentIcon}>
                    {t.iconUrl ? <img src={t.iconUrl} alt="" /> : <div className={styles.talentPlaceholder} />}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
