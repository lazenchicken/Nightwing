// frontend/src/components/Header.tsx
import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.css';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
}
export default function Header({ onToggleSidebar, isSidebarVisible }: HeaderProps) {
  const navigate = useNavigate();
  const { setRealm, setCharacter } = useStore();
  const handleSelect = (opt: { realm?: string; name: string }) => {
    const { realm, name, level } = opt;
    if (!realm || !name) return;
    setRealm(realm);
    setCharacter(name);
    // level indicates a character; otherwise treat as guild
    if (level !== undefined) {
      navigate(`/${realm}/${name}`);
    } else {
      navigate(`/guild/${realm}/${name}`);
    }
  };
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
        <SearchBar placeholder="Search players..." onSelect={handleSelect} />
      </div>
    </header>
  );
}
