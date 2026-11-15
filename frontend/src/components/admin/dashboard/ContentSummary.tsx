'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGet } from '@/lib/api/admin-fetch';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NoticeItem {
  id: string;
  title: string;
  isUrgent: boolean;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  category: string | null;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  category: string | null;
}

interface EventItem {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  venue: string;
  type: string | null;
  isPublished: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeDate(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function futureDate(iso: string): string {
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  const days = Math.ceil(diff / 86_400_000);
  if (days <= 0)  return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7)   return `In ${days} days`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ─── Recent Notices ───────────────────────────────────────────────────────────

function RecentNotices() {
  const [items,   setItems]   = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<NoticeItem[]>('/notices?admin=true')
      .then(data => setItems(data.slice(0, 5)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-amber-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Recent Notices</h3>
        </div>
        <Link href="/admin/notices" className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 transition">
          Manage →
        </Link>
      </div>

      {loading && <SkeletonList />}

      {!loading && items.length === 0 && (
        <p className="px-5 py-4 text-sm text-slate-400">No notices found.</p>
      )}

      {!loading && items.length > 0 && (
        <ul className="divide-y divide-slate-50">
          {items.map(n => (
            <li key={n.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
              <span
                className={`mt-0.5 shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                  n.isUrgent ? 'bg-red-500' : n.isPinned ? 'bg-amber-500' : 'bg-slate-300'
                }`}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 truncate font-medium">{n.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {n.isUrgent && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>
                  )}
                  {!n.isPublished && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Draft</span>
                  )}
                  {n.category && (
                    <span className="text-[10px] text-slate-400">{n.category}</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                {relativeDate(n.publishedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Recent News ──────────────────────────────────────────────────────────────

function RecentNews() {
  const [items,   setItems]   = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<{ data: NewsItem[] }>('/news?admin=true&limit=5&page=1')
      .then(r => setItems(r.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-emerald-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Recent News</h3>
        </div>
        <Link href="/admin/news" className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition">
          Manage →
        </Link>
      </div>

      {loading && <SkeletonList />}

      {!loading && items.length === 0 && (
        <p className="px-5 py-4 text-sm text-slate-400">No news articles found.</p>
      )}

      {!loading && items.length > 0 && (
        <ul className="divide-y divide-slate-50">
          {items.map(n => (
            <li key={n.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
              <span
                className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${n.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 truncate font-medium">{n.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {n.isFeatured && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Featured</span>
                  )}
                  {!n.isPublished && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Draft</span>
                  )}
                  {n.category && (
                    <span className="text-[10px] text-slate-400">{n.category}</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                {relativeDate(n.publishedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Upcoming Events ──────────────────────────────────────────────────────────

function UpcomingEvents() {
  const [items,   setItems]   = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the public upcoming endpoint — returns next 10 published events
    fetch('/api/public/events/upcoming', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { data?: EventItem[] }) => setItems((d.data ?? []).slice(0, 5)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-violet-500" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-700">Upcoming Events</h3>
        </div>
        <Link href="/admin/events" className="text-[11px] font-semibold text-violet-700 hover:text-violet-800 transition">
          Manage →
        </Link>
      </div>

      {loading && <SkeletonList />}

      {!loading && items.length === 0 && (
        <p className="px-5 py-4 text-sm text-slate-400">No upcoming events scheduled.</p>
      )}

      {!loading && items.length > 0 && (
        <ul className="divide-y divide-slate-50">
          {items.map(ev => (
            <li key={ev.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-100 flex flex-col items-center justify-center border border-violet-200">
                <span className="text-[9px] font-bold text-violet-600 uppercase leading-none">
                  {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-sm font-black text-violet-800 leading-none">
                  {new Date(ev.startDate).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 truncate font-medium">{ev.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{ev.venue || '—'}</p>
              </div>
              <span className="text-[10px] font-semibold text-violet-600 shrink-0 tabular-nums">
                {futureDate(ev.startDate)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Shared skeleton ──────────────────────────────────────────────────────────

function SkeletonList() {
  return (
    <div className="p-5 space-y-3 animate-pulse">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="w-2 h-2 rounded-full bg-slate-100 shrink-0" />
          <div className="flex-1 h-3 bg-slate-100 rounded" />
          <div className="w-10 h-3 bg-slate-100 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { RecentNotices, RecentNews, UpcomingEvents };
