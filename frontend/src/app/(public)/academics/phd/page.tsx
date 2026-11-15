import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { academicsApi } from '@/lib/api/academics';

export const metadata: Metadata = { title: 'PhD in CSE — GSTU CSE Academics' };

const RESEARCH_AREAS = [
  { name: 'Machine Learning & AI',  icon: '🤖', supervisors: 2 },
  { name: 'Computer Vision',        icon: '👁️',  supervisors: 1 },
  { name: 'Cybersecurity',          icon: '🔐', supervisors: 2 },
  { name: 'NLP',                    icon: '💬', supervisors: 1 },
  { name: 'IoT & Embedded Systems', icon: '📡', supervisors: 1 },
  { name: 'Software Engineering',   icon: '⚙️',  supervisors: 2 },
];

const REQUIREMENTS = [
  { label: 'Academic Qualification', value: 'MSc/MPhil in CSE or equivalent with CGPA ≥ 3.00' },
  { label: 'Research Proposal',      value: 'Must submit a written research proposal' },
  { label: 'Interview',              value: 'Face-to-face interview with selection committee' },
  { label: 'Supervisor',             value: 'Must identify a willing supervisor' },
];

const STEPS = [
  { step: '01', title: 'Identify Supervisor', desc: 'Contact a faculty member in your research area and discuss potential topics.' },
  { step: '02', title: 'Submit Proposal',     desc: 'Submit a detailed 5-page research proposal with your application.' },
  { step: '03', title: 'Written Test',        desc: 'Appear for the departmental entrance examination.' },
  { step: '04', title: 'Viva & Enrollment',   desc: 'Attend the viva voce and complete the enrollment process.' },
];

export default async function PhDPage() {
  let description = 'The PhD program at GSTU CSE is a full research degree requiring original, significant contributions to computer science. Supervised by experienced faculty members, it typically spans 3–5 years.';
  try {
    const data = await academicsApi.getProgramByDegree('PhD');
    if (data?.description) description = data.description;
  } catch { /* use default */ }

  return (
    <>
      <SectionHero tag="Doctoral" title="Doctor of Philosophy in CSE"
        description="3–5 Years · Research-based Doctoral Program"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Academics', href: '/academics' }, { label: 'PhD Program' }]} />

      <main className="bg-white section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">About the Program</h2>
                <p className="text-slate-600 leading-relaxed">{description}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Research Areas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {RESEARCH_AREAS.map(a => (
                    <div key={a.name} className="border border-slate-200 rounded-xl p-4 text-center hover:border-green-300 transition">
                      <span className="text-2xl block mb-2" aria-hidden="true">{a.icon}</span>
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{a.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{a.supervisors} supervisor{a.supervisors > 1 ? 's' : ''}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Admission Process</h2>
                <div className="space-y-4">
                  {STEPS.map(s => (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(22,101,52,0.1)', border: '1px solid rgba(22,101,52,0.2)' }}>
                        <span className="text-xs font-bold text-green-700">{s.step}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{s.title}</h3>
                        <p className="text-sm text-slate-500">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl text-white p-6"
                style={{ background: 'linear-gradient(160deg,#0b3d1f,#134e2a)' }}>
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#86efac' }}>Program Details</h3>
                {[['Degree', 'Doctor of Philosophy'], ['Duration', '3–5 Years'], ['Mode', 'Full-time / Part-time'], ['Intake', 'Twice a year']].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-white/10 last:border-0 text-sm">
                    <span className="text-green-200/70">{l}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Eligibility</h3>
                <ul className="space-y-3">
                  {REQUIREMENTS.map((r, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-slate-800 block">{r.label}</span>
                      <span className="text-slate-500">{r.value}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/admissions"
                  className="mt-5 flex items-center justify-center w-full text-white text-sm font-semibold py-2.5 rounded-xl transition"
                  style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                  Apply Now
                </Link>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Contact Admissions</h3>
                <p className="text-sm text-slate-500 mb-3">For PhD enquiries contact the graduate office.</p>
                <Link href="/contact" className="text-sm font-semibold text-green-700 hover:text-green-900">Contact Department →</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
