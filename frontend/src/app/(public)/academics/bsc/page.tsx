import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import CurriculumTable from '@/components/academics/CurriculumTable';
import { academicsApi } from '@/lib/api/academics';

export const metadata: Metadata = { title: 'BSc in CSE — GSTU CSE Academics' };

// Default program shown if DB is empty
const FALLBACK = {
  name: 'Bachelor of Science in Computer Science & Engineering',
  degree: 'BSc', duration: '4 Years', totalCredits: 160,
  description: 'The BSc in CSE program is a comprehensive 4-year program designed to equip students with strong foundations in computer science, programming, mathematics, and engineering principles. Graduates are prepared for careers in software development, research, and technology leadership.',
  objectives: 'To produce graduates with strong theoretical foundations and practical skills in computing who can contribute to industry and academia.',
  eligibility: 'SSC and HSC with minimum GPA 3.50 each, with Physics, Chemistry and Mathematics in HSC.',
  highlights: [
    '8 semesters with structured course progression',
    'Mandatory internship in 7th/8th semester',
    'Project-based learning in final year',
    'Access to state-of-the-art labs',
    'Strong industry linkage and placement support',
  ],
  careerOpportunities: [
    { title: 'Software Engineer', description: 'Backend, frontend, full-stack development roles.' },
    { title: 'Data Scientist', description: 'ML/AI roles in tech companies and research labs.' },
    { title: 'Systems Analyst', description: 'Design and analyze complex software systems.' },
    { title: 'Researcher / Academic', description: 'Pursue higher education or research careers.' },
  ],
  admissionRequirements: [
    { label: 'SSC GPA', value: 'Minimum 3.50' },
    { label: 'HSC GPA', value: 'Minimum 3.50' },
    { label: 'HSC Subjects', value: 'Physics, Chemistry, Mathematics' },
    { label: 'Admission Test', value: 'University admission test required' },
  ],
};

export default async function BScPage() {
  let program = FALLBACK as typeof FALLBACK & { totalSeats?: number; tuitionFee?: string; brochureUrl?: string };
  try {
    const data = await academicsApi.getProgramByDegree('BSc');
    if (data) program = data as typeof program;
  } catch { /* use fallback */ }

  return (
    <>
      <SectionHero
        tag="Undergraduate"
        title={program.name}
        description={`${program.duration} · ${program.totalCredits} Credits`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }, { label: 'BSc in CSE' }]}
      />
      <main className="bg-white section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Main content ─────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-xl font-bold text-slate-900 mb-3">Program Overview</h2>
                <p className="text-slate-600 leading-relaxed">{program.description}</p>
              </section>

              {/* Highlights */}
              <section aria-labelledby="highlights-heading">
                <h2 id="highlights-heading" className="text-xl font-bold text-slate-900 mb-3">Program Highlights</h2>
                <ul className="space-y-2">
                  {program.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Curriculum */}
              <section aria-labelledby="curriculum-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="curriculum-heading" className="text-xl font-bold text-slate-900">Curriculum</h2>
                  <Link href="/academics/courses?degree=BSc" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                    View All Courses →
                  </Link>
                </div>
                <CurriculumTable degree="BSc" />
              </section>

              {/* Careers */}
              <section aria-labelledby="careers-heading">
                <h2 id="careers-heading" className="text-xl font-bold text-slate-900 mb-4">Career Opportunities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.careerOpportunities.map((c, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-4">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{c.title}</h3>
                      <p className="text-xs text-slate-500">{c.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className="space-y-6">
              {/* Quick facts */}
              <div className="bg-[#0d1b2e] text-white rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Quick Facts</h3>
                {[
                  ['Degree', program.name.split(' ').slice(0, 2).join(' ')],
                  ['Duration', program.duration],
                  ['Total Credits', String(program.totalCredits)],
                  ['Total Seats', program.totalSeats ? String(program.totalSeats) : '—'],
                  ['Tuition Fee', program.tuitionFee ?? 'Contact office'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2 py-2 border-b border-white/10 last:border-0 text-sm">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div className="border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Eligibility</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{program.eligibility}</p>
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Requirements</h3>
                <ul className="space-y-2">
                  {program.admissionRequirements.map((r, i) => (
                    <li key={i} className="flex justify-between text-sm gap-3">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="text-slate-800 font-medium text-right">{r.value}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/admissions"
                  className="mt-5 flex items-center justify-center gap-2 w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition"
                >
                  Apply Now
                </Link>
              </div>

              {/* Brochure */}
              {program.brochureUrl && (
                <a
                  href={program.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 text-sm font-semibold py-3 rounded-xl transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Brochure (PDF)
                </a>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
