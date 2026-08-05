import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/constants';
import { fetchSettings } from '@/lib/api/settings';

// Department images — replace URLs with real photos when available
const DEPT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    alt: 'CSE Department Building',
    span: 'col-span-2 row-span-2',
    label: 'CSE Building',
  },
  {
    src: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80',
    alt: 'Students in computer lab',
    span: 'col-span-1 row-span-1',
    label: 'AI Lab',
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    alt: 'Faculty lecture',
    span: 'col-span-1 row-span-1',
    label: 'Classroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    alt: 'Team collaboration',
    span: 'col-span-2 row-span-1',
    label: 'Research Team',
  },
];

const TABS = [
  {
    id: 'intro',
    label: 'Introduction',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
  },
  {
    id: 'vision',
    label: 'Vision',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    ),
  },
  {
    id: 'mission',
    label: 'Mission',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
];

// ─── Tab component ─────────────────────────────────────────────────────────────
import AboutTabs from './AboutTabs';

const DEFAULT_INTRO = `The Department of Computer Science and Engineering at ${SITE.university} was established in ${SITE.founded} with a vision to provide quality technical education in a rapidly evolving field. Since inception, the department has grown into a vibrant academic community with dedicated faculty, modern laboratories, and a commitment to research and innovation.\n\nWe offer comprehensive programs at the BSc, MSc, and PhD levels, designed to equip students with the theoretical foundation and practical skills necessary for success in both industry and academia.`;
const DEFAULT_VISION = `To be a leading center of excellence in Computer Science and Engineering education and research in Bangladesh, recognized for producing graduates who make significant contributions to technology, society, and the global knowledge economy.\n\nWe aspire to foster an inclusive, innovative, and intellectually vibrant environment where students, faculty, and researchers collaborate to solve real-world problems and advance the frontiers of computing.`;
const DEFAULT_MISSION = `Our mission is to provide rigorous, high-quality education in computer science and engineering that prepares students for lifelong learning and professional success. We are committed to:\n\n• Delivering a curriculum that balances theory with practice and stays current with industry needs\n• Conducting impactful research that contributes to national development and global knowledge\n• Fostering ethical, collaborative, and innovative thinking in every graduate\n• Creating an inclusive environment that welcomes students from all backgrounds`;

export default async function AboutSection() {
  const settings = await fetchSettings().catch(() => null);
  const s = settings as unknown as Record<string, string> | null;

  const tabsWithContent = TABS.map(t => ({
    ...t,
    content:
      t.id === 'intro'   ? (s?.aboutIntro   || DEFAULT_INTRO)   :
      t.id === 'vision'  ? (s?.aboutVision  || DEFAULT_VISION)  :
      t.id === 'mission' ? (s?.aboutMission || DEFAULT_MISSION) : '',
  }));
  return (
    <section className="section-py bg-white" aria-labelledby="about-heading">
      <div className="container-custom">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <h2 id="about-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            About the Department
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Left: Tabs (Intro / Vision / Mission) ──────────────────── */}
          <div>
            <AboutTabs tabs={tabsWithContent} />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm shadow-sm">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <Link href="/faculty"
                className="inline-flex items-center gap-2 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-semibold px-5 py-2.5 rounded-xl transition text-sm">
                Meet Our Faculty
              </Link>
            </div>
          </div>

          {/* ── Right: Photo grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[480px]">
            {DEPT_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`${img.span} relative overflow-hidden rounded-2xl bg-slate-100 group`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Caption on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3
                                translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-semibold">{img.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
