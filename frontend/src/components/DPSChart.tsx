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
  const { sortedByActual } = useStatComparison();
  const { role } = useStore(); // 'dps' | 'healing' | 'tank'

  if (!sortedByActual.length) return <div>Loading chart…</div>;

  // Dynamic X max: highest of all three series + cushion
  const maxVal = Math.max(
    ...sortedByActual.map(s => Math.max(s.actual, s.archon, s.icy))
  );
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
          data={sortedByActual}
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

          <Bar dataKey="actual" name="Actual" fill="#48a9f0" barSize={12} />
          <Bar dataKey="archon" name="Archon.gg" fill="#f0a848" barSize={12} />
          <Bar dataKey="icy"    name="Icy Veins" fill="#9b5afb" barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
