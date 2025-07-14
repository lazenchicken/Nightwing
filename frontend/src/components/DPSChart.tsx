import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { useStatComparison } from '../hooks/useStatComparison';
import { useStore } from '../hooks/useStore';

export default function DPSChart() {
  const { realm, character, role } = useStore(); // 'dps' | 'healing' | 'tank'
  const spec = 'druid-balance-pve';
  const { sortedByActual, loading, error } = useStatComparison(spec, realm, character);

  // Display error if fetch failed
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  // Prepare data (placeholder when loading)
  const placeholderStats = ['Haste', 'Crit', 'Versatility', 'Mastery'];
  const placeholderData = placeholderStats.map(stat => ({ stat, icy: 0, archon: 0, actual: 0 }));
  const dataToDisplay = loading ? placeholderData : sortedByActual;

  // Bar color scheme: grey when loading, theme colors otherwise
  const barColors = loading
    ? { actual: '#ccc', archon: '#ccc', icy: '#ccc' }
    : { actual: '#48a9f0', archon: '#f0a848', icy: '#9b5afb' };

  // Dynamic X max: highest of all three series + cushion
  const maxVal = dataToDisplay.length
    ? Math.max(...dataToDisplay.map(s => Math.max(s.actual, s.archon, s.icy)))
    : 0;
  const xMax = Math.ceil((maxVal + 5) / 5) * 5;

  const title =
    role === 'healing' ? 'Healing Priority'
    : role === 'tank'    ? 'Tank Priority'
    :                      'DPS Priority';

  return (
    <div style={{ background: 'var(--panel)', padding: 16, borderRadius: 8 }}>
      <h4 style={{ color: 'var(--fg)' }}>{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={dataToDisplay}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <XAxis
            type="number"
            domain={[0, xMax]}
            tick={{ fill: 'var(--fg)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: '%', position: 'bottom', fill: 'var(--fg)' }}
          />
          <YAxis
            dataKey="stat"
            type="category"
            width={80}
            tick={{ fill: 'var(--fg)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
          <Legend verticalAlign="bottom" height={30} wrapperStyle={{ color: 'var(--fg)' }} />

          <Bar dataKey="actual" name="Actual" fill={barColors.actual} barSize={12} />
          <Bar dataKey="archon" name="Archon.gg" fill={barColors.archon} barSize={12} />
          <Bar dataKey="icy"    name="Icy Veins" fill={barColors.icy} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
