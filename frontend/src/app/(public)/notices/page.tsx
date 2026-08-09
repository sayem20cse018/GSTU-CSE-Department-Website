'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SectionHero from '@/components/academics/SectionHero';
import { cn }     from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

interface Notice { id:string; title:string; category:string; description?:string; isPublished:boolean; isPinned:boolean; isUrgent:boolean; publishedAt?:string; createdAt:string; postedByName?:string; attachments?:{fileUrl:string;fileName:string}[] }

const CAT_META: Record<string,{label:string;color:string}> = {
  academic:         {label:'Academic',    color:'bg-blue-100 text-blue-700'},
  admission:        {label:'Admission',   color:'bg-violet-100 text-violet-700'},
  scholarship:      {label:'Scholarship', color:'bg-emerald-100 text-emerald-700'},
  workshop_seminar: {label:'Workshop',    color:'bg-amber-100 text-amber-700'},
  recruitment:      {label:'Recruitment', color:'bg-rose-100 text-rose-700'},
  result:           {label:'Result',      color:'bg-teal-100 text-teal-700'},
  administrative:   {label:'Admin',       color:'bg-slate-100 text-slate-600'},
  general:          {label:'General',     color:'bg-slate-100 text-slate-600'},
};

function NoticesContent() {
  const params  = useSearchParams();
  const [list, setList]       = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState(params.get('cat') ?? '');

  const load = useCallback(async () => {
    setLoading(true);
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    try { const r = await fetch(`${api}/notices`); const d = await r.json() as {data:Notice[]}; setList(d.data??[]); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = list.filter(n => {
    const q = search.toLowerCase();
    const matchQ = !q || n.title.toLowerCase().includes(q) || (n.description??'').toLowerCase().includes(q);
    const matchC = !cat || n.category === cat;
    return matchQ && matchC;
  });

  const pinned  = filtered.filter(n => n.isPinned || n.isUrgent);
  const regular = filtered.filter(n => !n.isPinned && !n.isUrgent);

  return (
    <>
      <SectionHero tag="Department" title="Official Notices"
        description="Stay updated with all official notices, announcements and circulars from the department."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Notices'}]}/>
      <main className="bg-slate-50 section-py">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notices…"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>setCat('')} className={cn('px-3 py-2 rounded-lg text-sm font-medium border transition',!cat?'bg-blue-700 text-white border-blue-700':'border-slate-200 text-slate-600 hover:border-blue-300 bg-white')}>All</button>
              {Object.entries(CAT_META).map(([k,v])=>(
                <button key={k} onClick={()=>setCat(k)}
                  className={cn('px-3 py-2 rounded-lg text-sm font-medium border transition',cat===k?'bg-blue-700 text-white border-blue-700':'border-slate-200 text-slate-600 hover:border-blue-300 bg-white')}>
                  {v.label}
                </button>))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="h-20 bg-white border border-slate-200 rounded-xl animate-pulse"/>)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-4xl mb-3" aria-hidden="true">🔔</p>
              <p className="font-semibold text-slate-600">No notices found</p>
              <p className="text-sm mt-1">Try a different search term or category.</p>
            </div>
          ) : (
            <>
              {/* Pinned / Urgent */}
              {pinned.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pinned &amp; Urgent</p>
                  <div className="space-y-3">{pinned.map(n=><NoticeRow key={n.id} notice={n}/>)}</div>
                </div>)}
              {/* Regular */}
              {regular.length > 0 && (
                <div>
                  {pinned.length > 0 && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">All Notices</p>}
                  <div className="space-y-3">{regular.map(n=><NoticeRow key={n.id} notice={n}/>)}</div>
                </div>)}
            </>
          )}
        </div>
      </main>
    </>
  );
}

function NoticeRow({ notice: n }: { notice: Notice }) {
  const meta = CAT_META[n.category] ?? CAT_META.general;
  return (
    <div className={cn('bg-white border rounded-xl px-5 py-4 hover:shadow-sm transition', n.isUrgent?'border-red-300':'n.isPinned?border-blue-300:border-slate-200')}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {n.isUrgent && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded">URGENT</span>}
            {n.isPinned && !n.isUrgent && <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">PINNED</span>}
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', meta.color)}>{meta.label}</span>
            <span className="text-xs text-slate-400">{formatDate(n.publishedAt ?? n.createdAt)}</span>
          </div>
          <h3 className="font-semibold text-slate-900 leading-snug">{n.title}</h3>
          {n.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{n.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {n.attachments?.map((a,i)=>(
            <a key={i} href={a.fileUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
              {a.fileName}
            </a>))}
        </div>
      </div>
    </div>
  );
}

export default function NoticesPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>}><NoticesContent/></Suspense>;
}
