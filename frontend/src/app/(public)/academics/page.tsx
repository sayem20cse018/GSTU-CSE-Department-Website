import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = {
  title: 'Academics — GSTU CSE',
  description: 'GSTU CSE offers undergraduate, graduate and doctoral programs designed to produce industry-ready graduates and research leaders.',
};

interface Program {
  id: string;
  name: string;
  degree: string;
  duration: string;
  totalCredits: number;
  description: string;
  isActive?: boolean;
}

async function fetchPrograms(): Promise<Program[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/academics/programs`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json() as { data?: Program[] };
    return Array.isArray(json.data) ? json.data.filter(p => p.isActive !== false) : [];
  } catch { return []; }
}

const PROGRAM_LINKS: Record<string, string> = {
  BSc: '/academics/bsc',
  MSc: '/academics/msc',
  MPhil: '/academics/mphil',
  PhD: '/academics/phd',
};

const DEGREE_STYLE: Record<string, { badge: string; card: string }> = {
  BSc:   { badge: 'text-green-300 bg-green-900/40', card: 'border-green-600/30' },
  MSc:   { badge: 'text-violet-300 bg-violet-900/40', card: 'border-violet-600/30' },
  MPhil: { badge: 'text-amber-300 bg-amber-900/40', card: 'border-amber-600/30' },
  PhD:   { badge: 'text-cyan-300 bg-cyan-900/40', card: 'border-cyan-600/30' },
};

const RESOURCES = [
  { label: 'Class Routine',     href: '/academics/resources?type=routine',       icon: '📅' },
  { label: 'Academic Calendar',  href: '/academics/resources?type=calendar',      icon: '🗓️' },
  { label: 'Exam Schedule',      href: '/academics/resources?type=exam_schedule', icon: '📝' },
  { label: 'Results',           href: '/academics/resources?type=result',        icon: '📊' },
  { label: 'Course List',        href: '/academics/courses',                      icon: '📚' },
  { label: 'Laboratories',      href: '/academics/labs',                         icon: '🔬' },
];

export default async function AcademicsPage() {
  const programs = await fetchPrograms();

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

            {programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {programs.map((p) => {
                  const link = PROGRAM_LINKS[p.degree] ?? `/academics/${p.degree.toLowerCase()}`;
                  const style = DEGREE_STYLE[p.degree] ?? DEGREE_STYLE.BSc;
                  return (
                    <Link
                      key={p.id}
                      href={link}
                      className={`group bg-[#0b3d1f] border rounded-2xl p-6 hover:scale-[1.02] transition-transform ${style.card}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${style.badge}`}>{p.degree}</span>
                        <div className="text-right text-xs" style={{ color: 'rgba(187,247,208,0.5)' }}>
                          <p>{p.duration}</p>
                          {p.totalCredits > 0 && <p>{p.totalCredits} credits</p>}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition">{p.name}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(187,247,208,0.6)' }}>{p.description}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-green-400 group-hover:gap-3 transition-all">
                        View Program
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <span className="text-4xl block mb-3" aria-hidden="true">📚</span>
                <p className="text-slate-500 font-medium">Program details will appear here once configured by the admin.</p>
              </div>
            )}
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
                  className="flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition text-center"
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
