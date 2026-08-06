import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Graduate Admission — GSTU CSE' };

const PROGRAMS = [
  { name:'MSc in CSE', duration:'2 Years', credits:'60', seats:'30', requirement:'BSc in CSE or equivalent with minimum CGPA 2.50' },
  { name:'MPhil in CSE', duration:'2 Years', credits:'30', seats:'10', requirement:'BSc or MSc in CSE with minimum CGPA 2.75' },
  { name:'PhD in CSE', duration:'3–5 Years', credits:'42', seats:'5', requirement:'MSc or MPhil in CSE, research proposal required' },
];

const DOCS = [
  'Attested copies of all academic certificates and mark sheets',
  'Copy of National ID card or passport',
  'Recent passport-size photographs (4 copies)',
  'Research proposal (for MPhil and PhD)',
  'Experience certificate (if applicable)',
  'NOC from employer (if in service)',
  'Application fee payment receipt',
];

export default function GraduateAdmissionPage() {
  return (
    <>
      <SectionHero tag="Admissions" title="Graduate Admission"
        description="Advanced programs for MSc, MPhil, and PhD in Computer Science and Engineering at GSTU."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Admissions',href:'/admissions'},{label:'Graduate'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">

          {/* Programs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Programs</h2>
            <div className="space-y-4">
              {PROGRAMS.map(p => (
                <div key={p.name} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{p.requirement}</p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      {[['Duration',p.duration],['Credits',p.credits],['Seats',p.seats]].map(([l,v]) => (
                        <div key={l} className="text-center">
                          <p className="text-sm font-black text-[#0b3d1f]">{v}</p>
                          <p className="text-[10px] text-slate-400">{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Required Documents</h2>
            <ul className="space-y-2">
              {DOCS.map((d,i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {d}
                </li>
              ))}
            </ul>
          </section>

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
