'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: string;
  doi: string | null;
  url: string | null;
  facultyName: string;
}

const TYPE_LABEL: Record<string, string> = {
  journal:    'Journal',
  conference: 'Conference',
  book:       'Book Chapter',
  thesis:     'Thesis',
};

export default function RecentPublicationsWidget() {
  const [pubs,    setPubs]    = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    // Public endpoint — no auth cookie needed
    fetch('/api/public/faculty/publications/recent?limit=5', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { data?: Publication[] }) => setPubs(d.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-blue-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Latest Publications</h3>
        </div>
        <Link
          href="/admin/research/publications"
          className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 transition"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="p-5 space-y-4 animate-pulse">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 bg-slate-100 rounded w-4/5" />
              <div className="h-2.5 bg-slate-100 rounded w-3/5" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="px-5 py-4 text-sm text-slate-400">Could not load publications.</p>
      )}

      {!loading && !error && pubs.length === 0 && (
        <p className="px-5 py-4 text-sm text-slate-400">
          No publications found. Add them via Faculty profiles.
        </p>
      )}

      {!loading && !error && pubs.length > 0 && (
        <ul className="divide-y divide-slate-50">
          {pubs.map(pub => {
            const link = pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
            return (
              <li key={pub.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="flex-1 min-w-0">
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors line-clamp-2 leading-snug"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
                        {pub.title}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {pub.facultyName}
                      {pub.authors && pub.authors !== pub.facultyName && (
                        <span className="text-slate-400"> · {pub.authors}</span>
                      )}
                    </p>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {TYPE_LABEL[pub.type] ?? pub.type}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{pub.venue}</span>
                      <span className="text-[10px] font-bold text-slate-500 tabular-nums">{pub.year}</span>
                    </div>
                  </div>

                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 mt-0.5 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Open publication"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
