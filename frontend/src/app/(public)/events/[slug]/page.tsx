import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cn }     from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

interface Ev { id:string; title:string; slug:string; description:string; shortDescription?:string; venue:string; startDate:string; endDate?:string; type:string; mode:string; coverImage?:string; status:string; organizerName?:string; organizerContact?:string; onlineLink?:string; speakers?:{name:string;title?:string;organization?:string;bio?:string}[]; schedule?:{time:string;activity:string;speaker?:string}[]; registration?:{isRequired:boolean;formUrl?:string;deadline?:string;maxSeats?:number;registeredCount?:number} }
const TYPE_COLORS: Record<string,string> = { seminar:'bg-blue-100 text-blue-700', workshop:'bg-amber-100 text-amber-700', conference:'bg-violet-100 text-violet-700', hackathon:'bg-rose-100 text-rose-700', competition:'bg-emerald-100 text-emerald-700', webinar:'bg-teal-100 text-teal-700', cultural:'bg-pink-100 text-pink-700', other:'bg-slate-100 text-slate-600' };

async function fetchEvent(slug:string): Promise<Ev|null> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/events/${slug}`, { cache: 'no-store' });
    if (!r.ok) return null;
    const d = await r.json() as { data?: Ev };
    return d.data ?? null;
  } catch { return null; }
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const {slug} = await params;
  const e = await fetchEvent(slug);
  if (!e) return { title: 'Event — GSTU CSE' };
  return {
    title: `${e.title} — GSTU CSE Events`,
    description: e.shortDescription ?? e.description?.slice(0, 160),
    openGraph: {
      title: e.title,
      description: e.shortDescription ?? e.description?.slice(0, 160),
      type: 'website',
      images: e.coverImage ? [{ url: e.coverImage, width: 1200, height: 630, alt: e.title }] : [],
    },
  };
}

export default async function EventDetailPage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const e = await fetchEvent(slug);
  if (!e) notFound();

  const isPast = new Date(e.startDate) < new Date();

  return (
    <>
      <main className="bg-slate-50 min-h-screen">
        {/* Hero */}
        <div className="bg-[#0d1b2e] pt-24 pb-12">
          <div className="container-custom max-w-5xl">
            <Link href="/events" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm mb-6 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              All Events
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg', TYPE_COLORS[e.type]??TYPE_COLORS.other)}>{e.type}</span>
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-md', isPast?'bg-slate-600 text-white':'bg-emerald-500 text-white')}>{isPast?'Completed':'Upcoming'}</span>
              <span className="text-xs font-bold bg-white/10 text-white px-2 py-0.5 rounded-md">{e.mode.replace('_',' ')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{e.title}</h1>
            {e.shortDescription && <p className="text-slate-300 mt-3 text-lg">{e.shortDescription}</p>}
          </div>
        </div>
        {/* Cover */}
        {e.coverImage && (
          <div className="container-custom max-w-5xl -mt-6">
            <img src={e.coverImage} alt={e.title} className="w-full h-64 object-cover rounded-2xl shadow-xl"/>
          </div>)}
        {/* Content */}
        <div className="container-custom max-w-5xl py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {e.description && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-3">About this Event</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{e.description}</p>
                </div>)}
              {e.speakers?.length ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Speakers</h2>
                  <div className="space-y-4">{e.speakers.map((s,i)=>(
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">{s.name.charAt(0)}</div>
                      <div><p className="font-semibold text-slate-900">{s.name}</p>
                        <p className="text-sm text-slate-500">{[s.title,s.organization].filter(Boolean).join(' · ')}</p>
                        {s.bio&&<p className="text-sm text-slate-500 mt-1">{s.bio}</p>}</div>
                    </div>))}</div>
                </div>) : null}
              {e.schedule?.length ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Schedule</h2>
                  <div className="space-y-3">{e.schedule.map((s,i)=>(
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg shrink-0 min-w-[5.5rem] text-center">{s.time}</span>
                      <div><p className="text-sm font-medium text-slate-900">{s.activity}</p>{s.speaker&&<p className="text-xs text-slate-500">{s.speaker}</p>}</div>
                    </div>))}</div>
                </div>) : null}
            </div>
            <aside className="space-y-5">
              {/* Event details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Event Details</h3>
                {[
                  ['Date', formatDate(e.startDate)],
                  ...(e.endDate ? [['End Date', formatDate(e.endDate)]] : []),
                  ['Venue', e.venue],
                  ['Mode', e.mode.replace('_',' ')],
                  ...(e.organizerName ? [['Organizer', e.organizerName]] : []),
                ].map(([l,v])=>(
                  <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                    <span className="text-slate-500 shrink-0">{l}</span>
                    <span className="text-slate-900 font-medium text-right ml-3">{v}</span>
                  </div>))}
              </div>
              {/* Online link */}
              {e.onlineLink && (
                <a href={e.onlineLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 text-sm font-semibold py-3 rounded-xl transition">
                  🔗 Join Online
                </a>)}
              {/* Registration */}
              {e.registration?.isRequired && e.registration.formUrl && (
                <a href={e.registration.formUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold py-3 rounded-xl transition shadow-sm">
                  Register Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>)}
              {/* Contact */}
              {e.organizerContact && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Contact</h3>
                  <a href={`mailto:${e.organizerContact}`} className="text-sm text-blue-700 hover:text-blue-900 break-all">{e.organizerContact}</a>
                </div>)}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
