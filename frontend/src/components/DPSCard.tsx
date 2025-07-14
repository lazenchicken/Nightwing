import React from 'react';
import { useStore } from '../hooks/useStore';
import { useStatComparison } from '../hooks/useStatComparison';
import styles from './DPSCard.module.css';

export default function DPSCard() {
  const { realm, character } = useStore();
  const spec = 'druid-balance-pve';
  const { data } = useStatComparison(spec, realm, character);

  return (
    <div className={styles.card}>
      <h4>DPS & Healing Overview</h4>
      <ul>
        {data.map(({ stat, actual }) => (
          <li key={stat}>
            {stat}: <strong>{actual.toFixed(1)}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
