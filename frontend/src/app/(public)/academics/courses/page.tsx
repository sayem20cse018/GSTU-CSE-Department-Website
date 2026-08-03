'use client';

import { useState, useEffect } from 'react';
import SectionHero from '@/components/academics/SectionHero';
import { cn } from '@/lib/utils/cn';
import type { Course } from '@/lib/api/academics';

const TYPE_COLORS: Record<string,string> = {
  core:'bg-blue-100 text-blue-700', elective:'bg-violet-100 text-violet-700',
  lab:'bg-emerald-100 text-emerald-700', sessional:'bg-amber-100 text-amber-700',
};

export default function CoursesPage() {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [degree, setDegree]     = useState<'BSc'|'MSc'|'PhD'>('BSc');
  const [search, setSearch]     = useState('');
  const [type, setType]         = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${api}/academics/courses?degree=${degree}`)
      .then(r => r.json())
      .then((d: { data: Course[] }) => setCourses(d.data ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [degree]);

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    const matchType   = !type || c.type === type;
    return matchSearch && matchType;
  });

  // Group by semester
  const bySemester: Record<number, Course[]> = {};
  for (const c of filtered) {
    if (!bySemester[c.semester]) bySemester[c.semester] = [];
    bySemester[c.semester].push(c);
  }
  const semesters = Object.keys(bySemester).map(Number).sort((a,b) => a-b);

  return (
    <>
      <SectionHero tag="Academics" title="Course Catalog"
        description="Browse all courses offered across undergraduate and graduate programs."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Academics',href:'/academics'},{label:'Courses'}]} />

      <main className="bg-white section-py">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Degree tabs */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden">
              {(['BSc','MSc','PhD'] as const).map(d => (
                <button key={d} onClick={()=>setDegree(d)}
                  className={cn('px-4 py-2 text-sm font-semibold transition', degree===d?'bg-blue-700 text-white':'text-slate-600 hover:bg-slate-50')}>
                  {d}
                </button>))}
            </div>
            {/* Type filter */}
            <select value={type} onChange={e=>setType(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="core">Core</option>
              <option value="elective">Elective</option>
              <option value="lab">Lab</option>
              <option value="sessional">Sessional</option>
            </select>
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search by code or title…"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-slate-500 mb-6">
            Showing <strong className="text-slate-800">{filtered.length}</strong> courses for <strong className="text-slate-800">{degree}</strong>
          </p>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
          ) : semesters.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No courses found.</div>
          ) : (
            <div className="space-y-6">
              {semesters.map(sem => (
                <div key={sem}>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Semester {sem}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bySemester[sem].map(c => (
                      <div key={c._id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">{c.code}</span>
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', TYPE_COLORS[c.type]??'bg-slate-100 text-slate-600')}>{c.type}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2">{c.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{c.credits} credits</span>
                          {c.teacherName && <span>· {c.teacherName}</span>}
                        </div>
                        {c.syllabusUrl && (
                          <a href={c.syllabusUrl} target="_blank" rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                            </svg> Syllabus PDF
                          </a>)}
                      </div>))}
                  </div>
                </div>))}
            </div>)}
        </div>
      </main>
    </>
  );
}
