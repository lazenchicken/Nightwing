// frontend/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useStatComparison } from '../hooks/useStatComparison';
import FiltersSidebar from '../components/FiltersSidebar';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import StatComparisonChart from '../components/StatComparisonChart';
import Loadout, { GearItem, TalentIcon } from '../components/Loadout';
import GearChart from '../components/GearChart';
import { getGearAverages, GearAverageResponse } from '../api/gearAverage';
import { getArchonStats, ArchonStat } from '../api/archon';

export default function DashboardPage() {
  const { realm, character } = useStore();
  const [gearData, setGearData] = useState<GearAverageResponse | null>(null);
  const [archonStats, setArchonStats] = useState<ArchonStat[]>([]);

  // sidebar visibility toggle
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // TODO: replace with a dropdown or derive from character’s class
  const spec = 'druid-balance-pve';

  const { sortedByActual, loading, error } =
    useStatComparison(spec, realm, character);

  // Fetch gear averages
  useEffect(() => {
    if (realm && character) {
      getGearAverages(realm, character)
        .then(data => setGearData(data))
        .catch(err => console.error('gearAverage error', err));
    }
  }, [realm, character]);

  // Fetch archon stats
  useEffect(() => {
    getArchonStats(spec)
      .then(stats => setArchonStats(stats))
      .catch(err => console.error('archonStats error', err));
  }, [spec]);

  // Sample data for Loadout (will be replaced by live hook data later)
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
              averageIlvl={gearData?.item_level_equipped ?? 0}
              setPieces={gearData?.items.length ?? 0}
              gear={gearData?.items.map(i => ({ id: i.slot, iconUrl: i.icon, itemLevel: i.item_level })) || []}
              classTalents={sampleClassTalents}
              heroTalents={sampleHeroTalents}
              specTalents={sampleSpecTalents}
            />
            {/* Gear comparison table */}
            {/* TODO: integrate real archon & icy data */}
            <GearChart
              gear={gearData?.items.map(i => ({ id: i.slot, iconUrl: i.icon, itemLevel: i.item_level })) || []}
              archonGear={[]}
              icyGear={[]}
              averageIlvl={gearData?.item_level_equipped ?? 0}
              setPieces={gearData?.items.length ?? 0}
              archonAverageIlvl={0}
              icyBestIlvl={0}
            />
          </>

          {/* …rest of page… */}
        </main>
      </div>
    </div>
  );
}