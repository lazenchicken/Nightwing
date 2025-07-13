import React, { useState } from 'react';
import Header from '../components/Header';
import FiltersSidebar from '../components/FiltersSidebar';
import ProfileCard from '../components/ProfileCard';
import StatComparisonChart from '../components/StatComparisonChart';
import DPSCard from '../components/DPSCard';
import MythicProgression from '../components/MythicProgression';
import RaidProgression from '../components/RaidProgression';
import DetailPanel from '../components/DetailPanel';
import { useStore } from '../hooks/useStore';

export default function DashboardPage() {
  // Pull realm & character from global store
  const { realm, character } = useStore();

  // Track which stat bar was clicked
  const [selectedStat, setSelectedStat] = useState<string>('');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left sidebar of filters */}
      <FiltersSidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ padding: 16, overflow: 'auto', display: 'grid', gap: 16 }}>
          {/* Profile summary */}
          <ProfileCard realm={realm} name={character} />

          {/* Stat comparison chart with click handler */}
          <StatComparisonChart
            onBarClick={(statName) => setSelectedStat(statName)}
          />

          {/* Two-column grid for DPS card and Mythic/Raid cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <DPSCard />
            <MythicProgression realm={realm} name={character} />
            <RaidProgression realm={realm} name={character} />
          </div>

          {/* Detail panel for the clicked stat */}
          <DetailPanel stat={selectedStat} />
        </main>
      </div>
    </div>
  );
}
