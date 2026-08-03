import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Student Resources — GSTU CSE' };

const RESOURCES = [
  { icon:'📅', label:'Class Routine',    href:'/academics/resources?type=routine',        desc:'Download current semester class schedule' },
  { icon:'📝', label:'Exam Routine',     href:'/academics/resources?type=exam_schedule',  desc:'View upcoming examination timetable' },
  { icon:'📊', label:'Results',          href:'/academics/resources?type=result',          desc:'Check semester examination results' },
  { icon:'🗓️', label:'Academic Calendar',href:'/academics/resources?type=calendar',       desc:'Important dates and semester schedule' },
  { icon:'🎓', label:'Scholarships',     href:'/students/scholarships',                   desc:'Available scholarships and eligibility' },
  { icon:'🔬', label:'Thesis / Projects',href:'/students/thesis',                         desc:'Guidelines for thesis and projects' },
  { icon:'💼', label:'Internship',       href:'/students/internship',                     desc:'Internship opportunities and process' },
  { icon:'🏆', label:'Clubs & Societies',href:'/students/clubs',                          desc:'Student clubs and extracurricular' },
  { icon:'📄', label:'Downloads',        href:'/forms',                                   desc:'Forms, syllabi and other documents' },
];

export default function StudentsPage() {
  return (
    <>
      <SectionHero tag="Students" title="Student Resources"
        description="Everything you need as a GSTU CSE student — routines, results, resources and more."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Students'}]}/>
      <div className="bg-white section-py"><div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCES.map(r => (
            <Link key={r.label} href={r.href}
              className="group flex items-start gap-4 border border-slate-200 rounded-2xl p-5
                         hover:border-green-400 hover:shadow-md transition">
              <span className="text-3xl shrink-0" aria-hidden="true">{r.icon}</span>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition">{r.label}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Student portal */}
        <div className="mt-12 bg-[#0b3d1f] text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Student Portal</h2>
          <p className="mb-6" style={{color:'rgba(187,247,208,0.85)'}}>Access your grades, attendance, and course registration through the student portal.</p>
          <Link href="/student/login"
            className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3 rounded-xl transition hover:bg-green-50"
            style={{color:'#0b3d1f'}}>
            Login to Student Portal
          </Link>
        </div>
      </div></div>
    </>
  );
}
