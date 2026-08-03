import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { SITE, STATS } from '@/constants';

export const metadata: Metadata = { title: 'About — GSTU CSE' };

const QUICK_LINKS = [
  { label: 'History',           href: '/about/history',        icon: '📜' },
  { label: 'Vision & Mission',  href: '/about/vision',         icon: '🎯' },
  { label: "Chairman's Message",href: '/about/chairman',       icon: '💬' },
  { label: 'Administration',    href: '/about/administration',  icon: '🏛️' },
  { label: 'Contact Info',      href: '/contact',              icon: '📞' },
];

const FACILITIES = [
  { name: 'Artificial Intelligence Lab',  capacity: 30, icon: '🤖' },
  { name: 'Computer Networks Lab',         capacity: 40, icon: '🌐' },
  { name: 'Software Engineering Lab',      capacity: 50, icon: '💻' },
  { name: 'Cybersecurity Lab',             capacity: 20, icon: '🔐' },
];

export default function AboutPage() {
  return (
    <>
      <SectionHero
        tag="About Us"
        title={`About the ${SITE.shortName}`}
        description={`The Department of CSE at ${SITE.university} — fostering excellence in computing education and research.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <div className="bg-white section-py">
        <div className="container-custom">

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
            {QUICK_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className="flex flex-col items-center gap-2 bg-slate-50 border border-slate-200
                           rounded-xl py-5 px-3 text-center hover:border-green-400 hover:shadow-md transition group">
                <span className="text-3xl" aria-hidden="true">{l.icon}</span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-green-700">{l.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Department</h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                  <p>The Department of Computer Science and Engineering at {SITE.university} was established in {SITE.founded} with a vision to provide world-class technical education in computing and information technology.</p>
                  <p>Since inception, the department has grown into a vibrant academic community with experienced faculty, modern research laboratories, and a strong commitment to innovation. Our graduates serve in leading technology companies, research institutions, and academic organizations across Bangladesh and the globe.</p>
                  <p>We offer comprehensive programs at the BSc, MSc, and PhD levels, designed to equip students with both the theoretical foundation and practical expertise needed for success in the rapidly evolving computing landscape.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Research Facilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FACILITIES.map(f => (
                    <div key={f.name} className="flex items-center gap-4 border border-slate-200 rounded-xl p-4 hover:border-green-300 transition">
                      <span className="text-2xl shrink-0" aria-hidden="true">{f.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{f.name}</p>
                        <p className="text-xs text-slate-500">Capacity: {f.capacity} students</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
                <ul className="space-y-3">
                  {[
                    'Experienced faculty with national and international recognition',
                    'State-of-the-art computing laboratories',
                    'Strong industry connections and placement support',
                    'Active research culture with funded projects',
                    'Scholarships and financial aid for meritorious students',
                    'Alumni network spanning major tech companies worldwide',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-[#0b3d1f] text-white rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: '#86efac' }}>
                  Department at a Glance
                </h3>
                {STATS.map(s => (
                  <div key={s.label} className="flex justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-sm text-green-100/70">{s.label}</span>
                    <span className="text-sm font-bold text-white">{s.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-sm text-green-100/70">Established</span>
                  <span className="text-sm font-bold text-white">{SITE.founded}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Contact</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p>📍 {SITE.address}</p>
                  <p>✉️ <a href={`mailto:${SITE.email}`} className="text-green-700 hover:underline">{SITE.email}</a></p>
                  <p>📞 {SITE.phone}</p>
                </div>
                <Link href="/contact"
                  className="mt-4 block text-center text-sm font-semibold text-white rounded-xl py-2.5 transition"
                  style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                  Get in Touch
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
