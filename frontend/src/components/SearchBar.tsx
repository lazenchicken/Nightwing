import React from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';

interface Option { label: string; value: { realm:string; name:string } }
export default function SearchBar({ onSelect }: { onSelect: (opt:Option) => void }) {
  const load = debounce(async (input:string) => {
    if (!input) return [];
    const r = await fetch(`/api/search/characters?search=${encodeURIComponent(input)}`);
    const data = await r.json();
    return data.map((x:{name:string;realm:string}) => ({
      label: `${x.name} — ${x.realm}`,
      value: { realm:x.realm, name:x.name }
    }));
  }, 300);

  return (
    <AsyncSelect<Option>
      cacheOptions
      loadOptions={load}
      onChange={opt => opt && onSelect(opt)}
      placeholder="Search players..."
    />
  );
}
