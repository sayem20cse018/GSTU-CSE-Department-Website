import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Vision & Mission — GSTU CSE' };

const VALUES = [
  { icon: '🎓', title: 'Academic Excellence', desc: 'Upholding the highest standards of teaching and learning to produce graduates who lead in their fields.' },
  { icon: '🔬', title: 'Research Innovation', desc: 'Fostering a culture of inquiry and discovery that pushes the boundaries of computing knowledge.' },
  { icon: '🤝', title: 'Integrity & Ethics', desc: 'Promoting honesty, transparency, and ethical conduct in all academic and professional endeavors.' },
  { icon: '🌍', title: 'Inclusivity', desc: 'Creating a welcoming environment for students and faculty from all backgrounds and demographics.' },
  { icon: '💡', title: 'Creativity', desc: 'Encouraging creative thinking and entrepreneurship to solve real-world problems through technology.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Developing responsible computing professionals who are mindful of technology\'s impact on society.' },
];

const OBJECTIVES = [
  'Deliver rigorous, industry-relevant undergraduate, graduate, and doctoral programs in CSE.',
  'Develop student competencies in algorithms, software engineering, AI, networks, and systems.',
  'Engage in impactful research addressing national and global computing challenges.',
  'Build partnerships with industry, government, and international academic institutions.',
  'Provide scholarships and support to ensure access to quality education for all deserving students.',
  'Produce graduates who demonstrate technical excellence, ethical conduct, and leadership.',
  'Foster a vibrant community of lifelong learners committed to continuous improvement.',
];

export default function VisionPage() {
  return (
    <>
      <SectionHero
        tag="About"
        title="Vision & Mission"
        description="The guiding principles and aspirations that shape the direction of our department."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Vision & Mission' }]}
      />

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">

          {/* Vision & Mission cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {/* Vision */}
            <div className="relative overflow-hidden rounded-2xl p-8 text-white"
              style={{ background: 'linear-gradient(160deg,#0b3d1f 0%,#134e2a 60%,#0a2e1a 100%)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                style={{ background: '#4ade80' }} aria-hidden="true"/>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4">
                🔭
              </div>
              <h2 className="text-xl font-black mb-3 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-oswald)' }}>Our Vision</h2>
              <p className="text-green-100/90 leading-relaxed text-sm">
                To be a leading center of excellence in Computer Science and Engineering education and research in Bangladesh — recognized for producing graduates who make significant contributions to technology, society, and the global knowledge economy.
              </p>
              <p className="text-green-100/90 leading-relaxed text-sm mt-3">
                We aspire to foster an inclusive, innovative, and intellectually vibrant environment where students, faculty, and researchers collaborate to solve real-world problems and advance the frontiers of computing.
              </p>
            </div>

            {/* Mission */}
            <div className="border-2 border-green-200 rounded-2xl p-8 bg-green-50">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h2 className="text-xl font-black mb-3 uppercase tracking-wide text-slate-900"
                style={{ fontFamily: 'var(--font-oswald)' }}>Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our mission is to provide rigorous, high-quality education in Computer Science and Engineering that prepares students for lifelong learning and professional success.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm mt-3">
                We are committed to conducting impactful research, fostering ethical and innovative thinking, and creating an inclusive environment where every student can thrive and contribute to the advancement of technology and society.
              </p>
            </div>
          </div>

          {/* Objectives */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Departmental Objectives</h2>
            <ul className="space-y-3">
              {OBJECTIVES.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5"
                    style={{ background: '#0b3d1f' }}>
                    {i + 1}
                  </span>
                  <p className="text-slate-600 leading-relaxed text-sm">{obj}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Core values */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VALUES.map(v => (
                <div key={v.title}
                  className="flex items-start gap-4 border border-slate-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition">
                  <span className="text-2xl shrink-0" aria-hidden="true">{v.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{v.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
