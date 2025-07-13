// frontend/src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import FiltersSidebar from '../components/FiltersSidebar';
import ProfileCard from '../components/ProfileCard';
import StatComparisonChart from '../components/StatComparisonChart';
import MythicProgression from '../components/MythicProgression';
import RaidProgression from '../components/RaidProgression';
import DetailPanel from '../components/DetailPanel';
import { useStore } from '../hooks/useStore';
import ErrorPanel from '../components/ErrorPanel';
import { useStatComparison } from '../hooks/useStatComparison';

export default function DashboardPage() {
  const { realm, character } = useStore();
  const [selectedStat, setSelectedStat] = useState<string>('');
    const { error: statError } = useStatComparison();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100vh' }}>
      <FiltersSidebar />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: 16, display: 'grid', gap: 24, overflow: 'auto' }}>
          {/* Only show this if there's a real message */}
          <ErrorPanel message={statError?.message} />

          <ProfileCard realm={realm} name={character} />
          <StatComparisonChart />
          {/* …rest of your page… */}
        </main>
      </div>
    </div>
  );
}
