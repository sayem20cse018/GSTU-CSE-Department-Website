'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGet } from '@/lib/api/admin-fetch';

interface StudentStats {
  totalRecords: number;
  totalRegistered: number;
  onlineNow: number;
  todayLogins: number;
  totalLoginCount: number;
  lastActivity: string | null;
}

/** Simple SVG horizontal bar — no external library */
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-[11px] tabular-nums font-semibold text-slate-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function StudentStatsWidget() {
  const [stats,   setStats]   = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<StudentStats>('/students/stats')
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const rows = stats
    ? [
        { label: 'Total Records',   value: stats.totalRecords,    color: 'bg-blue-500'    },
        { label: 'Registered',      value: stats.totalRegistered, color: 'bg-emerald-500' },
        { label: 'Active Today',    value: stats.todayLogins,     color: 'bg-amber-500'   },
        { label: 'Online Now',      value: stats.onlineNow,       color: 'bg-green-500'   },
      ]
    : [];

  const maxVal = rows.reduce((m, r) => Math.max(m, r.value), 1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-teal-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Student Overview</h3>
        </div>
        <Link
          href="/admin/students"
          className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 transition"
        >
          Manage →
        </Link>
      </div>

      <div className="p-5">
        {loading && (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-2 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && !stats && (
          <p className="text-sm text-slate-500">Student stats unavailable.</p>
        )}

        {!loading && stats && (
          <>
            {/* Big numbers */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl bg-teal-50 border border-teal-100 p-3 text-center">
                <p className="text-2xl font-black text-teal-700 tabular-nums">{stats.totalRecords.toLocaleString()}</p>
                <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Total Records</p>
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                <p className="text-2xl font-black text-emerald-700 tabular-nums">{stats.totalRegistered.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Registered</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                <p className="text-2xl font-black text-amber-700 tabular-nums">{stats.todayLogins}</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Today&apos;s Logins</p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
                  <p className="text-2xl font-black text-green-700 tabular-nums">{stats.onlineNow}</p>
                </div>
                <p className="text-[11px] text-green-600 font-semibold mt-0.5">Online Now</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="space-y-3">
              {rows.map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-slate-500">{r.label}</span>
                    <span className="text-[11px] font-bold text-slate-700 tabular-nums">{r.value.toLocaleString()}</span>
                  </div>
                  <Bar value={r.value} max={maxVal} color={r.color} />
                </div>
              ))}
            </div>

            {stats.lastActivity && (
              <p className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                Last student activity: {new Date(stats.lastActivity).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
