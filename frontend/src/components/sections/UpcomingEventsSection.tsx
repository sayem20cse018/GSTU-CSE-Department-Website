import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  coverImage?: string;
  type: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  mode?: string;
  status: string;
  isFeatured: boolean;
  isPublished: boolean;
}

async function fetchEvents(): Promise<Event[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(
      `${api}/events?status=upcoming&limit=6&isPublished=true`,
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return [];
    const json = await res.json() as { data: Event[] | { data: Event[] } };
    const arr = Array.isArray(json.data)
      ? json.data
      : (json.data as { data: Event[] }).data;
    return arr?.length ? arr : [];
  } catch { return []; }
}

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string; gradient: string }> = {
  competition: { label: 'Competition', color: '#b45309', bg: '#fef3c7', icon: '🏆', gradient: 'linear-gradient(135deg,#92400e,#b45309)' },
  workshop:    { label: 'Workshop',    color: '#1d4ed8', bg: '#dbeafe', icon: '🔧', gradient: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' },
  seminar:     { label: 'Seminar',     color: '#6d28d9', bg: '#ede9fe', icon: '🎓', gradient: 'linear-gradient(135deg,#4c1d95,#6d28d9)' },
  conference:  { label: 'Conference',  color: '#065f46', bg: '#d1fae5', icon: '📋', gradient: 'linear-gradient(135deg,#064e3b,#065f46)' },
  hackathon:   { label: 'Hackathon',   color: '#dc2626', bg: '#fee2e2', icon: '💡', gradient: 'linear-gradient(135deg,#991b1b,#dc2626)' },
  cultural:    { label: 'Cultural',    color: '#0891b2', bg: '#e0f2fe', icon: '🎭', gradient: 'linear-gradient(135deg,#164e63,#0891b2)' },
  webinar:     { label: 'Webinar',     color: '#7c3aed', bg: '#f5f3ff', icon: '💻', gradient: 'linear-gradient(135deg,#4c1d95,#7c3aed)' },
  other:       { label: 'Event',       color: '#475569', bg: '#f1f5f9', icon: '📅', gradient: 'linear-gradient(135deg,#0b3d1f,#1a7a3c)' },
};

const MODE_LABEL: Record<string, string> = {
  in_person: '📍 In Person',
  online:    '🌐 Online',
  hybrid:    '🔀 Hybrid',
};

function formatDateBox(startDate: string): { month: string; day: string } {
  const d = new Date(startDate);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate().toString(),
  };
}

function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  if (!endDate) return start.toLocaleDateString('en-GB', opts);
  const end = new Date(endDate);
  if (end.getDate() === start.getDate() && end.getMonth() === start.getMonth()) {
    return start.toLocaleDateString('en-GB', opts);
  }
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-GB', opts)}`;
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function FeaturedEventCard({ ev }: { ev: Event }) {
  const meta = TYPE_META[ev.type] ?? TYPE_META.other;
  const { month, day } = formatDateBox(ev.startDate);
  const days = daysUntil(ev.startDate);
  const dateRange = formatDateRange(ev.startDate, ev.endDate);

  return (
    <article className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      {/* Cover image */}
      <div
        className="relative overflow-hidden"
        style={{ height: '220px', background: meta.gradient, clipPath: 'polygon(0 0, 100% 0, 100% 92%, 94% 100%, 0 100%)' }}
      >
        {ev.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ev.coverImage}
            alt={ev.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-20" aria-hidden="true">{meta.icon}</span>
          </div>
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        {/* Date badge */}
        <div
          className="absolute top-3 left-3 flex flex-col items-center px-3 py-2 rounded-xl text-white text-center shadow-lg"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', minWidth: '52px' }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{month}</span>
          <span className="text-2xl font-black leading-none" style={{ fontFamily: 'var(--font-oswald)' }}>{day}</span>
        </div>
        {/* Featured badge */}
        {ev.isFeatured && (
          <span
            className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full"
            style={{ background: '#fbbf24', color: '#1a1a1a' }}
          >
            ⭐ Featured
          </span>
        )}
        {/* Countdown pill */}
        {days >= 0 && days <= 7 && (
          <div
            className="absolute bottom-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse"
            style={{ background: '#dc2626', color: '#fff' }}
          >
            {days === 0 ? 'Today!' : `${days}d left`}
          </div>
        )}
        {/* Geometric corner accent */}
        <div
          className="absolute top-0 right-0 w-14 h-14 pointer-events-none"
          style={{ background: 'linear-gradient(225deg, rgba(255,255,255,0.1) 50%, transparent 50%)' }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.icon} {meta.label}
          </span>
          {ev.mode && (
            <span className="text-[11px] text-slate-500">{MODE_LABEL[ev.mode] ?? ev.mode}</span>
          )}
        </div>

        <h3
          className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-green-700 transition"
          style={{ fontSize: '1rem' }}
        >
          <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
        </h3>

        {ev.shortDescription && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
            {ev.shortDescription}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {dateRange}
            </span>
            {ev.venue && (
              <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {ev.venue}
              </span>
            )}
          </div>
          <Link
            href={`/events/${ev.slug}`}
            className="shrink-0 inline-flex items-center gap-1 text-sm font-bold transition-colors hover:text-green-800"
            style={{ color: '#166534' }}
          >
            Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactEventCard({ ev }: { ev: Event }) {
  const meta = TYPE_META[ev.type] ?? TYPE_META.other;
  const { month, day } = formatDateBox(ev.startDate);
  const days = daysUntil(ev.startDate);

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-green-300 hover:shadow-md transition-all duration-300">
      {/* Image strip */}
      <div
        className="relative overflow-hidden"
        style={{ height: '120px', background: meta.gradient, clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)' }}
      >
        {ev.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ev.coverImage}
            alt={ev.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20" aria-hidden="true">{meta.icon}</span>
          </div>
        )}
        {/* Date pill */}
        <div
          className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        >
          <span className="text-white font-black text-sm leading-none" style={{ fontFamily: 'var(--font-oswald)' }}>{day}</span>
          <span className="text-white/70 text-[10px] font-semibold uppercase">{month}</span>
        </div>
        {/* Urgent badge */}
        {days >= 0 && days <= 3 && (
          <div
            className="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse"
            style={{ background: '#dc2626', color: '#fff' }}
          >
            {days === 0 ? 'TODAY' : `${days}d`}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <span
          className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 w-fit"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.icon} {meta.label}
        </span>
        <h3
          className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition line-clamp-2 leading-snug mb-auto"
        >
          <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
        </h3>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          {ev.venue ? (
            <span className="text-[10px] text-slate-400 truncate max-w-[110px] flex items-center gap-0.5">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {ev.venue}
            </span>
          ) : <span />}
          <Link
            href={`/events/${ev.slug}`}
            className="text-[10px] font-bold shrink-0 flex items-center gap-0.5 transition-colors hover:text-green-800"
            style={{ color: '#166534' }}
          >
            More
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}
      >
        <span className="text-4xl" aria-hidden="true">📅</span>
      </div>
      <p className="text-slate-600 font-semibold text-base mb-1">No upcoming events</p>
      <p className="text-sm text-slate-400">Events will appear here once published by the admin.</p>
      <Link
        href="/events"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-900 transition"
      >
        Browse all events
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
    </div>
  );
}

export default async function UpcomingEventsSection() {
  const events = await fetchEvents();

  if (!events.length) {
    return (
      <section className="py-10 bg-slate-50" aria-labelledby="events-heading">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-8">
            <h2
              id="events-heading"
              className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
              style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}
            >
              Upcoming Events
            </h2>
            <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
          </div>
          <EmptyState />
        </div>
      </section>
    );
  }

  const [featured, ...rest] = events;

  return (
    <section className="py-10 bg-slate-50" aria-labelledby="events-heading">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <h2
            id="events-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}
          >
            Upcoming Events
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured large card */}
          {featured && (
            <div className="lg:col-span-1">
              <FeaturedEventCard ev={featured} />
            </div>
          )}

          {/* Compact grid on the right */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.slice(0, 4).map(ev => (
              <CompactEventCard key={ev.id} ev={ev} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-7">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c' }}
          >
            All Events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
