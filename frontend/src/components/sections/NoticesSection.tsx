import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface Notice {
  id: string; title: string; category: string; publishedAt: string; createdAt: string;
  isUrgent?: boolean; isPinned?: boolean;
  attachments?: { fileUrl: string; fileName: string }[];
}

async function fetchNotices(): Promise<Notice[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/notices?isPublished=true&limit=6`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json() as { data?: Notice[] | { data?: Notice[] } };
    const raw = json.data;
    const arr = Array.isArray(raw) ? raw : (raw as { data?: Notice[] })?.data;
    return Array.isArray(arr) ? arr.slice(0, 6) : [];
  } catch { return []; }
}

const CAT: Record<string, { label: string; cls: string }> = {
  academic:         { label: 'Academic',    cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  admission:        { label: 'Admission',   cls: 'bg-violet-50 text-violet-700 border-violet-200' },
  scholarship:      { label: 'Scholarship', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  workshop_seminar: { label: 'Workshop',    cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  recruitment:      { label: 'Recruitment', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  general:          { label: 'General',     cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  result:           { label: 'Result',      cls: 'bg-teal-50 text-teal-700 border-teal-200' },
  administrative:   { label: 'Admin',       cls: 'bg-orange-50 text-orange-700 border-orange-200' },
};

function SplitDate({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day   = d.getDate();
  const year  = d.getFullYear();
  return (
    <div className="shrink-0 w-[72px] flex flex-col items-center justify-center py-3 px-1 text-center"
      style={{ background: '#1b2a4a', color: '#fff', minHeight: '72px' }}>
      <span className="block text-[11px] font-semibold leading-tight">{month}</span>
      <span className="block text-[15px] font-bold leading-tight mt-0.5"
        style={{ fontFamily: 'var(--font-oswald)' }}>{day},</span>
      <span className="block text-[13px] font-semibold leading-tight">{year}</span>
    </div>
  );
}

export default async function NoticesSection() {
  const raw = await fetchNotices();

  // Sort: pinned/urgent first, then newest-to-oldest
  const notices = [...raw].sort((a, b) => {
    if ((b.isUrgent ? 2 : b.isPinned ? 1 : 0) !== (a.isUrgent ? 2 : a.isPinned ? 1 : 0))
      return (b.isUrgent ? 2 : b.isPinned ? 1 : 0) - (a.isUrgent ? 2 : a.isPinned ? 1 : 0);
    return new Date(b.publishedAt ?? b.createdAt).getTime() -
           new Date(a.publishedAt ?? a.createdAt).getTime();
  });

  const [featured, ...rest] = notices;

  if (!featured && rest.length === 0) return null;

  return (
    <section className="py-10 bg-slate-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Notice Board
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-slate-200">
          {/* LEFT — Featured notice */}
          {featured ? (
            <div className="relative overflow-hidden flex flex-col justify-end" style={{ minHeight: '280px' }}>
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(155deg, #0b3d1f 0%, #0d4a26 50%, #0a3018 100%)' }}>
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }}
                  aria-hidden="true" />
              </div>
              <div className="relative p-5 flex flex-col justify-between h-full" style={{ minHeight: '280px' }}>
                <div className="flex flex-wrap gap-2 mb-3 mt-2">
                  {featured.isUrgent && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-500 text-white">URGENT</span>
                  )}
                  {featured.isPinned && !featured.isUrgent && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{ background: 'rgba(251,191,36,0.15)', color: '#fde68a', borderColor: 'rgba(251,191,36,0.3)' }}>
                      📌 PINNED
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                    style={{ background: 'rgba(255,255,255,0.12)', color: '#86efac' }}>
                    {CAT[featured.category]?.label ?? featured.category}
                  </span>
                </div>
                <h3 className="text-white font-bold leading-snug uppercase mb-auto"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.15rem', letterSpacing: '0.03em' }}>
                  <Link href={`/notices`} className="hover:text-green-300 transition-colors">
                    {featured.title}
                  </Link>
                </h3>
                <div className="flex items-center justify-between mt-6 pt-4 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                  <span className="text-xs" style={{ color: 'rgba(134,239,172,0.6)' }}>
                    {new Date(featured.publishedAt ?? featured.createdAt).toLocaleDateString('en-GB')}
                  </span>
                  <div className="flex items-center gap-3">
                    {featured.attachments?.[0] && (
                      <a href={featured.attachments[0].fileUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded transition"
                        style={{ background: '#00bcd4', color: '#fff' }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        DOWNLOAD
                      </a>
                    )}
                    <Link href="/notices"
                      className="flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-green-300"
                      style={{ color: '#4ade80' }}>
                      Read More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-slate-400 text-sm"
              style={{ minHeight: '280px', background: '#0b3d1f' }}>
              No notices available.
            </div>
          )}

          {/* RIGHT — Notice list newest-to-oldest */}
          <div className="flex flex-col divide-y divide-slate-200 border-l border-slate-200">
            {rest.length > 0 ? rest.slice(0, 5).map((notice) => {
              const cat = CAT[notice.category] ?? CAT.general;
              return (
                <div key={notice.id}
                  className="flex items-stretch hover:bg-[#e8f5e9] transition-colors group">
                  <SplitDate dateStr={notice.publishedAt ?? notice.createdAt} />
                  <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {notice.isUrgent && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500 text-white">URGENT</span>
                      )}
                      <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border', cat.cls)}>
                        {cat.label}
                      </span>
                      {notice.attachments?.[0] && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-300 text-slate-500 bg-white">PDF</span>
                      )}
                    </div>
                    <h3 className="font-bold uppercase text-slate-900 group-hover:text-[#1a7a3c] transition-colors line-clamp-2 leading-snug"
                      style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.88rem', letterSpacing: '0.02em' }}>
                      <Link href="/notices">{notice.title}</Link>
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {notice.attachments?.[0] ? (
                        <a href={notice.attachments[0].fileUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded transition hover:opacity-80"
                          style={{ background: '#00bcd4', color: '#fff' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                          </svg>
                          DOWNLOAD
                        </a>
                      ) : (
                        <Link href="/notices"
                          className="text-sm font-semibold transition-colors"
                          style={{ color: '#1a7a3c' }}>
                          Read More
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
                No other notices.
              </div>
            )}
          </div>
        </div>

        {/* See All button */}
        <div className="mt-5">
          <Link href="/notices"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c' }}>
            See All Notices
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
            <svg className="w-4 h-4 -ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
