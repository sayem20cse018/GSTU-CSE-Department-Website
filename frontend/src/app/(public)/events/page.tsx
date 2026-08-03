import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { cn }      from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'Events — GSTU CSE' };

interface Ev { _id:string; title:string; slug:string; shortDescription?:string; description:string; venue:string; startDate:string; endDate?:string; type:string; mode:string; coverImage?:string; status:string; isFeatured:boolean; organizerName?:string }

const TYPE_COLORS: Record<string,string> = { seminar:'bg-blue-100 text-blue-700', workshop:'bg-amber-100 text-amber-700', conference:'bg-violet-100 text-violet-700', hackathon:'bg-rose-100 text-rose-700', competition:'bg-emerald-100 text-emerald-700', webinar:'bg-teal-100 text-teal-700', cultural:'bg-pink-100 text-pink-700', other:'bg-slate-100 text-slate-600' };
const GRADIENTS = ['from-blue-600 to-indigo-600','from-violet-600 to-purple-600','from-emerald-600 to-teal-600','from-amber-600 to-orange-600','from-rose-600 to-pink-600'];
const MOCK: Ev[] = [
  {_id:'1',title:'National Programming Contest 2024',slug:'npc-2024',shortDescription:'Annual programming contest open to all CSE students.',description:'',venue:'CSE Seminar Hall',startDate:new Date(Date.now()+5*86400000).toISOString(),type:'competition',mode:'in_person',status:'upcoming',isFeatured:true},
  {_id:'2',title:'Workshop on Deep Learning with PyTorch',slug:'dl-workshop-2024',shortDescription:'Hands-on workshop covering CNNs, RNNs and transformers.',description:'',venue:'AI Lab, Room 302',startDate:new Date(Date.now()+12*86400000).toISOString(),type:'workshop',mode:'in_person',status:'upcoming',isFeatured:false},
  {_id:'3',title:'Guest Lecture: Industry Trends in Cloud Computing',slug:'cloud-lecture-2024',shortDescription:'A talk by industry experts on the latest in cloud technologies.',description:'',venue:'Conference Room',startDate:new Date(Date.now()+20*86400000).toISOString(),type:'seminar',mode:'hybrid',status:'upcoming',isFeatured:false},
  {_id:'4',title:'CSE Annual Cultural Program 2024',slug:'cultural-2024',shortDescription:'Annual cultural evening celebrating student talent and creativity.',description:'',venue:'University Auditorium',startDate:new Date(Date.now()-5*86400000).toISOString(),type:'cultural',mode:'in_person',status:'completed',isFeatured:false},
];

async function fetchEvents(): Promise<Ev[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/events?limit=20`, { next:{revalidate:600} });
    if (!r.ok) return MOCK;
    const d = await r.json() as {data:{data:Ev[]}};
    return d.data?.data?.length ? d.data.data : MOCK;
  } catch { return MOCK; }
}

export default async function EventsPage() {
  const events = await fetchEvents();
  const upcoming  = events.filter(e => e.status === 'upcoming' || new Date(e.startDate) >= new Date());
  const past      = events.filter(e => e.status === 'completed' || new Date(e.startDate) < new Date());

  return (
    <>
      <SectionHero tag="Department Events" title="Events & Programs"
        description="Stay informed about upcoming seminars, workshops, competitions and cultural programs."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Events'}]}/>
      <main className="bg-white section-py">
        <div className="container-custom">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className="mb-14" aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"/>
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((e,i)=><EventCard key={e._id} event={e} gradient={GRADIENTS[i%GRADIENTS.length]}/>)}
              </div>
            </section>)}
          {/* Past */}
          {past.length > 0 && (
            <section aria-labelledby="past-heading">
              <h2 id="past-heading" className="text-2xl font-bold text-slate-900 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                {past.map((e,i)=><EventCard key={e._id} event={e} gradient={GRADIENTS[(i+2)%GRADIENTS.length]} past/>)}
              </div>
            </section>)}
          {events.length===0 && (
            <div className="text-center py-20 text-slate-400">
              <p className="text-5xl mb-4" aria-hidden="true">📅</p>
              <p className="font-semibold text-slate-600">No events yet</p>
              <p className="text-sm mt-1">Check back later for upcoming events.</p>
            </div>)}
        </div>
      </main>
    </>
  );
}

function EventCard({event:e, gradient, past=false}: {event:Ev; gradient:string; past?:boolean}) {
  const isOnline = e.mode === 'online';
  const isHybrid = e.mode === 'hybrid';
  return (
    <article className={cn('group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all', past?'':'hover:border-blue-300')}>
      <div className={cn('h-44 relative bg-gradient-to-br', gradient)}>
        {e.coverImage?<img src={e.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>:
          <div className="absolute inset-0 flex items-center justify-center opacity-20" aria-hidden="true">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', TYPE_COLORS[e.type]??TYPE_COLORS.other)}>{e.type}</span>
          {(isOnline||isHybrid)&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-700">{e.mode}</span>}
        </div>
        {past && <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center"><span className="bg-white/90 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full">Completed</span></div>}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <span>{formatDate(e.startDate)}</span>
          <span>·</span>
          <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="truncate">{e.venue}</span>
        </div>
        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2 line-clamp-2">{e.title}</h3>
        {e.shortDescription && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{e.shortDescription}</p>}
        <Link href={`/events/${e.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition inline-flex items-center gap-1">
          View details <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </Link>
      </div>
    </article>
  );
}
