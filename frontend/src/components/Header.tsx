// frontend/src/components/Header.tsx
import React from 'react';
import styles from './Header.module.css';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Row 1: Brand on left, actions on right */}
      <div className={styles.row1}>
        <div className={styles.brand}>Nightwing</div>
        <div className={styles.actions}>
          {/* e.g. <ThemeToggle /> <HelpIcon /> <LoginButton /> */}
        </div>
      </div>

      {/* Row 2: Full-width search bar */}
      <div className={styles.row2}>
        <SearchBar placeholder="Search players..." />
      </div>
    </header>
  );
}
