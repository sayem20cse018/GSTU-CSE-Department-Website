import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'MPhil in CSE — GSTU' };

const COURSES = [
  { code: 'CSE 501', title: 'Advanced Algorithms', credits: 3 },
  { code: 'CSE 502', title: 'Research Methodology', credits: 3 },
  { code: 'CSE 503', title: 'Advanced Database Systems', credits: 3 },
  { code: 'CSE 504', title: 'Machine Learning', credits: 3 },
  { code: 'CSE 590', title: 'MPhil Thesis Part I', credits: 9 },
  { code: 'CSE 591', title: 'MPhil Thesis Part II', credits: 9 },
];

export default function MPhilPage() {
  return (
    <>
      <SectionHero tag="Academics" title="MPhil in CSE"
        description="A research-focused postgraduate program bridging MSc and PhD."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }, { label: 'MPhil' }]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[['2 Years', 'Duration'], ['30 Credits', 'Total Credits'], ['Part-time OK', 'Mode']].map(([v, l]) => (
            <div key={l} className="text-center border border-slate-200 rounded-xl py-5">
              <p className="text-2xl font-black text-[#0b3d1f]">{v}</p>
              <p className="text-xs text-slate-500 mt-1">{l}</p>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">About MPhil</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The Master of Philosophy (MPhil) in Computer Science and Engineering is a research-oriented program designed for students who wish to conduct advanced research before pursuing a full PhD. The program combines coursework with substantial research output.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Admission Requirements</h2>
          <ul className="space-y-2">
            {['BSc or MSc in CSE or closely related field', 'Minimum CGPA of 2.75/4.00 in last degree', 'Written test and oral interview', 'Research proposal statement'].map(r => (
              <li key={r} className="flex items-center gap-3 text-sm text-slate-600">
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Core Courses</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Title</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-700">Credits</th>
              </tr></thead>
              <tbody>
                {COURSES.map((c, i) => (
                  <tr key={c.code} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3 font-mono text-xs text-green-700 font-bold">{c.code}</td>
                    <td className="px-4 py-3 text-slate-700">{c.title}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">{c.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/admissions" className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition"
            style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>Apply Now</Link>
          <Link href="/contact" className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:border-green-400 rounded-xl transition">Contact Us</Link>
        </div>
      </div></div>
    </>
  );
}
