import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend,
} from 'recharts';
import './StatComparisonChart.module.css';

export interface Stat {
  stat: string;
  icy: number;
  archon: number;
  actual: number;
}

interface Props {
  data: Stat[];
  loading: boolean;
  error: string | null;
}

const PRIMARY_STATS = ['Haste', 'Crit', 'Versatility', 'Mastery'];

export default function StatComparisonChart({ data, loading, error }: Props) {
  if (loading) return <div>Loading chart…</div>;
  if (error)   return <div style={{ color: 'red' }}>Error: {error}</div>;

  // only top-4 stats
  const filtered = data.filter(s => PRIMARY_STATS.includes(s.stat));

  // dynamic X axis max
  const maxVal = Math.max(...filtered.flatMap(s => [s.icy, s.archon, s.actual]));
  const xMax   = Math.ceil((maxVal + 5) / 5) * 5;

  return (
    <div className="chart-container">
      <h3>Stat Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={filtered}
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
        >
          <XAxis type="number" domain={[0, xMax]} />
          <YAxis dataKey="stat" type="category" />
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend verticalAlign="bottom" />

          <Bar dataKey="icy"    name="Icy Veins" fill="#9C69E2" />
          <Bar dataKey="archon" name="Archon.gg" fill="#F5B344" />
          <Bar dataKey="actual" name="Actual"    fill="#6AB4F8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
