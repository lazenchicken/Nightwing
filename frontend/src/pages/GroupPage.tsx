import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import Table, { Column } from '../components/Table';
import { useGroup } from '../hooks/useGroup';

export default function GroupPage() {
  const { data: profiles, loading, fetchGroup } = useGroup();
  const [list, setList] = useState<{realm:string;name:string}[]>([]);

  const add = (opt:{realm:string;name:string}) => {
    const arr = [...list, opt];
    setList(arr);
    fetchGroup(arr);
  };

  const cols:Column<any>[] = [
    { header:'Name', key:'name' },
    { header:'M+ Score', key:'mythic_plus_scores_by_season', render:(_v,r)=> r.mythic_plus_scores_by_season.current.score }
  ];

  return (
    <div style={{ padding:16 }}>
      <h2>Group</h2>
      <SearchBar onSelect={add} />
      {loading ? <p>Loading…</p> : <Table columns={cols} data={profiles} rowKey={p=>p.name} />}
    </div>
  );
}
