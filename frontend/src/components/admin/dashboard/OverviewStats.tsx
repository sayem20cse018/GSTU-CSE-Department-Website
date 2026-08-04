'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stat { label: string; value: string | number; icon: string; href: string; color: string }

export default function OverviewStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    Promise.allSettled([
      fetch(`${api}/faculty`),
      fetch(`${api}/news?limit=1`),
      fetch(`${api}/events?limit=1`),
      fetch(`${api}/notices?limit=1`),
      fetch(`${api}/achievements?limit=1`),
      fetch(`${api}/clubs`),
    ]).then(async results => {
      const get = async (r: PromiseSettledResult<Response>, path: string) => {
        if (r.status !== 'fulfilled' || !r.value.ok) return 0;
        try {
          const d = await r.value.json() as Record<string, unknown>;
          if (path === 'faculty' || path === 'clubs' || path === 'achievements') {
            return Array.isArray(d.data) ? (d.data as unknown[]).length : 0;
          }
          const inner = d.data as Record<string,unknown>;
          return (inner?.pagination as {total:number})?.total ?? 0;
        } catch { return 0; }
      };

      const [f, n, e, no, ac, cl] = await Promise.all([
        get(results[0],'faculty'), get(results[1],'news'),
        get(results[2],'events'), get(results[3],'notices'),
        get(results[4],'achievements'), get(results[5],'clubs'),
      ]);

      setStats([
        { label:'Faculty',      value:f,  icon:'👨‍🏫', href:'/admin/faculty',      color:'from-blue-600 to-indigo-700' },
        { label:'News',         value:n,  icon:'📰', href:'/admin/news',          color:'from-emerald-600 to-teal-700' },
        { label:'Events',       value:e,  icon:'📅', href:'/admin/events',        color:'from-violet-600 to-purple-700' },
        { label:'Notices',      value:no, icon:'🔔', href:'/admin/notices',       color:'from-amber-600 to-orange-700' },
        { label:'Achievements', value:ac, icon:'🏆', href:'/admin/achievements',  color:'from-rose-600 to-pink-700' },
        { label:'Clubs',        value:cl, icon:'🏫', href:'/admin/clubs',         color:'from-cyan-600 to-blue-700' },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background:'rgba(255,255,255,0.05)' }}/>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map(s => (
        <Link key={s.label} href={s.href}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 hover:scale-[1.03] transition-all`}
          style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.25)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 blur-xl" aria-hidden="true"/>
          <p className="text-2xl mb-2" aria-hidden="true">{s.icon}</p>
          <p className="text-2xl font-black text-white leading-none">{s.value}</p>
          <p className="text-xs font-medium mt-1.5 text-white/75">{s.label}</p>
        </Link>
      ))}
    </div>
  );
}
