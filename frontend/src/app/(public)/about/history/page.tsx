import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { SITE } from '@/constants';

export const metadata: Metadata = { title: 'History — GSTU CSE' };

const MILESTONES = [
  { year: '2011', title: 'Department Founded', desc: `The Department of Computer Science and Engineering was established at ${SITE.university} with a founding batch of 30 students and 3 faculty members, with a vision to produce skilled computing professionals for Bangladesh.` },
  { year: '2012', title: 'First Laboratory Established', desc: 'The department inaugurated its first computer laboratory with 40 workstations, marking a significant step towards practical computing education.' },
  { year: '2014', title: 'First BSc Batch Graduated', desc: 'The first batch of BSc students successfully completed their degrees. Several graduates joined leading technology companies and pursued higher education abroad.' },
  { year: '2015', title: 'MSc Program Launched', desc: 'The department expanded its offerings with the introduction of the Master of Science (MSc) program, attracting graduate students from across the country.' },
  { year: '2017', title: 'Research Activity Increased', desc: 'Faculty and students began publishing in national and international journals. The department received its first research grant for work in machine learning and NLP.' },
  { year: '2019', title: 'New AI & Networking Labs', desc: 'State-of-the-art Artificial Intelligence and Computer Networks laboratories were inaugurated, equipped with GPU clusters and advanced networking hardware.' },
  { year: '2021', title: 'PhD Program Launched', desc: 'The department received approval to offer doctoral-level research degrees, cementing its position as a center for advanced computing research in Bangladesh.' },
  { year: '2023', title: 'Industry Partnerships', desc: 'Memoranda of Understanding signed with several technology companies for internship programs, collaborative research, and curriculum development.' },
  { year: '2024', title: 'Continued Growth', desc: 'With 14+ faculty members, 500+ students, and an active research culture, the department continues to grow in academic excellence and national recognition.' },
];

export default function HistoryPage() {
  return (
    <>
      <SectionHero
        tag="About"
        title="Our History"
        description={`The journey of the Department of CSE at ${SITE.university} — from humble beginnings to a thriving academic community.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'History' }]}
      />
      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">

          {/* Intro */}
          <div className="prose prose-slate max-w-none mb-12">
            <p className="text-lg text-slate-600 leading-relaxed">
              The Department of Computer Science and Engineering at {SITE.university} has grown from a small founding unit into one of the most dynamic computing departments in the region. Our history reflects a consistent dedication to academic excellence, research innovation, and student success.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-700 to-green-200"
              aria-hidden="true"/>

            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="relative flex gap-6 items-start">
                  {/* Year circle */}
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white text-xs font-black"
                    style={{ background: i % 2 === 0 ? '#0b3d1f' : '#166534' }}>
                    {m.year.slice(2)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-300 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-extrabold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                        {m.year}
                      </span>
                      <h3 className="font-bold text-slate-900">{m.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 text-center bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Be Part of Our Story</h2>
            <p className="text-slate-500 text-sm mb-5">Join the department as a student, researcher, or partner and contribute to our ongoing journey.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/admissions" className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition"
                style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                Apply Now
              </a>
              <a href="/contact" className="px-5 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:border-green-400 rounded-xl transition">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
