// frontend/src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useStatComparison } from '../hooks/useStatComparison';
import StatComparisonChart from '../components/StatComparisonChart';

export default function DashboardPage() {
  const { realm, character } = useStore();
  // TODO: replace with a dropdown or derive from character’s class
  const spec = 'druid-balance-pve';

  const { sortedByActual, loading, error } =
    useStatComparison(spec, realm, character);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <FiltersSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: 16, overflow: 'auto', display: 'grid', gap: 16 }}>
          <ProfileCard realm={realm} name={character} />

          {/* stat chart */}
          <StatComparisonChart
            data={sortedByActual}
            loading={loading}
            error={error}
          />

          {/* …rest of page… */}
        </main>
      </div>
    </div>
  );
}