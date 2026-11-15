'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGet } from '@/lib/api/admin-fetch';

interface AggregateStats {
  faculty: number;
  news: number;
  events: number;
  notices: number;
  achievements: number;
  clubs: number;
  alumni: number;
  galleryAlbums: number;
  studentRecords: number;
  studentRegistered: number;
  onlineNow: number;
  programs: number;
  courses: number;
  labs: number;
  resources: number;
}

interface StatCard {
  label: string;
  value: number;
  icon: string;
  href: string;
  color: string;
}

function buildCards(s: AggregateStats): StatCard[] {
  return [
    { label: 'Faculty',      value: s.faculty,           icon: '👨‍🏫', href: '/admin/faculty',      color: 'from-blue-600 to-indigo-700'    },
    { label: 'News',         value: s.news,              icon: '📰',  href: '/admin/news',          color: 'from-emerald-600 to-teal-700'   },
    { label: 'Events',       value: s.events,            icon: '📅',  href: '/admin/events',        color: 'from-violet-600 to-purple-700'  },
    { label: 'Notices',      value: s.notices,           icon: '🔔',  href: '/admin/notices',       color: 'from-amber-600 to-orange-700'   },
    { label: 'Achievements', value: s.achievements,      icon: '🏆',  href: '/admin/achievements',  color: 'from-rose-600 to-pink-700'      },
    { label: 'Clubs',        value: s.clubs,             icon: '🤝',  href: '/admin/clubs',         color: 'from-cyan-600 to-blue-700'      },
    { label: 'Alumni',       value: s.alumni,            icon: '🎓',  href: '/admin/alumni',        color: 'from-green-600 to-emerald-700'  },
    { label: 'Gallery',      value: s.galleryAlbums,     icon: '📷',  href: '/admin/gallery',       color: 'from-fuchsia-600 to-pink-700'   },
    { label: 'Students',     value: s.studentRecords,    icon: '🎒',  href: '/admin/students',      color: 'from-teal-600 to-cyan-700'      },
    { label: 'Registered',   value: s.studentRegistered, icon: '✅',  href: '/admin/students',      color: 'from-sky-600 to-blue-700'       },
    { label: 'Online Now',   value: s.onlineNow,         icon: '🟢',  href: '/admin/students',      color: 'from-lime-600 to-green-700'     },
    { label: 'Programs',     value: s.programs,          icon: '📚',  href: '/admin/programs',      color: 'from-indigo-600 to-violet-700'  },
  ];
}

export default function OverviewStats() {
  const [cards,   setCards]   = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    adminGet<AggregateStats>('/auth/aggregate-stats')
      .then(data => setCards(buildCards(data)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Could not load stats. Backend may be starting up — refresh in a moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {cards.map(s => (
        <Link
          key={s.label}
          href={s.href}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 hover:scale-[1.04] transition-all duration-200`}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        >
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/15 blur-xl" aria-hidden="true" />
          <p className="text-xl mb-1.5" aria-hidden="true">{s.icon}</p>
          <p className="text-2xl font-black text-white leading-none tabular-nums">{s.value.toLocaleString()}</p>
          <p className="text-[11px] font-medium mt-1 text-white/80 truncate">{s.label}</p>
        </Link>
      ))}
    </div>
  );
}
