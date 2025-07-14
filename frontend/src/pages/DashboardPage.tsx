// frontend/src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useStatComparison } from '../hooks/useStatComparison';
import FiltersSidebar from '../components/FiltersSidebar';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import StatComparisonChart from '../components/StatComparisonChart';
import Loadout, { GearItem, TalentIcon } from '../components/Loadout';
import GearChart from '../components/GearChart';
// Removed duplicate imports

export default function DashboardPage() {
  const { realm, character } = useStore();
  // sidebar visibility toggle
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // TODO: replace with a dropdown or derive from character’s class
  const spec = 'druid-balance-pve';

  const { sortedByActual, loading, error } =
    useStatComparison(spec, realm, character);

  // Sample data for Loadout (will be replaced by live hook data later)
  const sampleGear: GearItem[] = Array.from({ length: 15 }, (_, i) => ({
    id: `gear${i}`,
    iconUrl: 'https://via.placeholder.com/40',
    itemLevel: 681 - (i % 5),
  }));
  const sampleClassTalents: TalentIcon[] = Array.from({ length: 6 }, (_, i) => ({
    id: `class${i}`,
    iconUrl: 'https://via.placeholder.com/40',
  }));
  const sampleHeroTalents: TalentIcon[] = Array.from({ length: 7 }, (_, i) => ({
    id: `hero${i}`,
    iconUrl: 'https://via.placeholder.com/40',
  }));
  const sampleSpecTalents: TalentIcon[] = Array.from({ length: 3 }, (_, i) => ({
    id: `spec${i}`,
    iconUrl: 'https://via.placeholder.com/40',
  }));
  // Sample gear sets for comparison
  const sampleArchonGear: GearItem[] = sampleGear.map((g, i) => ({
    ...g,
    id: `archon-${g.id}`,
    itemLevel: g.itemLevel + 2, // example variation
  }));
  const sampleIcyGear: GearItem[] = sampleGear.map((g, i) => ({
    ...g,
    id: `icy-${g.id}`,
    itemLevel: g.itemLevel - 2, // example variation
  }));

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {sidebarVisible && <FiltersSidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          onToggleSidebar={() => setSidebarVisible(v => !v)}
          isSidebarVisible={sidebarVisible}
        />
        <main style={{ flex: 1, padding: 16, overflow: 'auto', display: 'grid', gap: 16 }}>
          <>
            <ProfileCard realm={realm} name={character} />
            {!error && (
              <StatComparisonChart
                data={sortedByActual}
                loading={loading}
              />
            )}
            {/* Gear loadout display */}
            <Loadout
              averageIlvl={Math.round(
                sampleGear.reduce((sum, g) => sum + g.itemLevel, 0) / sampleGear.length
              )}
              setPieces={4}
              gear={sampleGear}
              classTalents={sampleClassTalents}
              heroTalents={sampleHeroTalents}
              specTalents={sampleSpecTalents}
            />
            {/* Gear comparison table */}
            <GearChart
              gear={sampleGear}
              archonGear={sampleArchonGear}
              icyGear={sampleIcyGear}
              averageIlvl={Math.round(
                sampleGear.reduce((sum, g) => sum + g.itemLevel, 0) / sampleGear.length
              )}
              setPieces={4}
              archonAverageIlvl={Math.round(
                sampleArchonGear.reduce((sum, g) => sum + g.itemLevel, 0) / sampleArchonGear.length
              )}
              icyBestIlvl={Math.max(...sampleIcyGear.map(g => g.itemLevel))}
            />
          </>

          {/* …rest of page… */}
        </main>
      </div>
    </div>
  );
}