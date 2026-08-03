'use client';

import { useEffect, useState } from 'react';
import StatCard from '../ui/StatCard';

interface Stats {
  faculty: number;
  news: number;
  events: number;
  notices: number;
}

function FacultyIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function NoticeIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} className="w-full h-full" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export default function OverviewStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
        const [facultyRes, newsRes, eventsRes] = await Promise.allSettled([
          fetch(`${apiUrl}/faculty`),
          fetch(`${apiUrl}/news?limit=1`),
          fetch(`${apiUrl}/events?limit=1`),
        ]);

        const faculty = facultyRes.status === 'fulfilled' && facultyRes.value.ok
          ? ((await facultyRes.value.json()) as { data: unknown[] }).data?.length ?? 0
          : 0;

        const newsTotal = newsRes.status === 'fulfilled' && newsRes.value.ok
          ? ((await newsRes.value.json()) as { data: { pagination: { total: number } } })
              .data?.pagination?.total ?? 0
          : 0;

        const eventsTotal = eventsRes.status === 'fulfilled' && eventsRes.value.ok
          ? ((await eventsRes.value.json()) as { data: { pagination: { total: number } } })
              .data?.pagination?.total ?? 0
          : 0;

        setStats({ faculty, news: newsTotal, events: eventsTotal, notices: 0 });
      } catch {
        setStats({ faculty: 0, news: 0, events: 0, notices: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Faculty Members', value: stats?.faculty ?? '—', icon: <FacultyIcon />, color: 'blue' as const },
    { label: 'Published News', value: stats?.news ?? '—', icon: <NewsIcon />, color: 'emerald' as const },
    { label: 'Total Events', value: stats?.events ?? '—', icon: <EventIcon />, color: 'violet' as const },
    { label: 'Active Notices', value: stats?.notices ?? '—', icon: <NoticeIcon />, color: 'amber' as const },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-900 border border-white/10 rounded-xl p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
