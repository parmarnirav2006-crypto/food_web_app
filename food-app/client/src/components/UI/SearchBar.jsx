import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchBar({ value, onChange, placeholder = 'Search restaurants or cuisines...' }) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input pl-12"
      />
    </div>
  );
}

export default SearchBar;
