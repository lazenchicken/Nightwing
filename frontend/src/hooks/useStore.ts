import create from 'zustand';

interface StoreState {
  realm: string;
  character: string;
  specKey: string;
  setRealm: (r: string) => void;
  setCharacter: (c: string) => void;
  setSpecKey: (k: string) => void;
}

export const useStore = create<StoreState>(set => ({
  realm: 'Area52',
  character: 'MyCharacter',
  specKey: 'druid-balance-pve',
  setRealm: (realm) => set({ realm }),
  setCharacter: (character) => set({ character }),
  setSpecKey: (specKey) => set({ specKey }),
}));
