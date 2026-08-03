import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { SITE } from '@/constants';

export const metadata: Metadata = { title: 'History — GSTU CSE' };

const MILESTONES = [
  { year: 2011, title: 'Department Founded', desc: `The Department of Computer Science & Engineering was established at ${SITE.university} with the first batch of BSc students.` },
  { year: 2013, title: 'First Batch Graduated', desc: 'The pioneering batch of BSc graduates completed their studies, marking the department\'s first major milestone.' },
  { year: 2015, title: 'MSc Program Launched', desc: 'The department introduced the Master of Science in CSE program, opening doors for advanced graduate education.' },
  { year: 2017, title: 'Research Lab Established', desc: 'State-of-the-art research laboratories including the AI Lab and Computer Networks Lab were inaugurated.' },
  { year: 2019, title: 'Industry Partnerships', desc: 'Formal MoU signed with leading technology companies for internship, placement, and research collaboration.' },
  { year: 2021, title: '10th Anniversary', desc: 'Celebrated a decade of academic excellence with over 500 alumni working in Bangladesh and abroad.' },
  { year: 2023, title: 'PhD Program Approved', desc: 'University approval granted for the Doctor of Philosophy program in Computer Science & Engineering.' },
  { year: 2024, title: 'National Award', desc: 'Department faculty received national recognition for outstanding research contributions in Artificial Intelligence.' },
];

export default function HistoryPage() {
  return (
    <>
      <SectionHero tag="About" title="Our History"
        description={`The journey of CSE at ${SITE.university} since ${SITE.founded}`}
        breadcrumbs={[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'History'}]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-3xl">
        <p className="text-slate-600 text-lg leading-relaxed mb-12">
          What started as a small department with a handful of faculty has grown into a thriving academic community committed to producing world-class computing professionals.
        </p>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[2.25rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-600 to-green-200"/>
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-6 relative">
                {/* Year bubble */}
                <div className="w-[4.5rem] h-[4.5rem] shrink-0 rounded-full flex items-center justify-center
                                font-extrabold text-sm text-white shadow-md relative z-10"
                  style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
                  {m.year}
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-green-300 transition">
                  <h3 className="font-bold text-slate-900 mb-1">{m.title}</h3>
                  <p className="text-sm text-slate-600">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div></div>
    </>
  );
}
