import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Thesis & Projects — GSTU CSE' };

const MILESTONES = [
  { sem: '7th Semester', title: 'Topic Selection & Supervisor Assignment', desc: 'Students select a research topic in consultation with faculty. Supervisor assignment is finalized by the department.' },
  { sem: '7th Semester', title: 'Thesis Proposal Submission', desc: 'Submit a formal thesis proposal (10–15 pages) covering background, objectives, methodology, and timeline.' },
  { sem: '7th–8th Semester', title: 'Research & Development', desc: 'Conduct research, collect data, implement system/prototype, and document findings under supervisor guidance.' },
  { sem: '8th Semester', title: 'Mid-Term Progress Presentation', desc: 'Present research progress to a committee of 3 faculty members for feedback and assessment.' },
  { sem: '8th Semester', title: 'Final Submission', desc: 'Submit bound thesis document following department formatting guidelines. Minimum 60 pages for BSc, 100 for MSc.' },
  { sem: '8th Semester', title: 'Thesis Defense (Viva)', desc: 'Defend the thesis before a panel. Successful defense results in final grade and degree eligibility.' },
];

const TOPICS = [
  { area: 'Artificial Intelligence & ML', examples: ['Bangla OCR', 'Medical Diagnosis AI', 'Recommendation Systems'] },
  { area: 'Web & Mobile Development', examples: ['Smart Campus App', 'E-commerce Platform', 'Health Monitoring App'] },
  { area: 'IoT & Embedded Systems', examples: ['Smart Agriculture', 'Home Automation', 'Wearable Devices'] },
  { area: 'Cybersecurity', examples: ['Intrusion Detection', 'Blockchain Auth', 'Network Security Tool'] },
  { area: 'Data Science & Analytics', examples: ['Crime Pattern Analysis', 'Stock Prediction', 'NLP Sentiment'] },
  { area: 'Computer Networks', examples: ['SDN Implementation', 'Wireless Mesh', 'QoS Optimization'] },
];

export default function ThesisPage() {
  return (
    <>
      <SectionHero tag="Students" title="Thesis & Final Projects"
        description="Guidelines, milestones, and resources for undergraduate and graduate thesis."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Students', href: '/students' }, { label: 'Thesis' }]}/>
      <div className="bg-white section-py"><div className="container-custom">

        {/* Milestones */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Thesis Milestones</h2>
          <div className="relative">
            <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-green-200" aria-hidden="true"/>
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-black text-xs shrink-0 relative z-10"
                    style={{ background: '#0b3d1f' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 border border-slate-200 rounded-xl p-4 hover:border-green-300 transition">
                    <span className="text-[10px] font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{m.sem}</span>
                    <h3 className="font-bold text-slate-900 mt-1.5 text-sm">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Topic areas */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Research Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map(t => (
              <div key={t.area} className="border border-slate-200 rounded-xl p-5 hover:border-green-300 transition">
                <h3 className="font-bold text-slate-900 text-sm mb-2">{t.area}</h3>
                <ul className="space-y-1">
                  {t.examples.map(ex => (
                    <li key={ex} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-green-500 shrink-0"/>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Downloads */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900">Templates & Guidelines</h3>
            <p className="text-sm text-slate-500 mt-0.5">Download official templates for your thesis proposal and final report.</p>
          </div>
          <Link href="/forms" className="px-5 py-2.5 text-sm font-bold text-white rounded-xl whitespace-nowrap transition"
            style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
            Download Templates
          </Link>
        </div>
      </div></div>
    </>
  );
}
