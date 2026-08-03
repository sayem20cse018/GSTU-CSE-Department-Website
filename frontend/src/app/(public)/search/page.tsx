'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import SectionHero from '@/components/academics/SectionHero';

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get('q') ?? '');

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const query = params.get('q') ?? '';

  return (
    <>
      <SectionHero tag="Search" title={query ? `Results for "${query}"` : 'Search'}
        breadcrumbs={[{label:'Home',href:'/'},{label:'Search'}]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-2xl">
        <form onSubmit={search} className="flex gap-3 mb-10">
          <input type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search faculty, news, events, notices…"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
          <button type="submit" className="px-6 py-3 text-sm font-bold text-white rounded-xl transition"
            style={{background:'linear-gradient(135deg,#0b3d1f,#166534)'}}>
            Search
          </button>
        </form>
        {query && (
          <div className="text-center py-16 text-slate-400">
            <span className="text-5xl block mb-4" aria-hidden="true">🔍</span>
            <p className="font-semibold text-slate-600">Search results for &ldquo;{query}&rdquo;</p>
            <p className="text-sm mt-2">Full search functionality will be available after backend integration.</p>
          </div>
        )}
      </div></div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"/>
    </div>}>
      <SearchContent/>
    </Suspense>
  );
}
