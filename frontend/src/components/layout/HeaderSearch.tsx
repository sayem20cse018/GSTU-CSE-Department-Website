'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeaderSearch({ dark = false }: { dark?: boolean }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setQuery(''); }
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
        <svg className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${dark ? 'text-white/40' : 'text-slate-400'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search…" aria-label="Search"
          className={`pl-8 pr-3 py-1.5 text-[11px] rounded-lg w-28 focus:outline-none focus:w-40 transition-all duration-300 ${
            dark
              ? 'text-white placeholder-white/30'
              : 'text-slate-700 placeholder-slate-400'
          }`}
          style={dark
            ? { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }
            : { background: '#f1f5f9', border: '1px solid #e2e8f0' }
          }/>
      </div>
    </form>
  );
}
