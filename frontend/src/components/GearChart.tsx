import React from 'react';
import styles from './GearChart.module.css';

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
}


export default function GearChart({ gear, archonGear, icyGear, averageIlvl, setPieces, archonAverageIlvl, icyBestIlvl }: GearChartProps) {
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
        {gear.map(item => (
          <div key={item.id} className={styles.cell}>
            <img src={item.iconUrl} alt="" />
            <div className={styles.levelBadge}>{item.itemLevel}</div>
          </div>
        ))}
        <div className={styles.summaryCell}>{averageIlvl}</div>
      </div>
      {/* Archon.gg gear */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>Archon.gg</div>
        {archonGear.map(item => (
          <div key={item.id} className={styles.cell}>
            <img src={item.iconUrl} alt="" />
            <div className={styles.levelBadge}>{item.itemLevel}</div>
          </div>
        ))}
        <div className={styles.summaryCell}>{archonAverageIlvl}</div>
      </div>
      {/* Icy Veins gear */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>Icy Veins</div>
        {icyGear.map(item => (
          <div key={item.id} className={styles.cell}>
            <img src={item.iconUrl} alt="" />
            <div className={styles.levelBadge}>{item.itemLevel}</div>
          </div>
        ))}
        <div className={styles.summaryCell}>{icyBestIlvl}</div>
      </div>
    </div>
  );
}
