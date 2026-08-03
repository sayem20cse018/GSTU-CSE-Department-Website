import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Academics — GSTU CSE' };

const PROGRAMS = [
  {
    degree: 'BSc', href: '/academics/bsc', duration: '4 Years', credits: '160',
    title: 'Bachelor of Science in CSE',
    desc: 'A rigorous undergraduate program covering core CS fundamentals, software development, algorithms, and systems.',
    color: 'from-blue-600/20 to-indigo-600/10 border-blue-600/20',
    badge: 'bg-blue-600/20 text-blue-300',
  },
  {
    degree: 'MSc', href: '/academics/msc', duration: '2 Years', credits: '60',
    title: 'Master of Science in CSE',
    desc: 'An advanced graduate program for deep specialization in research-oriented areas of computer science and engineering.',
    color: 'from-violet-600/20 to-purple-600/10 border-violet-600/20',
    badge: 'bg-violet-600/20 text-violet-300',
  },
  {
    degree: 'PhD', href: '/academics/phd', duration: '3–5 Years', credits: 'Research',
    title: 'Doctor of Philosophy in CSE',
    desc: 'A doctoral research program for developing cutting-edge expertise and original contributions to computer science.',
    color: 'from-emerald-600/20 to-teal-600/10 border-emerald-600/20',
    badge: 'bg-emerald-600/20 text-emerald-300',
  },
];

const RESOURCES = [
  { label: 'Class Routine',      href: '/academics/resources?type=routine',       icon: '📅' },
  { label: 'Academic Calendar',  href: '/academics/resources?type=calendar',      icon: '🗓️' },
  { label: 'Exam Schedule',      href: '/academics/resources?type=exam_schedule', icon: '📝' },
  { label: 'Results',            href: '/academics/resources?type=result',        icon: '📊' },
  { label: 'Course List',        href: '/academics/courses',                      icon: '📚' },
  { label: 'Laboratories',       href: '/academics/labs',                         icon: '🔬' },
];

export default function AcademicsPage() {
  return (
    <>
      <SectionHero
        tag="Academics"
        title="Academic Programs"
        description="GSTU CSE offers world-class undergraduate, graduate and doctoral programs designed to produce industry-ready graduates and research leaders."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academics' }]}
      />

      <main className="bg-white">
        {/* Programs */}
        <section className="section-py" aria-labelledby="programs-heading">
          <div className="container-custom">
            <h2 id="programs-heading" className="text-2xl font-bold text-slate-900 mb-8">Degree Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROGRAMS.map((p) => (
                <Link
                  key={p.degree}
                  href={p.href}
                  className={`group bg-[#0d1b2e] border rounded-2xl p-6 hover:scale-[1.02] transition-transform ${p.color}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.badge}`}>{p.degree}</span>
                    <div className="text-right text-xs text-slate-400">
                      <p>{p.duration}</p>
                      <p>{p.credits} credits</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:gap-3 transition-all">
                    View Program
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Resources */}
        <section className="section-py bg-slate-50" aria-labelledby="resources-heading">
          <div className="container-custom">
            <h2 id="resources-heading" className="text-2xl font-bold text-slate-900 mb-8">Academic Resources</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {RESOURCES.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition text-center"
                >
                  <span className="text-3xl" aria-hidden="true">{r.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{r.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
