import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Undergraduate Admission — GSTU CSE' };

const REQUIREMENTS = [
  'Minimum GPA 3.50 in both SSC and HSC (or equivalent)',
  'Science background with Physics and Mathematics',
  'Admission test conducted by GSTU',
  'Minimum score in admission test as per GSTU criteria',
  'National ID / Birth Certificate',
  'Certificates and mark sheets of SSC and HSC',
  '4 copies of recent passport-size photographs',
];

const STEPS = [
  { n:'01', title:'Check Eligibility', desc:'Ensure you meet the minimum academic requirements.' },
  { n:'02', title:'Apply Online', desc:'Fill in the GSTU admission form online at the university portal.' },
  { n:'03', title:'Admit Card', desc:'Download and print your admit card for the admission test.' },
  { n:'04', title:'Admission Test', desc:'Sit for the written admission test on the scheduled date.' },
  { n:'05', title:'Merit List', desc:'Check the merit list published on the university website.' },
  { n:'06', title:'Enrollment', desc:'Complete enrollment by paying fees and submitting documents.' },
];

export default function UndergraduateAdmissionPage() {
  return (
    <>
      <SectionHero tag="Admissions" title="Undergraduate Admission"
        description="Join the 4-year Bachelor of Science (Honors) program in Computer Science and Engineering at GSTU."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Admissions',href:'/admissions'},{label:'Undergraduate'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">

          {/* Quick facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[['4 Years','Duration'],['160','Credit Hours'],['60','Seats per Session'],['BSc (Hons)','Degree']].map(([v,l]) => (
              <div key={l} className="text-center border border-slate-200 rounded-xl py-5">
                <p className="text-xl font-black text-[#0b3d1f]">{v}</p>
                <p className="text-xs text-slate-500 mt-1">{l}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Apply</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STEPS.map(s => (
                <div key={s.n} className="flex items-start gap-4 border border-slate-200 rounded-xl p-5">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                    style={{ background:'#0b3d1f' }}>{s.n}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {REQUIREMENTS.map((r,i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <a href="/notices?cat=admission" className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition hover:opacity-90"
              style={{ background:'linear-gradient(135deg,#0b3d1f,#166534)' }}>Admission Notices</a>
            <Link href="/contact" className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:border-green-400 rounded-xl transition">Contact Office</Link>
          </div>
        </div>
      </div>
    </>
  );
}
