// frontend/src/hooks/useStore.ts
import create from 'zustand';

interface Store {
  realm: string;
  character: string;
  role: 'dps' | 'healing' | 'tank';
  setRealm: (r: string) => void;
  setCharacter: (c: string) => void;
  setRole: (r: 'dps'|'healing'|'tank') => void;
}

export const useStore = create<Store>((set) => ({
  realm: 'Area52',
  character: 'lazendk',
  role: 'dps',    // default; can switch via some UI
  setRealm: (r) => set({ realm: r }),
  setCharacter: (c) => set({ character: c }),
  setRole: (r) => set({ role: r })
}));
