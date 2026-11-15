'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGet } from '@/lib/api/admin-fetch';

interface PendingCounts {
  draftNews: number;
  draftNotices: number;
  expiredNotices: number;
  upcomingEvents: number;
  incompleteFaculty: number;
  unregisteredStudents: number;
}

interface AggregateStats {
  pending: PendingCounts;
}

interface Task {
  label: string;
  count: number;
  href: string;
  color: string;
  icon: string;
  /** Higher = more urgent */
  priority: number;
}

function buildTasks(p: PendingCounts): Task[] {
  return [
    {
      label: 'Draft News',
      count: p.draftNews,
      href: '/admin/news',
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      icon: '📰',
      priority: p.draftNews > 0 ? 2 : 0,
    },
    {
      label: 'Draft Notices',
      count: p.draftNotices,
      href: '/admin/notices',
      color: 'border-amber-200 bg-amber-50 text-amber-700',
      icon: '🔔',
      priority: p.draftNotices > 0 ? 3 : 0,
    },
    {
      label: 'Expired Notices',
      count: p.expiredNotices,
      href: '/admin/notices',
      color: 'border-red-200 bg-red-50 text-red-700',
      icon: '⚠️',
      priority: p.expiredNotices > 0 ? 4 : 0,
    },
    {
      label: 'Upcoming Events',
      count: p.upcomingEvents,
      href: '/admin/events',
      color: 'border-violet-200 bg-violet-50 text-violet-700',
      icon: '📅',
      priority: p.upcomingEvents > 0 ? 1 : 0,
    },
    {
      label: 'Incomplete Faculty Profiles',
      count: p.incompleteFaculty,
      href: '/admin/faculty',
      color: 'border-blue-200 bg-blue-50 text-blue-700',
      icon: '👨‍🏫',
      priority: p.incompleteFaculty > 0 ? 2 : 0,
    },
    {
      label: 'Students Without Account',
      count: p.unregisteredStudents,
      href: '/admin/students',
      color: 'border-teal-200 bg-teal-50 text-teal-700',
      icon: '🎒',
      priority: p.unregisteredStudents > 0 ? 1 : 0,
    },
  ]
    .filter(t => t.count > 0)
    .sort((a, b) => b.priority - a.priority);
}

export default function PendingTasksWidget() {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    adminGet<AggregateStats>('/auth/aggregate-stats')
      .then(data => setTasks(buildTasks(data.pending)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const totalPending = tasks.reduce((s, t) => s + t.count, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-orange-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Pending Tasks</h3>
        </div>
        {!loading && !error && totalPending > 0 && (
          <span className="text-[11px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">
            {totalPending}
          </span>
        )}
      </div>

      <div className="p-5">
        {loading && (
          <div className="space-y-2.5 animate-pulse">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-slate-400">Could not load pending tasks.</p>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <span className="text-3xl" aria-hidden="true">✅</span>
            <p className="text-sm font-semibold text-slate-600">All caught up!</p>
            <p className="text-xs text-slate-400">No pending tasks right now.</p>
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-2">
            {tasks.map(task => (
              <Link
                key={task.label}
                href={task.href}
                className={`flex items-center gap-3 p-3 rounded-xl border ${task.color} hover:opacity-90 transition-opacity`}
              >
                <span className="text-base shrink-0" aria-hidden="true">{task.icon}</span>
                <span className="flex-1 text-sm font-semibold truncate">{task.label}</span>
                <span className="shrink-0 text-sm font-black tabular-nums">{task.count}</span>
                <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
