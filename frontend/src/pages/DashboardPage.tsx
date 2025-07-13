// frontend/src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useStatComparison } from '../hooks/useStatComparison';
import StatComparisonChart from '../components/StatComparisonChart';

export default function DashboardPage() {
  const { realm, character } = useStore();

  // Hard-code spec for now or pull from your own UI
  const spec = 'druid-balance-pve';

  const { data, sortedByActual, error, loading } = useStatComparison(
    spec,
    realm,
    character
  );

  return (
    <div>
      {/* … other layout … */}

      {loading && <p>Loading chart…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <StatComparisonChart
          data={sortedByActual}
          onBarClick={(stat) => console.log('clicked', stat)}
        />
      )}
    </div>
  );
}
