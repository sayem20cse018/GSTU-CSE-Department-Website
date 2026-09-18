import type { Metadata } from 'next';
import { Suspense } from 'react';
import NoticesClient from './NoticesClient';

export const metadata: Metadata = { title: 'All Notices — GSTU CSE' };
export const dynamic = 'force-dynamic';

async function fetchAllNotices() {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/notices?isPublished=true&limit=100`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json() as { data?: unknown[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch { return []; }
}

export default async function NoticesPage() {
  const notices = await fetchAllNotices();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00bcd4] border-t-transparent rounded-full animate-spin"/>
      </div>
    }>
      <NoticesClient initialNotices={notices} />
    </Suspense>
  );
}
