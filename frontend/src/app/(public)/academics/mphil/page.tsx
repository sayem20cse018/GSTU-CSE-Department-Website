import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { academicsApi } from '@/lib/api/academics';

export const metadata: Metadata = { title: 'MPhil in CSE — GSTU' };

export default async function MPhilPage() {
  let description = 'The Master of Philosophy (MPhil) in Computer Science and Engineering is a research-oriented program designed for students who wish to conduct advanced research before pursuing a full PhD. The program combines coursework with substantial research output.';
  let duration = '2 Years';
  let totalCredits: number | string = '30 Credits';

  try {
    const data = await academicsApi.getProgramByDegree('MPhil');
    if (data?.description) description = data.description;
    if (data?.duration) duration = data.duration;
    if (data?.totalCredits) totalCredits = `${data.totalCredits} Credits`;
  } catch { /* use defaults */ }

  return (
    <>
      <SectionHero tag="Academics" title="MPhil in CSE"
        description="A research-focused postgraduate program bridging MSc and PhD."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }, { label: 'MPhil' }]} />
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[[duration, 'Duration'], [String(totalCredits), 'Total Credits'], ['Part-time OK', 'Mode']].map(([v, l]) => (
            <div key={l} className="text-center border border-slate-200 rounded-xl py-5">
              <p className="text-2xl font-black" style={{ color: '#0b3d1f' }}>{v}</p>
              <p className="text-xs text-slate-500 mt-1">{l}</p>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">About MPhil</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Admission Requirements</h2>
          <ul className="space-y-2">
            {[
              'BSc or MSc in CSE or closely related field',
              'Minimum CGPA of 2.75/4.00 in last degree',
              'Written test and oral interview',
              'Research proposal statement',
            ].map(r => (
              <li key={r} className="flex items-center gap-3 text-sm text-slate-600">
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {r}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Courses</h2>
            <Link href="/academics/courses?degree=MPhil" className="text-sm font-semibold text-green-700 hover:text-green-900">
              View All →
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            Browse the full MPhil course catalog with detailed syllabi and credit information.
          </p>
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
