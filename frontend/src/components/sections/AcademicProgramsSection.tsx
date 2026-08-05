import Link from 'next/link';

interface Program {
  _id: string;
  name: string;
  degree: 'BSc' | 'MSc' | 'PhD';
  duration: string;
  totalCredits: number;
  description: string;
  highlights?: string[];
  totalSeats?: number;
  tuitionFee?: string;
  isActive: boolean;
}

async function fetchPrograms(): Promise<Program[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/academics/programs`, { next: { revalidate: 3600 } });
    if (!res.ok) return MOCK;
    const json = await res.json() as { data: Program[] };
    return json.data?.length ? json.data : MOCK;
  } catch { return MOCK; }
}

const MOCK: Program[] = [
  {
    _id: '1',
    name: 'Bachelor of Science in Computer Science & Engineering',
    degree: 'BSc',
    duration: '4 Years',
    totalCredits: 160,
    description: 'A comprehensive undergraduate program covering core computer science fundamentals, software engineering, algorithms, and emerging technologies — preparing graduates for industry and research.',
    highlights: ['Algorithm & Data Structures', 'Software Engineering', 'AI & Machine Learning', 'Database Systems', 'Computer Networks', 'Final Year Project'],
    totalSeats: 60,
    tuitionFee: '5,000 BDT/semester',
    isActive: true,
  },
  {
    _id: '2',
    name: 'Master of Science in Computer Science & Engineering',
    degree: 'MSc',
    duration: '2 Years',
    totalCredits: 60,
    description: 'An advanced graduate program focusing on research, specialization, and innovation in areas such as AI, cybersecurity, networks, and systems design.',
    highlights: ['Advanced Algorithms', 'Research Methodology', 'Thesis / Dissertation', 'Specialization Tracks', 'Seminar & Publication'],
    totalSeats: 30,
    tuitionFee: '6,000 BDT/semester',
    isActive: true,
  },
  {
    _id: '3',
    name: 'Doctor of Philosophy in Computer Science & Engineering',
    degree: 'PhD',
    duration: '3–5 Years',
    totalCredits: 42,
    description: 'A doctoral research program for those who wish to contribute original knowledge to the field of computing through rigorous independent research and scholarly publication.',
    highlights: ['Original Research', 'Dissertation Defense', 'International Publication', 'Research Funding', 'Faculty Mentorship'],
    totalSeats: 10,
    tuitionFee: 'Contact Department',
    isActive: true,
  },
];

// Degree badge colours
const DEGREE_STYLE: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  BSc: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', accent: '#2563eb' },
  MSc: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe', accent: '#7c3aed' },
  PhD: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', accent: '#16a34a' },
};

export default async function AcademicProgramsSection() {
  const programs = await fetchPrograms();

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">

        {/* ── Section header ── */}
        <div className="flex items-center gap-4 mb-8">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Our Academic Programs
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
          <Link
            href="/academics"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl border transition hover:shadow-sm shrink-0"
            style={{ color: '#166534', borderColor: 'rgba(22,101,52,0.3)', fontFamily: 'var(--font-inter)' }}>
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        {/* ── Program cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const style = DEGREE_STYLE[prog.degree] ?? DEGREE_STYLE.BSc;
            return (
              <article
                key={prog._id}
                className="flex flex-col border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                style={{ borderColor: style.border }}>

                {/* Top accent bar */}
                <div className="h-1.5 w-full" style={{ background: style.accent }} aria-hidden="true" />

                <div className="flex flex-col flex-1 p-5">

                  {/* Degree badge + duration */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full border"
                      style={{ background: style.bg, color: style.text, borderColor: style.border }}>
                      {prog.degree}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: '#64748b', fontFamily: 'var(--font-inter)' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {prog.duration}
                    </span>
                  </div>

                  {/* Program name */}
                  <h3
                    className="font-bold text-slate-900 leading-snug mb-2"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '0.95rem' }}>
                    {prog.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-slate-500 leading-relaxed mb-4 line-clamp-3"
                    style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem' }}>
                    {prog.description}
                  </p>

                  {/* Highlights */}
                  {prog.highlights && prog.highlights.length > 0 && (
                    <ul className="space-y-1.5 mb-5">
                      {prog.highlights.slice(0, 5).map((h) => (
                        <li
                          key={h}
                          className="flex items-center gap-2 text-xs text-slate-600"
                          style={{ fontFamily: 'var(--font-inter)' }}>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: style.accent }}
                            aria-hidden="true" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Meta row */}
                  <div
                    className="mt-auto flex items-center justify-between pt-4 border-t text-xs text-slate-400"
                    style={{ borderColor: '#f1f5f9', fontFamily: 'var(--font-inter)' }}>
                    {prog.totalSeats ? (
                      <span>🎓 {prog.totalSeats} seats</span>
                    ) : <span />}
                    {prog.totalCredits ? (
                      <span>{prog.totalCredits} credits</span>
                    ) : <span />}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/academics/${prog.degree.toLowerCase()}`}
                    className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: style.accent, fontFamily: 'var(--font-inter)' }}>
                    Learn More
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
