import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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
}

const PRIMARY_STATS = ['Haste', 'Crit', 'Versatility', 'Mastery'];

export default function StatComparisonChart({ data, loading }: Props) {

  // Canned sample data for dev/testing when API returns no stats
  const sampleData: Stat[] = [
    { stat: 'Haste',       icy: 12, archon: 15, actual: 10 },
    { stat: 'Crit',        icy: 10, archon:  9, actual:  8 },
    { stat: 'Versatility', icy:  8, archon: 10, actual:  7 },
    { stat: 'Mastery',     icy:  5, archon:  6, actual:  4 },
  ];

  // Decide data to display: API data or fallback to sampleData
  const dataToDisplay: Stat[] = (data && data.length > 0) ? data : sampleData;
  // Site-specific colors
  const siteColors = { icy: '#9C69E2', archon: '#F5B344', actual: '#6AB4F8' } as const;
  // Bar colors: always use site-specific colors
  // (sampleData used as fallback, no grey placeholders)


  // only top-4 stats
  // only top-4 stats
  // only top-4 stats from displayData
  // only top-4 stats
  const filtered = dataToDisplay.filter(s => PRIMARY_STATS.includes(s.stat));

  // dynamic X axis max
  const maxVal = filtered.length ? Math.max(...filtered.flatMap(s => [s.icy, s.archon, s.actual])) : 0;
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
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: '#2c2c2c',
              border: '1px solid #444',
              borderRadius: '6px',
              padding: '8px'
            }}
            labelStyle={{ color: '#bbb', fontSize: '0.85em' }}
            itemStyle={{ fontSize: '0.85em' }}
            cursor={{ fill: '#444444', opacity: 0.3 }} // add semi-transparent dark overlay on bar hover
          />
          <Legend verticalAlign="bottom" />
          {/* Icy Veins (purple): #9C69E2 */}
          <Bar dataKey="icy"    name="Icy Veins" fill={siteColors.icy} />
          {/* Archon.gg (orange): #F5B344 */}
          <Bar dataKey="archon" name="Archon.gg" fill={siteColors.archon} />
          {/* Actual weights (blue): #6AB4F8 */}
          <Bar dataKey="actual" name="Actual"    fill={siteColors.actual} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
