import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PlayerPage    from './pages/PlayerPage';
import GuildPage     from './pages/GuildPage';
import GroupPage     from './pages/GroupPage';
import RaidingPage   from './pages/RaidingPage';
import MythicPage    from './pages/MythicPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/:realm/:name" element={<PlayerPage />} />
      <Route path="/guild/:realm/:guildName" element={<GuildPage />} />
      <Route path="/group" element={<GroupPage />} />
      <Route path="/raiding" element={<RaidingPage />} />
      <Route path="/mythic" element={<MythicPage />} />
    </Routes>
  );
}
