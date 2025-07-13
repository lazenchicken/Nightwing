import React from 'react';
import { useParams } from 'react-router-dom';
import { useGuild } from '../hooks/useGuild';
import Table, { Column } from '../components/Table';

export default function GuildPage() {
  const { realm, guildName } = useParams<{ realm:string; guildName:string }>();
  const { data: members, loading } = useGuild(realm!, guildName!);

  if (loading) return <div>Loading guild…</div>;

  const cols: Column<any>[] = [
    { header:'Name', key:'character', render:(_v,r)=> r.character.name },
    { header:'Spec',  key:'spec_role',  render:(_v,r)=> r.spec_role.spec_name },
    { header:'M+ Score', key:'mythic_plus_scores_by_season', render:(_v,r)=> r.mythic_plus_scores_by_season.current.score }
  ];

  return (
    <div style={{ padding:16 }}>
      <h2>{guildName} @ {realm}</h2>
      <Table columns={cols} data={members} rowKey={m=>m.character.name} />
    </div>
  );
}
