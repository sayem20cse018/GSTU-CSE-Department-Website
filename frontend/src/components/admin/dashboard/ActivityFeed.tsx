'use client';
import { useEffect, useState } from 'react';
import { adminGet } from '@/lib/api/admin-fetch';

interface ActivityEntry {
  id: string;
  action: string;
  performedAt: string;
  ipAddress: string | null;
  admin: { name: string; email: string; role: string };
}

const ACTION_META: Record<string, { icon: string; color: string; label: string }> = {
  LOGIN:           { icon: '🔑', color: 'bg-green-100 text-green-700',  label: 'Logged in'       },
  LOGOUT:          { icon: '🚪', color: 'bg-slate-100 text-slate-600',  label: 'Logged out'      },
  CHANGE_PASSWORD: { icon: '🔒', color: 'bg-amber-100 text-amber-700',  label: 'Changed password'},
  CREATE:          { icon: '➕', color: 'bg-blue-100 text-blue-700',    label: 'Created'         },
  UPDATE:          { icon: '✏️', color: 'bg-violet-100 text-violet-700', label: 'Updated'        },
  DELETE:          { icon: '🗑️', color: 'bg-red-100 text-red-700',      label: 'Deleted'         },
};

function metaFor(action: string) {
  // support compound actions like "CREATE_FACULTY"
  const base = action.split('_')[0];
  return ACTION_META[action] ?? ACTION_META[base] ?? { icon: '📋', color: 'bg-slate-100 text-slate-600', label: action };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function roleColor(role: string) {
  if (role === 'super_admin') return 'bg-rose-100 text-rose-700';
  if (role === 'admin')       return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-600';
}

export default function ActivityFeed() {
  const [logs,    setLogs]    = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    adminGet<ActivityEntry[]>('/auth/activity?limit=15')
      .then(setLogs)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-violet-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Recent Activity</h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Last 15 actions</span>
      </div>

      {loading && (
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex gap-3 items-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="p-5 text-sm text-slate-500">Could not load activity log.</p>
      )}

      {!loading && !error && logs.length === 0 && (
        <p className="p-5 text-sm text-slate-500">No activity recorded yet.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <ul className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
          {logs.map(log => {
            const meta = metaFor(log.action);
            return (
              <li key={log.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <span
                  className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${meta.color}`}
                  aria-hidden="true"
                >
                  {meta.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">
                    <span className="font-semibold">{log.admin.name}</span>
                    {' '}
                    <span className="text-slate-500">{meta.label.toLowerCase()}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${roleColor(log.admin.role)}`}>
                      {log.admin.role.replace('_', ' ')}
                    </span>
                    {log.ipAddress && (
                      <span className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</span>
                    )}
                  </div>
                </div>
                <time
                  dateTime={log.performedAt}
                  className="text-[10px] text-slate-400 shrink-0 mt-1 tabular-nums"
                  title={new Date(log.performedAt).toLocaleString()}
                >
                  {timeAgo(log.performedAt)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
