'use client';

import { useEffect, useState } from 'react';
import Badge from '../ui/Badge';

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
}

export default function SystemInfo() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${apiUrl}/health`)
      .then((r) => r.json())
      .then((d: { data: HealthStatus }) => setHealth(d.data))
      .catch(() => setHealth(null))
      .finally(() => setChecking(false));
  }, []);

  const rows = [
    { label: 'Backend API', value: checking ? 'Checking…' : health ? 'Online' : 'Offline',
      badge: checking ? 'neutral' as const : health ? 'success' as const : 'danger' as const },
    { label: 'Database', value: health ? 'Connected' : 'Disconnected',
      badge: health ? 'success' as const : 'danger' as const },
    { label: 'API Version', value: health?.version ?? '—', badge: null },
    { label: 'Environment', value: process.env.NODE_ENV ?? 'development', badge: null },
  ];

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">System Status</h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">{row.label}</span>
            {row.badge ? (
              <Badge variant={row.badge}>{row.value}</Badge>
            ) : (
              <span className="text-xs font-mono text-slate-300">{row.value}</span>
            )}
          </div>
        ))}
      </div>

      {health?.timestamp && (
        <p className="text-[10px] text-slate-600 mt-4 border-t border-white/5 pt-3">
          Last checked: {new Date(health.timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
