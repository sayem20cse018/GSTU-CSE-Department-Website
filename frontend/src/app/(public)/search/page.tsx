'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface Result { id:string; type:'news'|'notice'|'event'|'faculty'; title:string; excerpt:string; url:string; date?:string; category?:string }

async function search(q: string): Promise<Result[]> {
  if (!q.trim()) return [];
  const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
  const results: Result[] = [];

  // Search news
  try {
    const r = await fetch(`${api}/news?limit=50`);
    const d = await r.json() as { data?: { data?: {id:string;title:string;excerpt:string;slug:string;category:string;publishedAt?:string;createdAt:string}[] } };
    const items = d.data?.data ?? [];
    const qq = q.toLowerCase();
    for (const n of items) {
      if (n.title.toLowerCase().includes(qq) || n.excerpt.toLowerCase().includes(qq)) {
        results.push({ id:n.id, type:'news', title:n.title, excerpt:n.excerpt, url:`/news/${n.slug}`, date:n.publishedAt??n.createdAt, category:n.category });
      }
    }
  } catch { /* ignore */ }

  // Search faculty
  try {
    const r = await fetch(`${api}/faculty`);
    const d = await r.json() as { data?: {id:string;name:string;designation:string;shortBio?:string;slug?:string;researchInterests?:string[]}[] };
    const qq = q.toLowerCase();
    for (const f of d.data ?? []) {
      if (f.name.toLowerCase().includes(qq) || f.designation.toLowerCase().includes(qq) || (f.researchInterests ?? []).some(r => r.toLowerCase().includes(qq))) {
        results.push({ id:f.id, type:'faculty', title:f.name, excerpt:`${f.designation}${f.shortBio ? ' — ' + f.shortBio.slice(0,100) : ''}`, url:`/faculty/${f.slug??f.id}` });
      }
    }
  } catch { /* ignore */ }

  // Search notices
  try {
    const r = await fetch(`${api}/notices?isPublished=true&limit=50`);
    const d = await r.json() as { data?: {id:string;title:string;description?:string;category:string;publishedAt?:string;createdAt:string}[] };
    const qq = q.toLowerCase();
    for (const n of d.data ?? []) {
      if (n.title.toLowerCase().includes(qq) || (n.description??'').toLowerCase().includes(qq)) {
        results.push({ id:n.id, type:'notice', title:n.title, excerpt:n.description??n.category, url:`/notices`, date:n.publishedAt??n.createdAt, category:n.category });
      }
    }
  } catch { /* ignore */ }

  // Search events
  try {
    const r = await fetch(`${api}/events?limit=50`);
    const d = await r.json() as { data?: { data?: {id:string;title:string;shortDescription?:string;slug:string;type:string;startDate:string}[] } };
    const items = d.data?.data ?? [];
    const qq = q.toLowerCase();
    for (const e of items) {
      if (e.title.toLowerCase().includes(qq) || (e.shortDescription??'').toLowerCase().includes(qq)) {
        results.push({ id:e.id, type:'event', title:e.title, excerpt:e.shortDescription??e.type, url:`/events/${e.slug}`, date:e.startDate, category:e.type });
      }
    }
  } catch { /* ignore */ }

  return results;
}

const TYPE_ICON: Record<string,string> = { news:'📰', notice:'🔔', event:'📅', faculty:'👨‍🏫' };
const TYPE_COLOR: Record<string,string> = { news:'bg-blue-50 text-blue-700 border-blue-200', notice:'bg-amber-50 text-amber-700 border-amber-200', event:'bg-emerald-50 text-emerald-700 border-emerald-200', faculty:'bg-violet-50 text-violet-700 border-violet-200' };

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const query = params.get('q') ?? '';

  useEffect(() => {
    if (!query) { setResults([]); return; }
    setLoading(true);
    search(query).then(r => setResults(r)).finally(() => setLoading(false));
  }, [query]);

  function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const grouped = results.reduce<Record<string,Result[]>>((acc, r) => { (acc[r.type] ??= []).push(r); return acc; }, {});

  return (
    <div className="min-h-screen bg-white">
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container-custom py-2.5">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>›</span>
            <span className="text-slate-800 font-medium">Search</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-oswald)' }}>Search</h1>

        {/* Search box */}
        <form onSubmit={doSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search faculty, news, events, notices…"
              className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"/>
          </div>
          <button type="submit"
            className="px-6 py-3.5 bg-green-700 text-white font-bold rounded-xl hover:bg-green-600 transition">
            Search
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-3 border-green-700 border-t-transparent rounded-full animate-spin"/>
            <p className="text-slate-500">Searching…</p>
          </div>
        )}

        {/* No query */}
        {!loading && !query && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-slate-500">Enter a keyword to search across faculty, news, events and notices.</p>
          </div>
        )}

        {/* No results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😔</p>
            <p className="text-slate-700 font-semibold">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-slate-400 text-sm mt-1">Try different keywords.</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <p className="text-sm text-slate-500 mb-6">
              Found <strong>{results.length}</strong> result{results.length!==1?'s':''} for &ldquo;<strong>{query}</strong>&rdquo;
            </p>
            {(['faculty','news','event','notice'] as const).map(type => {
              const items = grouped[type];
              if (!items?.length) return null;
              return (
                <section key={type} className="mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                    {TYPE_ICON[type]} {type === 'faculty' ? 'Faculty' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{items.length}</span>
                  </h2>
                  <div className="space-y-3">
                    {items.map(r => (
                      <Link key={r.id} href={r.url}
                        className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition-all group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', TYPE_COLOR[r.type])}>
                                {TYPE_ICON[r.type]} {r.type}
                              </span>
                              {r.category && r.category !== r.type && (
                                <span className="text-[10px] text-slate-400">{r.category}</span>
                              )}
                            </div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-green-700 transition line-clamp-1">
                              {r.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{r.excerpt}</p>
                          </div>
                          <svg className="w-4 h-4 text-slate-300 group-hover:text-green-600 shrink-0 mt-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin"/></div>}>
      <SearchContent />
    </Suspense>
  );
}