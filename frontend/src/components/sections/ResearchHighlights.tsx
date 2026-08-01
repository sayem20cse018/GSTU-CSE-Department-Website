import Link from 'next/link';
import { RESEARCH_AREAS } from '@/constants';

// ── Featured projects (static for now, can be fetched later) ─────────────────
const FEATURED_PROJECTS = [
  {
    id: '1',
    title: 'Bangla Handwritten Character Recognition using Deep CNN',
    area: 'Machine Learning & AI',
    status: 'active' as const,
    pi: 'Dr. Mohammad Rahman',
    funding: 'ICT Division, Bangladesh',
    year: 2023,
    description: 'Developing a high-accuracy recognition system for Bangla handwritten characters using convolutional neural networks and transfer learning.',
  },
  {
    id: '2',
    title: 'IoT-Based Smart Agriculture Monitoring System',
    area: 'IoT & Embedded Systems',
    status: 'active' as const,
    pi: 'Mr. Arif Ahmed',
    funding: 'GSTU Research Grant',
    year: 2024,
    description: 'A low-cost IoT platform for real-time monitoring of soil moisture, temperature and crop health using edge computing.',
  },
  {
    id: '3',
    title: 'Network Intrusion Detection using Machine Learning',
    area: 'Cybersecurity',
    status: 'completed' as const,
    pi: 'Dr. Fatima Khatun',
    funding: 'Self-funded',
    year: 2023,
    description: 'An ML-based intrusion detection system achieving 98.7% accuracy on the KDD Cup dataset with real-time processing capabilities.',
  },
];

export default function ResearchHighlights() {
  return (
    <section className="section-py bg-[#0d1b2e] text-white" aria-labelledby="research-heading">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            Innovation &amp; Discovery
          </p>
          <h2 id="research-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Research &amp; Innovation
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Our faculty and students are actively engaged in cutting-edge research across multiple
            domains of computer science and engineering.
          </p>
        </div>

        {/* Research areas grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
          {RESEARCH_AREAS.map((area) => (
            <div
              key={area.name}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-white/20 transition cursor-default"
            >
              <span className="text-2xl block mb-2" aria-hidden="true">{area.icon}</span>
              <p className="text-xs font-medium text-slate-300 leading-snug">{area.name}</p>
              <p className="text-[10px] text-slate-500 mt-1">{area.count} projects</p>
            </div>
          ))}
        </div>

        {/* Featured projects */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-white mb-6">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_PROJECTS.map((project) => (
              <article
                key={project.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col"
              >
                {/* Status + area */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-semibold text-blue-300 bg-blue-600/20 border border-blue-600/30 px-2 py-1 rounded-md">
                    {project.area}
                  </span>
                  <span className={[
                    'text-[10px] font-bold px-2 py-1 rounded-md',
                    project.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
                  ].join(' ')}>
                    {project.status === 'active' ? '● Active' : '✓ Completed'}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white leading-snug mb-3 flex-1">
                  {project.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Meta */}
                <div className="space-y-1.5 text-xs border-t border-white/10 pt-4">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">PI</span>
                    <span className="text-slate-300 font-medium text-right">{project.pi}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Funding</span>
                    <span className="text-slate-300 font-medium text-right truncate">{project.funding}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Year</span>
                    <span className="text-slate-300 font-medium">{project.year}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            View All Research
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
