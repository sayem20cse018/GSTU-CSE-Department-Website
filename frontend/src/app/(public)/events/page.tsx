import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = { title: 'Events — GSTU CSE' };
export const dynamic = 'force-dynamic';

interface Ev {
  id: string; title: string; slug: string; shortDescription?: string;
  description?: string; coverImage?: string; type: string; mode: string;
  startDate: string; endDate?: string; venue?: string;
  status: string; isFeatured: boolean; isPublished: boolean;
}

async function fetchEvents(): Promise<Ev[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/events?limit=50`, { cache: 'no-store' });
    if (!r.ok) return [];
    const d = await r.json() as { data?: { data?: Ev[] } | Ev[] };
    const raw = d.data;
    const arr = Array.isArray(raw) ? raw : (raw as { data?: Ev[] })?.data;
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  competition: { label:'Competition', color:'#b45309', bg:'#fef3c7', icon:'🏆' },
  workshop:    { label:'Workshop',    color:'#1d4ed8', bg:'#dbeafe', icon:'🔧' },
  seminar:     { label:'Seminar',     color:'#6d28d9', bg:'#ede9fe', icon:'🎓' },
  conference:  { label:'Conference',  color:'#065f46', bg:'#d1fae5', icon:'📋' },
  hackathon:   { label:'Hackathon',   color:'#dc2626', bg:'#fee2e2', icon:'💡' },
  cultural:    { label:'Cultural',    color:'#0891b2', bg:'#e0f2fe', icon:'🎭' },
  webinar:     { label:'Webinar',     color:'#7c3aed', bg:'#f5f3ff', icon:'💻' },
  orientation: { label:'Orientation', color:'#16a34a', bg:'#dcfce7', icon:'📖' },
  other:       { label:'Event',       color:'#475569', bg:'#f1f5f9', icon:'📅' },
};

function EventCard({ ev, featured = false }: { ev: Ev; featured?: boolean }) {
  const meta = TYPE_META[ev.type] ?? TYPE_META.other;
  const start = new Date(ev.startDate);
  const isPast = start < new Date();
  return (
    <article className={cn('group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all', featured ? 'lg:flex' : '')}>
      <div className={cn('relative overflow-hidden bg-gradient-to-br from-[#0b3d1f] to-[#1a7a3c]', featured ? 'lg:w-80 h-56 lg:h-auto shrink-0' : 'h-44')}>
        {ev.coverImage
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={ev.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          : <div className="w-full h-full flex items-center justify-center text-6xl opacity-15">{meta.icon}</div>
        }
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: meta.bg, color: meta.color }}>{meta.icon} {meta.label}</span>
          {isPast && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-700/70 text-white">Completed</span>}
        </div>
        <div className="absolute bottom-3 left-3 text-white/90 text-xs font-semibold bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
          📅 {formatDate(ev.startDate)}
          {ev.endDate && new Date(ev.endDate).getDate() !== start.getDate() && ` – ${formatDate(ev.endDate)}`}
        </div>
      </div>
      <div className={cn('p-5 flex flex-col', featured ? 'flex-1' : '')}>
        <h3 className={cn('font-bold text-slate-900 group-hover:text-green-700 transition leading-snug mb-2', featured ? 'text-xl' : 'text-base line-clamp-2')}>
          <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
        </h3>
        {ev.venue && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {ev.venue} · <span className="capitalize">{ev.mode?.replace('_',' ')}</span>
          </p>
        )}
        {(ev.shortDescription || ev.description) && (
          <p className="text-sm text-slate-500 line-clamp-3 mb-3 leading-relaxed">
            {ev.shortDescription || ev.description}
          </p>
        )}
        <div className="mt-auto">
          <Link href={`/events/${ev.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-green-800"
            style={{ color: '#166534' }}>
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = await fetchEvents();
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.startDate) >= now).sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const past     = events.filter(e => new Date(e.startDate) < now) .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const [featuredUp, ...restUp] = upcoming;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container-custom py-2.5">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <span>›</span>
            <span className="text-slate-800 font-medium">Events</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-1"
          style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}>
          ALL EVENTS
        </h1>
        <div className="h-[2px] bg-slate-200 mb-8" aria-hidden="true" />

        {events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-slate-600 font-semibold">No events published yet.</p>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"/>
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-oswald)' }}>
                UPCOMING EVENTS
              </h2>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>
            {featuredUp && <div className="mb-6"><EventCard ev={featuredUp} featured /></div>}
            {restUp.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {restUp.map(e => <EventCard key={e.id} ev={e} />)}
              </div>
            )}
          </section>
        )}

        {past.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-500" style={{ fontFamily: 'var(--font-oswald)' }}>
                PAST EVENTS
              </h2>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75">
              {past.map(e => <EventCard key={e.id} ev={e} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
