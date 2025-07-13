import React from 'react';
import styles from './FiltersSidebar.module.css';
import { useStore } from '../hooks/useStore';
import { useAuth } from '../hooks/useAuth';

export default function FiltersSidebar() {
  const { user } = useAuth();
  const { realm, character /*, dateRange, bossFilter, setDateRange, setBossFilter */ } = useStore();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3>Character</h3>
        <div>{realm} — {character}</div>
      </div>

      <div className={styles.section}>
        <h3>Date Range</h3>
        <select
          // value={dateRange}
          // onChange={e => setDateRange(e.target.value as any)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className={styles.section}>
        <h3>Boss</h3>
        <select
          // value={bossFilter}
          // onChange={e => setBossFilter(e.target.value)}
        >
          <option value="">All bosses</option>
          <option value="Shriekwing">Shriekwing</option>
          <option value="Huntsman Altimor">Huntsman</option>
          {/* add more boss names dynamically if desired */}
        </select>
      </div>

      <div className={styles.footer}>
        <small>Theme: {user?.theme}</small>
      </div>
    </aside>
  );
}
