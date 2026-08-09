'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Course, Curriculum } from '@/lib/api/academics';

const TYPE_COLORS: Record<string, string> = {
  core:       'bg-blue-100 text-blue-700',
  elective:   'bg-violet-100 text-violet-700',
  lab:        'bg-emerald-100 text-emerald-700',
  sessional:  'bg-amber-100 text-amber-700',
};

// Fallback BSc curriculum (8 semesters, 2 courses each for brevity)
const FALLBACK: Curriculum = {
  1: [
    { id:'f1', code:'CSE-101', title:'Introduction to Computer Science', credits:3, semester:1, degree:'BSc', type:'core', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f2', code:'CSE-102', title:'Structured Programming Language',  credits:3, semester:1, degree:'BSc', type:'core', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f3', code:'MATH-101',title:'Differential Calculus',             credits:3, semester:1, degree:'BSc', type:'core', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f4', code:'CSE-103', title:'SPL Sessional',                     credits:1.5,semester:1,degree:'BSc', type:'sessional', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:0, labHours:3, isActive:true },
  ],
  2: [
    { id:'f5', code:'CSE-201', title:'Data Structures',           credits:3, semester:2, degree:'BSc', type:'core', prerequisites:['CSE-102'], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f6', code:'CSE-202', title:'Digital Logic Design',      credits:3, semester:2, degree:'BSc', type:'core', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f7', code:'MATH-201',title:'Integral Calculus & ODE',   credits:3, semester:2, degree:'BSc', type:'core', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f8', code:'CSE-203', title:'Data Structures Sessional', credits:1.5,semester:2,degree:'BSc', type:'sessional', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:0, labHours:3, isActive:true },
  ],
  3: [
    { id:'f9',  code:'CSE-301', title:'Algorithms',               credits:3, semester:3, degree:'BSc', type:'core',     prerequisites:['CSE-201'], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f10', code:'CSE-302', title:'Computer Architecture',    credits:3, semester:3, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f11', code:'CSE-303', title:'Object-Oriented Programming', credits:3, semester:3, degree:'BSc', type:'core',  prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
  ],
  4: [
    { id:'f12', code:'CSE-401', title:'Operating Systems',        credits:3, semester:4, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f13', code:'CSE-402', title:'Database Management Systems', credits:3, semester:4, degree:'BSc', type:'core',  prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f14', code:'CSE-403', title:'Computer Networks',        credits:3, semester:4, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
  ],
  5: [
    { id:'f15', code:'CSE-501', title:'Software Engineering',     credits:3, semester:5, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f16', code:'CSE-502', title:'Compiler Design',          credits:3, semester:5, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f17', code:'CSE-503', title:'Artificial Intelligence',  credits:3, semester:5, degree:'BSc', type:'elective', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
  ],
  6: [
    { id:'f18', code:'CSE-601', title:'Machine Learning',         credits:3, semester:6, degree:'BSc', type:'elective', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
    { id:'f19', code:'CSE-602', title:'Web Technologies',         credits:3, semester:6, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
  ],
  7: [
    { id:'f20', code:'CSE-701', title:'Project-I',                credits:3, semester:7, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:0, labHours:6, isActive:true },
    { id:'f21', code:'CSE-702', title:'Cybersecurity',            credits:3, semester:7, degree:'BSc', type:'elective', prerequisites:[], learningOutcomes:[], topics:[], theoryHours:3, labHours:0, isActive:true },
  ],
  8: [
    { id:'f22', code:'CSE-801', title:'Project-II / Thesis',      credits:6, semester:8, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:0, labHours:12,isActive:true },
    { id:'f23', code:'CSE-802', title:'Internship',               credits:3, semester:8, degree:'BSc', type:'core',     prerequisites:[], learningOutcomes:[], topics:[], theoryHours:0, labHours:0, isActive:true },
  ],
};

interface Props { degree: 'BSc' | 'MSc' | 'PhD' }

export default function CurriculumTable({ degree }: Props) {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [openSem, setOpenSem]       = useState<number | null>(1);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${apiUrl}/academics/courses/curriculum/${degree}`)
      .then(r => r.json())
      .then((d: { data: Curriculum }) => {
        const data = d.data;
        setCurriculum(Object.keys(data).length ? data : FALLBACK);
      })
      .catch(() => setCurriculum(FALLBACK))
      .finally(() => setLoading(false));
  }, [degree]);

  if (loading) return (
    <div className="space-y-2">
      {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
    </div>
  );

  const data = curriculum ?? FALLBACK;
  const semesters = Object.keys(data).map(Number).sort((a, b) => a - b);
  const totalCredits = semesters.flatMap(s => data[s]).reduce((a, c) => a + c.credits, 0);

  return (
    <div className="space-y-2">
      {/* Summary row */}
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <span className="text-slate-600"><strong className="text-slate-900">{semesters.length}</strong> Semesters</span>
        <span className="text-slate-600"><strong className="text-slate-900">{semesters.flatMap(s => data[s]).length}</strong> Courses</span>
        <span className="text-slate-600"><strong className="text-slate-900">{totalCredits}</strong> Credits</span>
      </div>

      {semesters.map(sem => {
        const courses: Course[] = data[sem];
        const semCredits = courses.reduce((a, c) => a + c.credits, 0);
        const isOpen = openSem === sem;
        return (
          <div key={sem} className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Accordion header */}
            <button
              onClick={() => setOpenSem(isOpen ? null : sem)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-900 text-sm">
                Semester {sem}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{courses.length} courses · {semCredits} credits</span>
                <svg className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Course rows */}
            {isOpen && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="text-left px-4 py-2 font-medium">Code</th>
                    <th className="text-left px-4 py-2 font-medium">Course Title</th>
                    <th className="text-center px-4 py-2 font-medium w-16">Credits</th>
                    <th className="text-center px-4 py-2 font-medium w-24">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => (
                    <tr key={c.id}
                      className={cn('border-b border-slate-50 last:border-0', i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-700 font-semibold whitespace-nowrap">{c.code}</td>
                      <td className="px-4 py-3 text-slate-800">{c.title}
                        {c.prerequisites.length > 0 && (
                          <span className="ml-2 text-[10px] text-slate-400">
                            Pre: {c.prerequisites.join(', ')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700">{c.credits}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', TYPE_COLORS[c.type] ?? 'bg-slate-100 text-slate-600')}>
                          {c.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
