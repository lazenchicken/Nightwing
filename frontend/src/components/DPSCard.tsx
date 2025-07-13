import React from 'react';
import { useStatComparison } from '../hooks/useStatComparison';
import styles from './DPSCard.module.css';

export default function DPSCard() {
  const { data } = useStatComparison();

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
