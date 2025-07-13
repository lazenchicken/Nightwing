import React, { useState } from 'react';
import Table, { Column } from '../components/Table';
import SearchBar from '../components/SearchBar';
import { useMythicRuns } from '../hooks/useMythicRuns';

export default function MythicPage() {
  // allow user override via search
  const [target, setTarget] = useState<{ realm: string; name: string } | null>(null);
  const realm = target?.realm ?? 'Area52';
  const name  = target?.name  ?? 'MyCharacter';

  // fetch runs
  const { runs, loading } = useMythicRuns(realm, name);

  // onSelect handler from SearchBar
  const onSelectChar = (opt: { realm: string; name: string }) => {
    setTarget(opt);
  };

  const columns: Column<any>[] = [
    { header: 'Dungeon', key: 'dungeon' },
    {
      header: 'Level',
      key: 'best_run',
      render: (_v, row) => `+${row.best_run.mythic_level}`
    },
    {
      header: 'Time',
      key: 'best_run',
      render: (_v, row) => `${(row.best_run.clear_time_ms / 60000).toFixed(2)}m`
    },
    { header: 'Date', key: 'completed_at' }
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Mythic+ Recent Runs for {name}</h2>
      <SearchBar onSelect={onSelectChar} />
      {loading
        ? <p>Loading runs…</p>
        : <Table columns={columns} data={runs} rowKey={r => r.completed_at} />
      }
    </div>
  );
}
