import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Year Book — GSTU CSE' };

const YEARS = [
  { year: '2023–24', batch: '14th', graduates: 58, highlights: ['Best CGPA: Fatima Akter (3.97/4.00)', 'NST Scholarship Winners: 3', 'Placed in top tech companies: 42'] },
  { year: '2022–23', batch: '13th', graduates: 55, highlights: ['Best CGPA: Rafi Islam (3.94/4.00)', 'Research publications: 8', 'Government job placement: 12'] },
  { year: '2021–22', batch: '12th', graduates: 52, highlights: ['Best CGPA: Suma Das (3.91/4.00)', 'ACM ICPC regional participants: 4', 'Startup founders: 3'] },
  { year: '2020–21', batch: '11th', graduates: 48, highlights: ['Batch representatives at national conference', 'First PhD student enrolled from this batch'] },
];

export default function YearbookPage() {
  return (
    <>
      <SectionHero tag="Research & Publications" title="Year Book"
        description="Annual records of graduating batches, academic highlights, and departmental milestones."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Research',href:'/research'},{label:'Year Book'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">
          <div className="space-y-6">
            {YEARS.map(y => (
              <div key={y.year} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest">{y.batch} Batch</p>
                    <h2 className="text-xl font-bold text-slate-900">{y.year}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{y.graduates} Graduates</p>
                  </div>
                  <span className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>🎓</span>
                </div>
                <ul className="space-y-1.5">
                  {y.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"/>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <p className="text-slate-500 text-sm">Full year book PDFs are available at the department office.</p>
            <a href="/contact" className="inline-block mt-3 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition hover:opacity-90"
              style={{ background:'linear-gradient(135deg,#0b3d1f,#166534)' }}>Contact Department</a>
          </div>
        </div>
      </div>
    </>
  );
}
