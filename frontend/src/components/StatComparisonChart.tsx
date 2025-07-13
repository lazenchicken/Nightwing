import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useStatComparison } from '../hooks/useStatComparison';

interface Props {
  onBarClick?: (stat: string) => void;
}

export default function StatComparisonChart({ onBarClick }: Props) {
  const { data } = useStatComparison();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        onClick={(evt) => {
          const payload = evt.activePayload?.[0]?.payload as any;
          if (payload?.stat && onBarClick) onBarClick(payload.stat);
        }}
      >
        <XAxis dataKey="stat" tick={{ fill: '#ccc' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="icy" name="Icy Veins" fill="#9b5afb" />
        <Bar dataKey="archon" name="Archon.gg" fill="#f0a848" />
        <Bar dataKey="actual" name="Actual" fill="#48a9f0" />
      </BarChart>
    </ResponsiveContainer>
  );
}
