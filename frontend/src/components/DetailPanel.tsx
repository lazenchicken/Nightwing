import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useWLHistory } from '../hooks/useWLHistory';

export default function DetailPanel({ stat }: { stat: string }) {
  const { data } = useWLHistory(stat);

  if (!stat) return null;
  if (data.length === 0) return <div>Loading history…</div>;

  return (
    <div style={{ background: 'var(--panel)', padding: 16, borderRadius: 8 }}>
      <h4>{stat} History</h4>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis hide />
          <Tooltip />
          <Line dataKey="weight" stroke="#9b5afb" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
