import Link from 'next/link';

interface Event {
  _id: string;
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
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(
      `${api}/events?status=upcoming&limit=6&isPublished=true`,
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return MOCK;
    const json = await res.json() as { data: Event[] | { data: Event[] } };
    const arr = Array.isArray(json.data)
      ? json.data
      : (json.data as { data: Event[] }).data;
    return arr?.length ? arr : MOCK;
  } catch { return MOCK; }
}

const MOCK: Event[] = [
  { _id:'1', title:'National Programming Contest 2026', slug:'npc-2026', shortDescription:'Annual inter-university competitive programming contest with prizes and certificates for top teams.', type:'competition', startDate: new Date(Date.now() + 5*86400000).toISOString(), venue:'CSE Seminar Hall', mode:'in_person', status:'upcoming', isFeatured:true, isPublished:true },
  { _id:'2', title:'Workshop on Deep Learning & PyTorch', slug:'dl-pytorch-workshop', shortDescription:'Hands-on 2-day workshop covering neural networks, CNNs, and real-world model deployment.', type:'workshop', startDate: new Date(Date.now() + 10*86400000).toISOString(), venue:'AI Lab, 4th Floor', mode:'in_person', status:'upcoming', isFeatured:false, isPublished:true },
  { _id:'3', title:'Seminar: Career in Tech — Alumni Insights', slug:'career-tech-seminar', shortDescription:'Distinguished alumni share experiences and career advice for students entering the tech industry.', type:'seminar', startDate: new Date(Date.now() + 15*86400000).toISOString(), venue:'Auditorium, GSTU', mode:'hybrid', status:'upcoming', isFeatured:false, isPublished:true },
  { _id:'4', title:'CSE Annual Cultural & Sports Day', slug:'cultural-sports-2026', shortDescription:'Inter-batch cultural programs, sports events, and prize-giving ceremony.', type:'cultural', startDate: new Date(Date.now() + 20*86400000).toISOString(), venue:'GSTU Central Field', mode:'in_person', status:'upcoming', isFeatured:false, isPublished:true },
  { _id:'5', title:'Research Poster Exhibition — Spring 2026', slug:'research-poster-2026', shortDescription:'Final year students present their thesis research in a formal poster exhibition.', type:'conference', startDate: new Date(Date.now() + 25*86400000).toISOString(), venue:'CSE Building Lobby', mode:'in_person', status:'upcoming', isFeatured:true, isPublished:true },
  { _id:'6', title:'IEEE Student Branch Tech Talk', slug:'ieee-tech-talk', shortDescription:'Monthly IEEE student branch session featuring guest speakers from industry and academia.', type:'seminar', startDate: new Date(Date.now() + 30*86400000).toISOString(), venue:'Room 402, CSE', mode:'in_person', status:'upcoming', isFeatured:false, isPublished:true },
];

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  competition: { label:'Competition',  color:'#b45309', bg:'#fef3c7', icon:'🏆' },
  workshop:    { label:'Workshop',     color:'#1d4ed8', bg:'#dbeafe', icon:'🔧' },
  seminar:     { label:'Seminar',      color:'#6d28d9', bg:'#ede9fe', icon:'🎓' },
  conference:  { label:'Conference',   color:'#065f46', bg:'#d1fae5', icon:'📋' },
  hackathon:   { label:'Hackathon',    color:'#dc2626', bg:'#fee2e2', icon:'💡' },
  cultural:    { label:'Cultural',     color:'#0891b2', bg:'#e0f2fe', icon:'🎭' },
  webinar:     { label:'Webinar',      color:'#7c3aed', bg:'#f5f3ff', icon:'💻' },
  other:       { label:'Event',        color:'#475569', bg:'#f1f5f9', icon:'📅' },
};

const MODE_LABEL: Record<string, string> = {
  in_person: '📍 In Person',
  online:    '🌐 Online',
  hybrid:    '🔀 Hybrid',
};

/** Format event date as "Aug 10" or "Aug 10 – 12" */
function formatEventDate(startDate: string, endDate?: string): { month: string; day: string; range?: string } {
  const start = new Date(startDate);
  const month = start.toLocaleDateString('en-US', { month: 'short' });
  const day   = start.getDate().toString();
  let range: string | undefined;
  if (endDate) {
    const end = new Date(endDate);
    if (end.getDate() !== start.getDate() || end.getMonth() !== start.getMonth()) {
      range = `${month} ${day} – ${end.getDate()}`;
    }
  }
  return { month, day, range };
}

/** Days until the event */
function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default async function UpcomingEventsSection() {
  const events = await fetchEvents();
  if (!events.length) return null;

  const [featured, ...rest] = events;

  return (
    <section className="py-10 bg-slate-50">
      <div className="container-custom">

        {/* ── Section header ── */}
        <div className="flex items-center gap-4 mb-8">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Upcoming Events
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl border shrink-0 transition hover:shadow-sm"
            style={{ color: '#166534', borderColor: 'rgba(22,101,52,0.3)', fontFamily: 'var(--font-inter)' }}>
            All Events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Featured large card ── */}
          {featured && (() => {
            const meta = TYPE_META[featured.type] ?? TYPE_META.other;
            const { month, day, range } = formatEventDate(featured.startDate, featured.endDate);
            const days = daysUntil(featured.startDate);
            return (
              <article className="lg:col-span-1 group flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#0b3d1f,#1a7a3c)' }}>
                  {featured.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.coverImage} alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                      {meta.icon}
                    </div>
                  )}
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 flex flex-col items-center px-3 py-2 rounded-xl text-white text-center shadow-lg"
                    style={{ background: 'rgba(11,45,30,0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', minWidth: '52px' }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{month}</span>
                    <span className="text-xl font-black leading-none"
                      style={{ fontFamily: 'var(--font-oswald)' }}>{day}</span>
                  </div>
                  {/* Featured badge */}
                  {featured.isFeatured && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background:'#fbbf24', color:'#1a1a1a' }}>⭐ Featured</span>
                  )}
                  {/* Countdown */}
                  {days <= 7 && days >= 0 && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse"
                      style={{ background:'#dc2626', color:'#fff' }}>
                      {days === 0 ? 'Today!' : `${days}d left`}
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5">
                  {/* Type + mode */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon} {meta.label}
                    </span>
                    {featured.mode && (
                      <span className="text-[11px] text-slate-500">
                        {MODE_LABEL[featured.mode] ?? featured.mode}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-green-700 transition"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '1rem' }}>
                    <Link href={`/events/${featured.slug}`}>{featured.title}</Link>
                  </h3>
                  {featured.shortDescription && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3"
                      style={{ fontFamily: 'var(--font-inter)' }}>
                      {featured.shortDescription}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                    {featured.venue && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span className="truncate max-w-[140px]">{featured.venue}</span>
                      </span>
                    )}
                    <Link href={`/events/${featured.slug}`}
                      className="text-xs font-bold flex items-center gap-1 transition-colors hover:text-green-800"
                      style={{ color: '#166534' }}>
                      Details
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })()}

          {/* ── Compact list cards (right side 2-col) ── */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.slice(0, 4).map((ev) => {
              const meta = TYPE_META[ev.type] ?? TYPE_META.other;
              const { month, day } = formatEventDate(ev.startDate, ev.endDate);
              const days = daysUntil(ev.startDate);
              return (
                <article key={ev._id}
                  className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-green-300 hover:shadow-md transition-all duration-300">

                  {/* Top colour band + date */}
                  <div className="relative h-28 overflow-hidden flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#0b3d1f,#1a7a3c)' }}>
                    {ev.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ev.coverImage} alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <span className="text-5xl opacity-15">{meta.icon}</span>
                    )}
                    {/* Date pill */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
                      <span className="text-white font-black text-sm leading-none"
                        style={{ fontFamily: 'var(--font-oswald)' }}>{day}</span>
                      <span className="text-white/70 text-[10px] font-semibold uppercase">{month}</span>
                    </div>
                    {days >= 0 && days <= 3 && (
                      <div className="absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse"
                        style={{ background:'#dc2626', color:'#fff' }}>
                        {days === 0 ? 'TODAY' : `${days}d`}
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 w-fit"
                      style={{ background: meta.bg, color: meta.color }}>
                      {meta.icon} {meta.label}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition line-clamp-2 leading-snug mb-auto"
                      style={{ fontFamily: 'var(--font-inter)' }}>
                      <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
                    </h3>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      {ev.venue && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[110px] flex items-center gap-0.5">
                          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          {ev.venue}
                        </span>
                      )}
                      <Link href={`/events/${ev.slug}`}
                        className="text-[10px] font-bold shrink-0 flex items-center gap-0.5 transition-colors hover:text-green-800"
                        style={{ color: '#166534' }}>
                        More
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── More button ── */}
        <div className="mt-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c', fontFamily: 'var(--font-inter)' }}>
            More Events
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
