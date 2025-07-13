// frontend/src/components/StatComparisonChart.tsx
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
import './StatComparisonChart.module.css';

const PRIMARY_STATS = ['Haste', 'Crit', 'Versatility', 'Mastery'];

export default function StatComparisonChart() {
  const { sortedByActual } = useStatComparison();
  const data = sortedByActual.filter(s => PRIMARY_STATS.includes(s.stat));
  if (!data.length) return <div className="loading">Loading chart…</div>;

  // Compute axis max
  const maxVal = Math.max(...data.flatMap(s => [s.icy, s.archon, s.actual]));
  const xMax = Math.ceil((maxVal + 5) / 5) * 5;

  return (
    <div className="container">
      <h4 className="title">Stat Comparison</h4>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 20 }}
          cursor={{ fill: 'transparent' }}
        >
          <XAxis
            type="number"
            domain={[0, xMax]}
            tick={{ fill: 'var(--fg-muted)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: '%', position: 'bottom', fill: 'var(--fg-muted)' }}
          />
          <YAxis
            dataKey="stat"
            type="category"
            width={100}
            tick={{ fill: 'var(--fg)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
  cursor={false}        // turn off the little hover bar entirely
  contentStyle={{
    backgroundColor: 'var(--panel)',   // match your panel bg
    border: '1px solid var(--border)', // subtle outline
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    color: 'var(--fg)'
  }}
  labelStyle={{ color: 'var(--fg-muted)' }}
  itemStyle={{ color: 'var(--fg)' }}
  formatter={(v: number) => `${v.toFixed(1)}%`}
/>

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: 'var(--fg-muted)' }}
          />

          {/* Explicit color fills */}
          <Bar dataKey="icy"    name="Icy Veins"  fill="#9b5afb" barSize={14} />
          <Bar dataKey="archon" name="Archon.gg" fill="#f0a848" barSize={14} />
          <Bar dataKey="actual" name="Actual"    fill="#48a9f0" barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
