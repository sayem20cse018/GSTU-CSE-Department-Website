'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Attachment { fileUrl: string; fileName: string; fileType?: string }
interface Notice {
  id: string; title: string; category: string; description?: string;
  isPublished: boolean; isPinned: boolean; isUrgent: boolean;
  publishedAt?: string; createdAt: string; postedByName?: string;
  attachments?: Attachment[];
}

const CAT_META: Record<string, { label: string }> = {
  academic:         { label: 'Academic' },
  admission:        { label: 'Admission' },
  scholarship:      { label: 'Scholarship' },
  workshop_seminar: { label: 'Workshop/Seminar' },
  recruitment:      { label: 'Recruitment' },
  result:           { label: 'Result' },
  administrative:   { label: 'Administrative' },
  general:          { label: 'General' },
};

function fmtDate(str: string) {
  const d = new Date(str);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleDateString('en-US', { month: 'short' });
  const yr  = d.getFullYear();
  return `${day} ${mon} ${yr}`;
}

export default function NoticesClient({ initialNotices }: { initialNotices: unknown[] }) {
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('');

  // Cast + sort: urgent/pinned first, then newest-to-oldest
  const allNotices = useMemo<Notice[]>(() => {
    const arr = (initialNotices as Notice[]).sort((a, b) => {
      const wa = a.isUrgent ? 2 : a.isPinned ? 1 : 0;
      const wb = b.isUrgent ? 2 : b.isPinned ? 1 : 0;
      if (wb !== wa) return wb - wa;
      return new Date(b.publishedAt ?? b.createdAt).getTime() -
             new Date(a.publishedAt ?? a.createdAt).getTime();
    });
    return arr;
  }, [initialNotices]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allNotices.filter(n => {
      const matchQ = !q || n.title.toLowerCase().includes(q) ||
                     (n.description ?? '').toLowerCase().includes(q);
      const matchC = !catFilter || n.category === catFilter;
      return matchQ && matchC;
    });
  }, [allNotices, search, catFilter]);

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      {/* ── Breadcrumb / nav strip ─────────────────────────────────────────── */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container-custom py-2.5">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <span>›</span>
            <span className="text-slate-800 font-medium">Notices</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* ── Page title ──────────────────────────────────────────────────── */}
        <h1 className="text-3xl font-bold text-slate-900 mb-1"
          style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}>
          ALL NOTICES
        </h1>
        <div className="h-[2px] bg-slate-200 mb-8" aria-hidden="true" />

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search notices…"
              className="w-full border border-slate-300 rounded pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-[#00bcd4]"
            />
          </div>
          <select
            value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] bg-white"
          >
            <option value="">All Categories</option>
            {Object.entries(CAT_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          {(search || catFilter) && (
            <button onClick={() => { setSearch(''); setCatFilter(''); }}
              className="text-sm text-slate-500 hover:text-slate-700 underline">
              Clear
            </button>
          )}
        </div>

        {/* ── Notice count ─────────────────────────────────────────────────── */}
        {search || catFilter ? (
          <p className="text-sm text-slate-500 mb-4">
            Showing {filtered.length} of {allNotices.length} notices
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-4">
            {allNotices.length} notice{allNotices.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* ── Notice list ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-slate-600 font-semibold">No notices found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="space-y-0 border border-slate-200 divide-y divide-slate-200 rounded">
            {filtered.map(n => (
              <NoticeRow key={n.id} notice={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NoticeRow({ notice: n }: { notice: Notice }) {
  const date     = n.publishedAt ?? n.createdAt;
  const hasFile  = (n.attachments?.length ?? 0) > 0;
  const firstFile = n.attachments?.[0];

  return (
    <div className="px-5 py-4 hover:bg-slate-50 transition-colors" style={{ background: '#fff' }}>
      <div className="flex items-start justify-between gap-4">
        {/* Left — date + title */}
        <div className="flex-1 min-w-0">
          {/* Date row */}
          <div className="flex items-center gap-2 mb-1.5">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm font-semibold text-slate-500">{fmtDate(date)}</span>

            {/* Badges */}
            {n.isUrgent && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500 text-white ml-1">URGENT</span>
            )}
            {n.isPinned && !n.isUrgent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white ml-1">PINNED</span>
            )}
          </div>

          {/* Title */}
          <p className="text-base font-semibold text-slate-800 leading-snug" style={{ color: '#1565c0' }}>
            {n.title}
          </p>

          {/* Description if any */}
          {n.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{n.description}</p>
          )}

          {/* Category tag */}
          {n.category && n.category !== 'general' && (
            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
              {CAT_META[n.category]?.label ?? n.category}
            </span>
          )}
        </div>

        {/* Right — Download button (via proxy to force Save As dialog) */}
        {hasFile && firstFile && (
          <a
            href={`/api/download?url=${encodeURIComponent(firstFile.fileUrl)}&name=${encodeURIComponent(firstFile.fileName ?? 'notice')}`}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
            style={{ background: '#00bcd4', minWidth: '120px', justifyContent: 'center' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            DOWNLOAD
          </a>
        )}
      </div>
    </div>
  );
}
