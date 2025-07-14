import React, { useState } from 'react';
import styles from './FiltersSidebar.module.css';
import { useStore } from '../hooks/useStore';
import { useAuth } from '../hooks/useAuth';
import { FaChevronDown, FaChevronRight, FaListUl, FaChartLine, FaGlobe, FaTable } from 'react-icons/fa';

export default function FiltersSidebar() {
  const { user } = useAuth();
  const { realm, character /*, dateRange, bossFilter, setDateRange, setBossFilter */ } = useStore();

  // sample static nav data
  const game = 'WOW: THE WAR WITHIN';
  const [contentType, setContentType] = useState<'Raids'|'Mythic+ Dungeons'>('Raids');
  // toggle collapse for Content Type dropdown
  const [contentTypeOpen, setContentTypeOpen] = useState(true);
  // collapse toggles for Game and Expansions
  const [gameOpen, setGameOpen] = useState(true);
  const [expansionOpen, setExpansionOpen] = useState(true);
  // sample dungeon list
  const dungeons = [
    'Atal\'Dazar',
    'Freehold',
    'Shrine of the Storm'
  ];
  const expansion = 'The War Within';
  const raids = [
    'Liberation of Undermine',
    'Nerub-ar Palace',
    'Blackrock Depths'
  ];
  // selection for single raid or dungeon
  const [selectedRaid, setSelectedRaid] = useState(raids[0]);
  const [selectedDungeon, setSelectedDungeon] = useState(dungeons[0]);

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setGameOpen(open => !open)}
          >
            <h3>Game</h3>
            {gameOpen ? (
              <FaChevronDown className={styles.chevron} />
            ) : (
              <FaChevronRight className={styles.chevron} />
            )}
          </div>
          {gameOpen && <div className={styles.value}>{game}</div>}
        </div>
        {/* Expansions section now above Content Type */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setExpansionOpen(open => !open)}
          >
            <h3>Expansions</h3>
            {expansionOpen ? (
              <FaChevronDown className={styles.chevron} />
            ) : (
              <FaChevronRight className={styles.chevron} />
            )}
          </div>
          {expansionOpen && <div className={styles.value}>{expansion}</div>}
        </div>
        {/* Content Type section moved below Expansions */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setContentTypeOpen(open => !open)}
          >
            <h3>Content Type</h3>
            {contentTypeOpen ? (
              <FaChevronDown className={styles.chevron} />
            ) : (
              <FaChevronRight className={styles.chevron} />
            )}
          </div>
          {contentTypeOpen && (
            <select
              className={styles.valueSelect}
              value={contentType}
              onChange={e => setContentType(e.target.value as any)}
            >
              <option value="Raids">Raids</option>
              <option value="Mythic+ Dungeons">Mythic+ Dungeons</option>
            </select>
          )}
        </div>
        {/* Single-item selector for either raids or dungeons */}
        {contentType === 'Raids' ? (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Raid</h3>
              <FaChevronDown className={styles.chevron} />
            </div>
            <select
              className={styles.valueSelect}
              value={selectedRaid}
              onChange={e => setSelectedRaid(e.target.value)}
            >
              {raids.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ul className={styles.raidNav}>
              <li><FaListUl className={styles.icon} />Rankings</li>
              <li><FaChartLine className={styles.icon} />Statistics</li>
              <li><FaGlobe className={styles.icon} />Progress</li>
              <li><FaTable className={styles.icon} />All Reports</li>
            </ul>
          </div>
        ) : (
          <>  
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Dungeon</h3>
                <FaChevronDown className={styles.chevron} />
              </div>
              <select
                className={styles.valueSelect}
                value={selectedDungeon}
                onChange={e => setSelectedDungeon(e.target.value)}
              >
                {dungeons.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className={styles.raidSection}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.raidTitle}>{selectedDungeon}</h4>
                <FaChevronDown className={styles.chevron} />
              </div>
              <ul className={styles.raidNav}>
                <li><FaListUl className={styles.icon} />Rankings</li>
                <li><FaChartLine className={styles.icon} />Statistics</li>
                <li><FaGlobe className={styles.icon} />Progress</li>
                <li><FaTable className={styles.icon} />All Reports</li>
              </ul>
            </div>
          </>
        )}
      </nav>
      <div className={styles.footer}>
        <small>Theme: {user?.theme}</small>
      </div>
    </aside>
  );
}
