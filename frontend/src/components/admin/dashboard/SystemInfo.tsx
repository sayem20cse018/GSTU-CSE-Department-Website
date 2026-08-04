'use client';
import { useEffect, useState } from 'react';

interface Health { status: string; timestamp: string; version: string }

export default function SystemInfo() {
  const [health,   setHealth]   = useState<Health | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${api}/health`)
      .then(r => r.json())
      .then((d: { data: Health }) => setHealth(d.data))
      .catch(() => setHealth(null))
      .finally(() => setChecking(false));
  }, []);

  const rows = [
    { label:'Backend API',   value: checking ? '…' : health ? 'Online'     : 'Offline',    ok: !!health },
    { label:'Database',      value: checking ? '…' : health ? 'Connected'  : 'Disconnected', ok: !!health },
    { label:'API Version',   value: health?.version ?? '—',   ok: null },
    { label:'Environment',   value: 'development',            ok: null },
  ];

  return (
    <div className="rounded-2xl p-5 border border-white/10" style={{ background:'rgba(255,255,255,0.03)' }}>
      <h3 className="text-sm font-bold text-white mb-4">System Status</h3>
      <div className="space-y-3">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">{row.label}</span>
            <div className="flex items-center gap-1.5">
              {row.ok !== null && (
                <span className={`w-1.5 h-1.5 rounded-full ${row.ok ? 'bg-emerald-400' : 'bg-red-400'}`} aria-hidden="true"/>
              )}
              <span className={`text-xs font-semibold ${row.ok === null ? 'text-slate-300 font-mono' : row.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      {health?.timestamp && (
        <p className="text-[10px] text-slate-600 mt-4 pt-3 border-t border-white/10">
          Last checked: {new Date(health.timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
