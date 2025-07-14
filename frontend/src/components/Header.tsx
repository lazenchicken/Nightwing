// frontend/src/components/Header.tsx
import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.css';
import SearchBar from './SearchBar';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
}
export default function Header({ onToggleSidebar, isSidebarVisible }: HeaderProps) {
  return (
    <header className={styles.header}>
      {/* Row 1: Brand on left, actions on right */}
      <div className={styles.row1}>
        <div className={styles.menuIcon} onClick={onToggleSidebar}>
          {/* toggle sidebar visibility */}
          {isSidebarVisible ? <FaTimes /> : <FaBars />}
        </div>
        <div className={styles.brand}>Nightwing</div>
        <div className={styles.actions}>
          {/* e.g. <ThemeToggle /> <HelpIcon /> <LoginButton /> */}
        </div>
      </div>

      {/* Row 2: Full-width search bar */}
      <div className={styles.row2}>
        <SearchBar placeholder="Search players..." onSelect={() => {}} />
      </div>
    </header>
  );
}
