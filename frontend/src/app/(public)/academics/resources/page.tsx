'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SectionHero from '@/components/academics/SectionHero';
import { cn } from '@/lib/utils/cn';
import type { AcademicResource } from '@/lib/api/academics';
import { formatDate } from '@/lib/utils/format';

const TYPE_META: Record<string,{ label:string; icon:string; color:string }> = {
  routine:       { label:'Class Routine',     icon:'📅', color:'bg-blue-100 text-blue-700' },
  calendar:      { label:'Academic Calendar', icon:'🗓️', color:'bg-violet-100 text-violet-700' },
  exam_schedule: { label:'Exam Schedule',     icon:'📝', color:'bg-amber-100 text-amber-700' },
  result:        { label:'Results',           icon:'📊', color:'bg-emerald-100 text-emerald-700' },
  guideline:     { label:'Guidelines',        icon:'📋', color:'bg-rose-100 text-rose-700' },
  other:         { label:'Other',             icon:'📂', color:'bg-slate-100 text-slate-600' },
};

function ResourcesContent() {
  const params         = useSearchParams();
  const initialType    = params.get('type') ?? '';
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [type, setType]     = useState(initialType);
  const [degree, setDegree] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const q   = new URLSearchParams();
    if (type)   q.set('type', type);
    if (degree) q.set('degree', degree);
    fetch(`${api}/academics/resources?${q}`)
      .then(r => r.json())
      .then((d: { data: AcademicResource[] }) => setResources(d.data ?? []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [type, degree]);

  return (
    <>
      <SectionHero tag="Academics" title="Academic Resources"
        description="Download class routines, exam schedules, academic calendar and results."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Academics',href:'/academics'},{label:'Resources'}]}/>

      <main className="bg-white section-py">
        <div className="container-custom">
          {/* Type tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={()=>setType('')}
              className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition',
                type===''?'bg-blue-700 text-white border-blue-700':'border-slate-200 text-slate-600 hover:border-blue-300')}>
              All
            </button>
            {Object.entries(TYPE_META).map(([k,v])=>(
              <button key={k} onClick={()=>setType(k)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition',
                  type===k?'bg-blue-700 text-white border-blue-700':'border-slate-200 text-slate-600 hover:border-blue-300')}>
                <span aria-hidden="true">{v.icon}</span>{v.label}
              </button>))}
          </div>

          {/* Degree filter */}
          <div className="flex gap-3 mb-8">
            {['','BSc','MSc','PhD'].map(d=>(
              <button key={d} onClick={()=>setDegree(d)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border transition',
                  degree===d?'bg-slate-800 text-white border-slate-800':'border-slate-200 text-slate-600 hover:border-slate-400')}>
                {d||'All Programs'}
              </button>))}
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3" aria-hidden="true">📂</p>
              <p className="text-slate-500">No resources found. Check back later.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map(r => {
                const meta = TYPE_META[r.type] ?? TYPE_META.other;
                return (
                  <div key={r._id} className={cn('border rounded-xl p-5 hover:shadow-sm transition', r.isPinned?'border-blue-300 bg-blue-50/40':'border-slate-200')}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span aria-hidden="true">{meta.icon}</span>
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', meta.color)}>{meta.label}</span>
                          <span className="text-[10px] text-slate-400">{r.academicYear} · {r.term}</span>
                          {r.targetDegree !== 'all' && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{r.targetDegree}</span>)}
                          {r.isPinned && <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">Pinned</span>}
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm">{r.title}</h3>
                        {r.description && <p className="text-xs text-slate-500 mt-1">{r.description}</p>}
                      </div>
                      {/* Files */}
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {r.files.map((f,i)=>(
                          <a key={i} href={f.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
                            </svg>
                            {f.fileName}
                          </a>))}
                        {r.files.length === 0 && <span className="text-xs text-slate-400">No files attached</span>}
                      </div>
                    </div>
                  </div>);
              })}</div>)}
        </div>
      </main>
    </>
  );
}

export default function ResourcesPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>}><ResourcesContent /></Suspense>;
}
