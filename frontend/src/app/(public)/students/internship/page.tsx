import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Internship — GSTU CSE' };

const PARTNERS = [
  { name: 'Grameenphone',  sector: 'Telecom & IT',        logo: '📡' },
  { name: 'BJIT Group',    sector: 'Software Engineering', logo: '💻' },
  { name: 'Brain Station 23', sector: 'Software Dev',    logo: '🧠' },
  { name: 'Samsung R&D BD',   sector: 'R&D / AI',         logo: '🔬' },
  { name: 'Therap BD',     sector: 'Healthcare IT',        logo: '🏥' },
  { name: 'DataSoft',      sector: 'Data Solutions',       logo: '📊' },
];

const PROCESS = [
  { step: '01', title: 'Eligibility Check', desc: 'Must have completed at least 5th semester and have CGPA ≥ 2.50.' },
  { step: '02', title: 'Apply to Companies', desc: 'Submit CV to partner companies via department placement cell or directly.' },
  { step: '03', title: 'Interview & Selection', desc: 'Attend company interviews. Department provides preparation support.' },
  { step: '04', title: 'Department Approval', desc: 'Get approval from the department coordinator before starting.' },
  { step: '05', title: 'Complete Internship', desc: 'Work for minimum 8 weeks (summer) or 12 weeks (full semester).' },
  { step: '06', title: 'Submit Report', desc: 'Submit internship report and get evaluated for course credit.' },
];

export default function InternshipPage() {
  return (
    <>
      <SectionHero tag="Students" title="Internship Program"
        description="Gain real-world experience with our industry partners and earn academic credit."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Students', href: '/students' }, { label: 'Internship' }]}/>
      <div className="bg-white section-py"><div className="container-custom">

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Program</h2>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>The GSTU CSE Internship Program bridges academic learning with professional practice. Students spend time working in real organizations, applying their skills to solve actual industry problems.</p>
              <p>Internships are available during the summer break (8 weeks) or as a full semester elective (12 weeks). Students earn 3 academic credits upon successful completion.</p>
              <p>The department maintains relationships with 20+ industry partners and actively assists students in securing quality internship placements.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['3 Credits', 'Academic Credit'], ['8–12 Weeks', 'Duration'], ['20+', 'Industry Partners'], ['BDT 8k–25k', 'Avg. Monthly Stipend']].map(([v, l]) => (
              <div key={l} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xl font-black text-[#0b3d1f]">{v}</p>
                <p className="text-xs text-slate-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS.map(p => (
              <div key={p.step} className="flex items-start gap-4 border border-slate-200 rounded-xl p-5">
                <span className="w-9 h-9 rounded-lg text-sm font-extrabold text-white flex items-center justify-center shrink-0"
                  style={{ background: '#0b3d1f' }}>{p.step}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Partner Organizations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map(p => (
              <div key={p.name} className="border border-slate-200 rounded-xl p-4 text-center hover:border-green-300 transition">
                <span className="text-3xl block mb-2">{p.logo}</span>
                <p className="font-semibold text-slate-900 text-xs">{p.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{p.sector}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link href="/contact" className="inline-block px-6 py-3 text-sm font-bold text-white rounded-xl transition"
            style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
            Contact Placement Cell
          </Link>
        </div>
      </div></div>
    </>
  );
}
