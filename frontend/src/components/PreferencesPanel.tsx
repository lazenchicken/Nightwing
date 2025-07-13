import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function PreferencesPanel({ onClose }: { onClose():void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    realm: '', character:'', dateRange:'7d', bossFilter:'', theme:'dark'
  });

  useEffect(() => {
    if (user) setForm({
      realm: user.realm, character: user.character,
      dateRange: user.dateRange, bossFilter: user.bossFilter,
      theme: user.theme
    });
  }, [user]);

  const save = async () => {
    await axios.put('/user/preferences', form);
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Preferences</h3>
        {['realm','character','dateRange','bossFilter','theme'].map(key => (
          <label key={key}>
            {key}:
            <input
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <button onClick={save}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
