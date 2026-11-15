'use client';
import { useEffect, useState } from 'react';

interface UmamiStats {
  pageviews:   { value: number; prev: number };
  visitors:    { value: number; prev: number };
  visits:      { value: number; prev: number };
  bounces:     { value: number; prev: number };
  totaltime:   { value: number; prev: number };
}

function Delta({ now, prev }: { now: number; prev: number }) {
  const diff = now - prev;
  if (diff === 0) return <span className="text-[10px] text-slate-400">—</span>;
  const sign = diff > 0 ? '+' : '';
  return (
    <span className={`text-[10px] font-semibold ${diff > 0 ? 'text-green-600' : 'text-red-500'}`}>
      {sign}{diff.toLocaleString()}
    </span>
  );
}

function StatTile({ label, value, prev }: { label: string; value: number; prev: number }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
      <p className="text-[11px] text-slate-500 font-medium">{label}</p>
      <p className="text-xl font-black text-slate-800 tabular-nums mt-0.5">{value.toLocaleString()}</p>
      <Delta now={value} prev={prev} />
    </div>
  );
}

export default function AnalyticsWidget() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiUrl  = process.env.NEXT_PUBLIC_UMAMI_URL ?? '';
  const umamiUser = process.env.NEXT_PUBLIC_UMAMI_USERNAME;
  const umamiPass = process.env.NEXT_PUBLIC_UMAMI_PASSWORD;

  const [stats,   setStats]   = useState<UmamiStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!websiteId || !umamiUrl || !umamiUser || !umamiPass) return;

    setLoading(true);

    // Umami API: get stats for last 7 days
    const end   = Date.now();
    const start = end - 7 * 24 * 60 * 60 * 1000;

    // We call via our own proxy to keep credentials server-side
    fetch(`/api/analytics/stats?start=${start}&end=${end}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { data?: UmamiStats; error?: string }) => {
        if (d.error) { setError(d.error); return; }
        setStats(d.data ?? null);
      })
      .catch(() => setError('Could not reach analytics API'))
      .finally(() => setLoading(false));
  }, [websiteId, umamiUrl, umamiUser, umamiPass]);

  // ── Not configured ──────────────────────────────────────────────────────
  if (!websiteId) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2" aria-hidden="true">📊</p>
        <p className="text-sm font-semibold text-slate-700">Analytics Not Configured</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Set <code className="bg-slate-100 px-1 rounded text-[11px]">NEXT_PUBLIC_UMAMI_WEBSITE_ID</code> in
          your Vercel environment variables to enable visitor analytics.
        </p>
        <a
          href="https://umami.is"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          Learn about Umami ↗
        </a>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────
  if (error || !stats) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-sm text-slate-500">
          {error || 'Analytics data unavailable.'}
        </p>
      </div>
    );
  }

  // ── Stats ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-blue-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Visitor Analytics</h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Last 7 days · Umami
        </span>
      </div>
      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Page Views"   value={stats.pageviews.value}  prev={stats.pageviews.prev} />
        <StatTile label="Unique Visitors" value={stats.visitors.value} prev={stats.visitors.prev} />
        <StatTile label="Visits"       value={stats.visits.value}     prev={stats.visits.prev} />
        <StatTile label="Avg. Session" value={Math.round((stats.totaltime.value / (stats.visits.value || 1)) / 60)} prev={0} />
      </div>
    </div>
  );
}
