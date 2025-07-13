import React, { useState } from 'react';
import Table, { Column } from '../components/Table';
import SearchBar from '../components/SearchBar';
import { useRaidingRoster } from '../hooks/useRaidingRoster';

interface ProfileWithProgress {
  realm: string;
  name: string;
  raid_progression: any;
}

export default function RaidingPage() {
  const guildRealm = 'Area52';
  const guildName  = 'MyGuildName';

  // 1) Load guild roster
  const { roster: guildRoster, loading: guildLoading } =
    useRaidingRoster(guildRealm, guildName);

  // 2) State for any extra lookup
  const [extra, setExtra] = useState<ProfileWithProgress | null>(null);

  // 3) Handler when SearchBar calls onSelect
  const onSelectExtra = async (opt: { realm: string; name: string }) => {
    const res = await fetch(
      `/api/raiderio?realm=${opt.realm}&name=${opt.name}&fields=raid_progression`
    );
    const data = await res.json();
    setExtra({ realm: opt.realm, name: opt.name, raid_progression: data.raid_progression });
  };

  // Combine guild + extra
  const data: ProfileWithProgress[] = [...guildRoster, ...(extra ? [extra] : [])];

  // Define table columns
  const columns: Column<ProfileWithProgress>[] = [
    {
      header: 'Name',
      key: 'name',
      render: (_v, row) => <a href={`/${row.realm}/${row.name}`}>{row.name}</a>
    },
    {
      header: 'Boss Kills (H/M)',
      key: 'raid_progression',
      render: (_v, row) =>
        Object.entries(row.raid_progression)
          .flatMap(([raid, prog]: any) =>
            prog.bosses.map((b: any) => `${b.boss}: H${b.heroic_kills}/M${b.mythic_kills}`)
          )
          .join(' | ')
    }
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Raiding Roster</h2>
      <h4>Guild: {guildName} @ {guildRealm}</h4>

      {guildLoading
        ? <p>Loading guild…</p>
        : <Table columns={columns} data={data} rowKey={r => r.name} />
      }

      <hr />

      <h3>Add Any Character</h3>
      <SearchBar onSelect={onSelectExtra} />
    </div>
  );
}
