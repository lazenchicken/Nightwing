import React, { useMemo, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';

// Option for characters or guilds
interface Option { label: string; value: { id?: number; realm?: string; name: string; level?: number } }
// Grouped options for AsyncSelect
interface OptionGroup { label: string; options: Option[] }
type SearchBarProps = { onSelect: (opt: { realm?:string; name:string }) => void; placeholder?: string };
export default function SearchBar({ onSelect, placeholder }: SearchBarProps) {
  // Debounced fetcher invoking callback with options
  const debouncedFetch = useMemo(
    () => debounce(
      async (input: string, callback: (opts: OptionGroup[]) => void) => {
        if (!input) {
          callback([]);
          return;
        }
        try {
          const [charsRes, guildsRes] = await Promise.all([
            fetch(`/api/search/characters?search=${encodeURIComponent(input)}`),
            fetch(`/api/search/guilds?search=${encodeURIComponent(input)}`),
          ]);
          const [charsData, guildsData] = await Promise.all([charsRes.json(), guildsRes.json()]);
          const charOpts: Option[] = charsData.map((x:{id:number; name:string; realm:string; level:number}) => ({
            label: `${x.name} — ${x.realm} (lvl ${x.level})`,
            value: { id: x.id, realm: x.realm, name: x.name, level: x.level }
          }));
          const guildOpts: Option[] = guildsData.map((g:{id:number; name:string; realm:string}) => ({
            label: `${g.name} <${g.realm}>`,
            value: { id: g.id, name: g.name, realm: g.realm }
          }));
          const groups: OptionGroup[] = [];
          if (charOpts.length) groups.push({ label: 'Characters', options: charOpts });
          if (guildOpts.length) groups.push({ label: 'Guilds', options: guildOpts });
          callback(groups);
        } catch (err) {
          console.error('search error', err);
          callback([]);
        }
      },
      300
    ),
    []
  );
  // Wrap into promise-based loader
  const loadOptions = (input: string) =>
    new Promise<OptionGroup[]>(resolve => {
      debouncedFetch(input, resolve);
    });
  // Cancel on unmount
  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  return (
    <AsyncSelect<Option>
      cacheOptions
      loadOptions={loadOptions}
      onChange={opt => opt && onSelect(opt.value)}
      placeholder={placeholder}
    />
  );
}
