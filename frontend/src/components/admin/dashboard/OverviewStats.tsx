'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGet } from '@/lib/api/admin-fetch';

interface Stat { label: string; value: number; icon: string; href: string; color: string }

export default function OverviewStats() {
  const [stats,   setStats]   = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminGet<unknown[]>('/faculty'),
      adminGet<{ pagination: { total: number } }>('/news?admin=true&limit=1'),
      adminGet<{ pagination: { total: number } }>('/events?admin=true&limit=1'),
      adminGet<unknown[]>('/notices?admin=true'),
      adminGet<unknown[]>('/achievements?admin=true'),
      adminGet<unknown[]>('/clubs?admin=true'),
      adminGet<unknown[]>('/alumni?admin=true'),
      adminGet<unknown[]>('/gallery?admin=true'),
      adminGet<{ totalRecords?: number; totalRegistered?: number; onlineNow?: number }>('/students/stats'),
    ]).then(results => {
      const arr = <T,>(r: PromiseSettledResult<T>): T | null =>
        r.status === 'fulfilled' ? r.value : null;
      const pag = (r: PromiseSettledResult<{ pagination: { total: number } }>) =>
        r.status === 'fulfilled' ? (r.value as { pagination?: { total?: number } })?.pagination?.total ?? 0 : 0;
      const len = <T,>(r: PromiseSettledResult<T[]>) =>
        r.status === 'fulfilled' && Array.isArray(r.value) ? r.value.length : 0;

      const studentStats = arr(results[8] as PromiseSettledResult<{ totalRecords?: number; totalRegistered?: number; onlineNow?: number }>);

      setStats([
        { label: 'Faculty',      value: len(results[0] as PromiseSettledResult<unknown[]>), icon: '👨‍🏫', href: '/admin/faculty',      color: 'from-blue-600    to-indigo-700' },
        { label: 'News',         value: pag(results[1] as PromiseSettledResult<{ pagination: { total: number } }>), icon: '📰',  href: '/admin/news',          color: 'from-emerald-600 to-teal-700'   },
        { label: 'Events',       value: pag(results[2] as PromiseSettledResult<{ pagination: { total: number } }>), icon: '📅',  href: '/admin/events',        color: 'from-violet-600  to-purple-700' },
        { label: 'Notices',      value: len(results[3] as PromiseSettledResult<unknown[]>), icon: '🔔', href: '/admin/notices',       color: 'from-amber-600   to-orange-700' },
        { label: 'Achievements', value: len(results[4] as PromiseSettledResult<unknown[]>), icon: '🏆', href: '/admin/achievements',  color: 'from-rose-600    to-pink-700'   },
        { label: 'Clubs',        value: len(results[5] as PromiseSettledResult<unknown[]>), icon: '🏫', href: '/admin/clubs',         color: 'from-cyan-600    to-blue-700'   },
        { label: 'Alumni',       value: len(results[6] as PromiseSettledResult<unknown[]>), icon: '🎓', href: '/admin/alumni',        color: 'from-green-600   to-emerald-700'},
        { label: 'Gallery',      value: len(results[7] as PromiseSettledResult<unknown[]>), icon: '📷', href: '/admin/gallery',       color: 'from-fuchsia-600 to-pink-700'   },
        { label: 'Students',     value: studentStats?.totalRecords ?? 0, icon: '🎒', href: '/admin/students', color: 'from-teal-600 to-cyan-700' },
        { label: 'Online Now',   value: studentStats?.onlineNow ?? 0,    icon: '🟢', href: '/admin/students', color: 'from-lime-600 to-green-700'},
      ]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="h-24 rounded-2xl animate-pulse bg-slate-100"/>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {stats.map(s => (
        <Link
          key={s.label}
          href={s.href}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 hover:scale-[1.04] transition-all duration-200`}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/15 blur-xl" aria-hidden="true"/>
          <p className="text-xl mb-1.5" aria-hidden="true">{s.icon}</p>
          <p className="text-2xl font-black text-white leading-none tabular-nums">{s.value}</p>
          <p className="text-[11px] font-medium mt-1 text-white/80 truncate">{s.label}</p>
        </Link>
      ))}
    </div>
  );
}
