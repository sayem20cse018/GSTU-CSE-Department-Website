import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import CurriculumTable from '@/components/academics/CurriculumTable';
import { academicsApi } from '@/lib/api/academics';

export const metadata: Metadata = { title: 'MSc in CSE — GSTU CSE Academics' };

const FALLBACK = {
  name: 'Master of Science in Computer Science & Engineering',
  degree: 'MSc', duration: '2 Years', totalCredits: 60,
  description: 'The MSc in CSE is an advanced 2-year graduate program focused on research, specialization, and innovation in computer science. Students can specialize in AI/ML, Cybersecurity, Networks, or Software Engineering.',
  objectives: 'Develop advanced research skills and technical expertise for careers in academia, industry research, and technology leadership.',
  eligibility: 'BSc in CSE or equivalent degree with minimum CGPA 2.50 on a 4.00 scale.',
  highlights: [
    'Research-oriented curriculum with thesis option',
    'Industry project track available',
    '4 areas of specialization',
    'Regular seminars by industry experts',
    'Lab access for research projects',
  ],
  admissionRequirements: [
    { label: 'Bachelor Degree', value: 'BSc CSE or equivalent' },
    { label: 'Minimum CGPA', value: '2.50 / 4.00' },
    { label: 'Admission Test', value: 'Written test + viva voce' },
  ],
  careerOpportunities: [
    { title: 'Research Scientist', description: 'Work at R&D labs and research institutes.' },
    { title: 'Senior Software Engineer', description: 'Lead technical teams in major tech companies.' },
    { title: 'University Lecturer', description: 'Pursue academic career at universities.' },
    { title: 'AI/ML Engineer', description: 'Develop production ML systems.' },
  ],
};

export default async function MScPage() {
  let program = FALLBACK as typeof FALLBACK & { totalSeats?: number; tuitionFee?: string; brochureUrl?: string };
  try { const d = await academicsApi.getProgramByDegree('MSc'); if (d) program = d as typeof program; } catch { /**/ }

  return (
    <>
      <SectionHero tag="Graduate" title={program.name}
        description={`${program.duration} · ${program.totalCredits} Credits`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }, { label: 'MSc in CSE' }]} />

      <main className="bg-white section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <section><h2 className="text-xl font-bold text-slate-900 mb-3">Program Overview</h2>
                <p className="text-slate-600 leading-relaxed">{program.description}</p></section>

              <section><h2 className="text-xl font-bold text-slate-900 mb-3">Highlights</h2>
                <ul className="space-y-2">{program.highlights.map((h,i)=>(
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <svg className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>{h}</li>))}</ul></section>

              <section><div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Curriculum</h2>
                <Link href="/academics/courses?degree=MSc" className="text-sm font-semibold text-violet-700">View All Courses →</Link>
              </div><CurriculumTable degree="MSc" /></section>

              <section><h2 className="text-xl font-bold text-slate-900 mb-4">Career Opportunities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.careerOpportunities.map((c,i)=>(
                    <div key={i} className="border border-slate-200 rounded-xl p-4">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{c.title}</h3>
                      <p className="text-xs text-slate-500">{c.description}</p>
                    </div>))}</div></section>
            </div>

            <aside className="space-y-6">
              <div className="bg-[#0d1b2e] text-white rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-400">Quick Facts</h3>
                {[['Duration',program.duration],['Credits',String(program.totalCredits)],['Seats',program.totalSeats?String(program.totalSeats):'—'],['Fee',program.tuitionFee??'Contact office']].map(([l,v])=>(
                  <div key={l} className="flex justify-between py-2 border-b border-white/10 last:border-0 text-sm">
                    <span className="text-slate-400">{l}</span><span className="text-white font-medium">{v}</span>
                  </div>))}</div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Eligibility</h3>
                <p className="text-sm text-slate-600 mb-4">{program.eligibility}</p>
                <ul className="space-y-2 mb-4">{program.admissionRequirements.map((r,i)=>(
                  <li key={i} className="flex justify-between text-sm gap-3">
                    <span className="text-slate-500">{r.label}</span>
                    <span className="text-slate-800 font-medium text-right">{r.value}</span>
                  </li>))}</ul>
                <Link href="/admissions" className="flex items-center justify-center w-full bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold py-2.5 rounded-xl transition">Apply Now</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
