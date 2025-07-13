import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardPage from './DashboardPage';

export default function PlayerPage() {
  const { realm, name } = useParams<{ realm:string; name:string }>();
  // override store defaults here if you like...
  return <DashboardPage />;
}
