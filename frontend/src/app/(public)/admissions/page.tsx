import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Admissions — GSTU CSE' };

const PROGRAMS = [
  { degree:'BSc in CSE', duration:'4 Years', credits:160, seats:60, href:'/academics/bsc',
    reqs:['SSC GPA ≥ 3.50', 'HSC GPA ≥ 3.50', 'Physics, Chemistry, Math in HSC', 'University admission test'], color:'from-blue-600 to-indigo-600' },
  { degree:'MSc in CSE', duration:'2 Years', credits:60,  seats:30, href:'/academics/msc',
    reqs:['BSc in CSE or equivalent', 'Minimum CGPA 2.50/4.00', 'Written test + viva voce'], color:'from-violet-600 to-purple-600' },
  { degree:'PhD in CSE', duration:'3–5 Years', credits:0,  seats:10, href:'/academics/phd',
    reqs:['MSc in CSE or equivalent', 'Research proposal', 'Interview with committee', 'Willing supervisor'], color:'from-emerald-600 to-teal-600' },
];

const STEPS = [
  { n:'01', title:'Check Eligibility', desc:'Review the academic requirements for your desired program.' },
  { n:'02', title:'Prepare Documents', desc:'Gather academic transcripts, certificates, and ID documents.' },
  { n:'03', title:'Apply Online', desc:'Submit the online application form with all required documents.' },
  { n:'04', title:'Admission Test', desc:'Appear for the written admission test on the scheduled date.' },
  { n:'05', title:'Viva Voce', desc:'Shortlisted candidates attend an interview with the committee.' },
  { n:'06', title:'Enrol', desc:'Successful candidates complete enrolment and fee payment.' },
];

export default function AdmissionsPage() {
  return (
    <>
      <SectionHero tag="Join Us" title="Admissions"
        description="Start your journey at GSTU CSE. We offer BSc, MSc, and PhD programs."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Admissions'}]}/>

      <div className="bg-white section-py"><div className="container-custom">

        {/* Programs */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROGRAMS.map(p => (
              <div key={p.degree} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
                <div className={`h-3 bg-gradient-to-r ${p.color}`}/>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{p.degree}</h3>
                  <div className="flex gap-4 text-sm text-slate-500 mb-4">
                    <span>{p.duration}</span><span>·</span>
                    {p.credits > 0 && <span>{p.credits} credits</span>}
                    <span>·</span><span>{p.seats} seats</span>
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {p.reqs.map(r => (
                      <li key={r} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className="block text-center text-sm font-bold text-white py-2.5 rounded-xl transition"
                    style={{background:'linear-gradient(135deg,#0b3d1f,#166534)'}}>
                    View Program
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to apply */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Apply</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map(s => (
              <div key={s.n} className="flex items-start gap-4 border border-slate-200 rounded-xl p-5 hover:border-green-300 transition">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                  style={{background:'linear-gradient(135deg,#0b3d1f,#166534)'}}>
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ & fees */}
        <section id="fees" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4 text-lg" id="faq">Frequently Asked Questions</h3>
            {[
              ['When does admission open?', 'Admissions open twice a year — in January and July.'],
              ['Is there an entrance exam?', 'Yes, all programs require a written admission test.'],
              ['Can I apply from outside GSTU?', 'Yes, applications are accepted from all universities.'],
            ].map(([q,a]) => (
              <div key={q} className="mb-3">
                <p className="font-semibold text-slate-800 text-sm">{q}</p>
                <p className="text-sm text-slate-500 mt-0.5">{a}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#0b3d1f] text-white rounded-2xl p-6">
            <h3 className="font-bold mb-4 text-lg">Tuition & Fees</h3>
            <p className="text-sm mb-4" style={{color:'rgba(187,247,208,0.85)'}}>Fees vary by program. Contact the admissions office for current fee structures.</p>
            {[['BSc Semester Fee','Contact Office'],['MSc Semester Fee','Contact Office'],['Scholarships','Available for merit students']].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2 border-b border-white/10 last:border-0 text-sm">
                <span style={{color:'rgba(187,247,208,0.7)'}}>{l}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
            <Link href="/contact" className="mt-5 block text-center text-sm font-bold bg-white hover:bg-green-50 py-2.5 rounded-xl transition"
              style={{color:'#0b3d1f'}}>
              Contact Admissions Office
            </Link>
          </div>
        </section>
      </div></div>
    </>
  );
}
