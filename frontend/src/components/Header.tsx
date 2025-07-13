import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header style={{
      padding: '1rem', background: 'var(--panel)',
      display: 'flex', alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, color: 'var(--fg)' }}>Nightwing</h1>
      <div style={{ marginLeft: 'auto' }}>
        {loading
          ? '…'
          : user
            ? <form method="post" action="/auth/logout"><button>Logout</button></form>
            : <a href="/auth/bnet"><img src="/assets/bnet-logo.png" alt="Login" style={{ height:32 }} /></a>
        }
      </div>
    </header>
  );
}
