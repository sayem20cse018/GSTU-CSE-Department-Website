'use client';
import { useEffect, useState } from 'react';

interface Health { status: string; timestamp: string; version: string }

type RowStatus = 'ok' | 'error' | 'neutral';
interface Row { label: string; value: string; status: RowStatus }

const DOT: Record<RowStatus, string> = {
  ok:      'bg-emerald-400',
  error:   'bg-red-400',
  neutral: 'bg-slate-300',
};
const TEXT: Record<RowStatus, string> = {
  ok:      'text-emerald-700',
  error:   'text-red-600',
  neutral: 'text-slate-600',
};

export default function SystemInfo() {
  const [health,   setHealth]   = useState<Health | null>(null);
  const [checking, setChecking] = useState(true);
  const [latency,  setLatency]  = useState<number | null>(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'https://gstu-cse-department-website.onrender.com/api';
    const t0 = performance.now();
    fetch(`${api}/health`, { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { data: Health }) => {
        setHealth(d.data);
        setLatency(Math.round(performance.now() - t0));
      })
      .catch(() => setHealth(null))
      .finally(() => setChecking(false));
  }, []);

  const env = process.env.NODE_ENV ?? 'unknown';
  const isOnline = !checking && health !== null;
  const isError  = !checking && health === null;

  const rows: Row[] = [
    {
      label: 'Backend API',
      value: checking ? 'Checking…' : isOnline ? 'Online' : 'Offline',
      status: checking ? 'neutral' : isOnline ? 'ok' : 'error',
    },
    {
      label: 'Database',
      value: checking ? '…' : isOnline ? 'Connected' : 'Unknown',
      status: checking ? 'neutral' : isOnline ? 'ok' : 'neutral',
    },
    {
      label: 'Response',
      value: latency !== null ? `${latency} ms` : '—',
      status: latency !== null ? (latency < 400 ? 'ok' : latency < 1200 ? 'neutral' : 'error') : 'neutral',
    },
    {
      label: 'API Version',
      value: health?.version ?? '—',
      status: 'neutral',
    },
    {
      label: 'Environment',
      value: env,
      status: 'neutral',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-green-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">System Health</h3>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            checking
              ? 'bg-slate-50 border-slate-200 text-slate-500'
              : isOnline
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              checking ? 'bg-slate-300' : isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
            aria-hidden="true"
          />
          {checking ? 'Checking' : isOnline ? 'All systems OK' : 'Degraded'}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">{row.label}</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT[row.status]}`} aria-hidden="true" />
              <span className={`text-xs font-semibold ${TEXT[row.status]} font-mono`}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Render links */}
      <div className="px-5 pb-4 flex gap-2 flex-wrap border-t border-slate-100 pt-3">
        <a
          href="https://gstu-cse-department-website.onrender.com/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-slate-500 hover:text-green-700 transition"
        >
          API Docs ↗
        </a>
        <span className="text-slate-200">·</span>
        <a
          href="https://cse-department-gstu.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-slate-500 hover:text-green-700 transition"
        >
          Live Site ↗
        </a>
        <span className="text-slate-200">·</span>
        <a
          href="https://github.com/sayem20cse018/GSTU-CSE-Department-Website"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-slate-500 hover:text-green-700 transition"
        >
          GitHub ↗
        </a>
      </div>

      {isError && (
        <div className="mx-5 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700">
          Render free tier may be sleeping. First request can take up to 60 s to wake.
        </div>
      )}
    </div>
  );
}
