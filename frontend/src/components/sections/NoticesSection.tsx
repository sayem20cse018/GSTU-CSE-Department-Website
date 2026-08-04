import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

interface Notice {
  _id: string; title: string; category: string; publishedAt: string;
  isUrgent?: boolean; isPinned?: boolean;
  attachments?: { fileUrl: string; fileName: string }[];
}

async function fetchNotices(): Promise<Notice[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/notices?limit=6`, { next: { revalidate: 300 } });
    if (!res.ok) return MOCK;
    const json = await res.json() as { data: Notice[] | { data: Notice[] } };
    const arr = Array.isArray(json.data) ? json.data : (json.data as { data: Notice[] }).data;
    return arr?.length ? arr : MOCK;
  } catch { return MOCK; }
}

const MOCK: Notice[] = [
  { _id:'1', title:'BSc Final Semester Examination Routine — Spring 2024', category:'academic', publishedAt:new Date().toISOString(), isUrgent:true, isPinned:true },
  { _id:'2', title:'Admission Test Result Published for MSc Program 2024-25', category:'admission', publishedAt:new Date(Date.now()-86400000).toISOString(), isPinned:true },
  { _id:'3', title:'Workshop on Deep Learning with TensorFlow — Registration Open', category:'workshop_seminar', publishedAt:new Date(Date.now()-2*86400000).toISOString() },
  { _id:'4', title:'Merit Scholarship Applications Open for 2024-25 Session', category:'scholarship', publishedAt:new Date(Date.now()-3*86400000).toISOString() },
  { _id:'5', title:'Class Schedule Revised for 6th Semester CSE Students', category:'academic', publishedAt:new Date(Date.now()-4*86400000).toISOString() },
  { _id:'6', title:'Faculty Recruitment Notice — Assistant Professor Position', category:'recruitment', publishedAt:new Date(Date.now()-5*86400000).toISOString() },
];

const CAT: Record<string, { label: string; cls: string }> = {
  academic:         { label:'Academic',    cls:'bg-blue-50 text-blue-700 border-blue-200' },
  admission:        { label:'Admission',   cls:'bg-violet-50 text-violet-700 border-violet-200' },
  scholarship:      { label:'Scholarship', cls:'bg-emerald-50 text-emerald-700 border-emerald-200' },
  workshop_seminar: { label:'Workshop',    cls:'bg-amber-50 text-amber-700 border-amber-200' },
  recruitment:      { label:'Recruitment', cls:'bg-rose-50 text-rose-700 border-rose-200' },
  general:          { label:'General',     cls:'bg-slate-100 text-slate-600 border-slate-200' },
  result:           { label:'Result',      cls:'bg-teal-50 text-teal-700 border-teal-200' },
};

export default async function NoticesSection() {
  const notices = await fetchNotices();

  return (
    <section className="section-py bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ color:'#166534', background:'rgba(22,101,52,0.08)', border:'1px solid rgba(22,101,52,0.15)' }}>
              Official Notices
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Notice Board</h2>
          </div>
          <Link href="/notices"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition hover:shadow-sm shrink-0"
            style={{ color:'#166534', borderColor:'rgba(22,101,52,0.3)' }}>
            All Notices
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        {/* Split layout: pinned (left) + list (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Pinned/Urgent card — highlighted */}
          {notices[0] && (
            <div className="lg:col-span-2">
              <Link href={`/notices/${notices[0]._id}`}
                className="group block h-full rounded-2xl overflow-hidden relative transition hover:-translate-y-1 hover:shadow-xl"
                style={{ background:'linear-gradient(135deg,#0b3d1f,#134e2a)' }}>
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{ backgroundImage:'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize:'24px 24px' }} aria-hidden="true"/>
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {notices[0].isUrgent && (
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-500 text-white animate-pulse">URGENT</span>
                      )}
                      {notices[0].isPinned && !notices[0].isUrgent && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">📌 PINNED</span>
                      )}
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                        style={{ background:'rgba(255,255,255,0.12)', color:'#86efac' }}>
                        {CAT[notices[0].category]?.label ?? notices[0].category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-green-100 transition">
                      {notices[0].title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                    <span className="text-xs text-green-200/60">{formatDate(notices[0].publishedAt)}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-300 group-hover:gap-2 transition-all">
                      View
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Notice list */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {notices.slice(1).map(notice => {
              const cat = CAT[notice.category] ?? CAT.general;
              return (
                <Link key={notice._id} href={`/notices/${notice._id}`}
                  className="group flex items-start gap-3 bg-white rounded-xl border p-4 hover:border-green-300 hover:shadow-md transition-all"
                  style={{ borderColor:'#e2e8f0' }}>

                  {/* Left icon */}
                  <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm"
                    style={{ background:'rgba(22,101,52,0.07)' }}>
                    {notice.isUrgent ? '🔴' : notice.isPinned ? '📌' : '📋'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-green-700 transition line-clamp-2 leading-snug">
                      {notice.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', cat.cls)}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(notice.publishedAt)}</span>
                    </div>
                  </div>

                  {notice.attachments?.[0] && (
                    <span className="shrink-0 text-xs font-semibold text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded-lg">
                      PDF
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
