import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

export const metadata: Metadata = { title: 'About — GSTU CSE' };

const QUICK_LINKS = [
  { label: 'History',           href: '/about/history',   icon: '📜' },
  { label: 'Vision & Mission',  href: '/about/vision',    icon: '🎯' },
  { label: "Chairman's Message",href: '/about/chairman',  icon: '💬' },
  { label: 'Contact Info',      href: '/contact',         icon: '📞' },
];

const FACILITIES = [
  { name: 'Artificial Intelligence Lab',  capacity: 30, icon: '🤖' },
  { name: 'Computer Networks Lab',         capacity: 40, icon: '🌐' },
  { name: 'Software Engineering Lab',      capacity: 50, icon: '💻' },
  { name: 'Cybersecurity Lab',             capacity: 20, icon: '🔐' },
];

export default async function AboutPage() {
  // SSOT: all dept info from settings API
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  const intro = s.aboutIntro ||
    `The Department of ${s.deptName} at ${s.universityName} was established in ${s.foundedYear} with a vision to provide world-class technical education in computing and information technology. Since inception, the department has grown into a vibrant academic community with experienced faculty, modern research laboratories, and a strong commitment to innovation.`;

  return (
    <>
      <SectionHero
        tag="About Us"
        title={`About the Dept. of CSE`}
        description={`${s.deptName}, ${s.universityName} — fostering excellence in computing education and research.`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <div className="bg-white section-py">
        <div className="container-custom">

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
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
                <div className="text-slate-600 leading-relaxed space-y-4">
                  {intro.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {s.aboutVision && (
                  <div className="mt-6 border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-xl">
                    <p className="text-sm font-bold text-green-800 mb-1">Our Vision</p>
                    <p className="text-sm text-slate-600">{s.aboutVision.split('\n')[0]}</p>
                  </div>
                )}
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

            {/* Sidebar — SSOT: settings API */}
            <aside className="space-y-6">
              <div className="bg-[#0b3d1f] text-white rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-5" style={{ color: '#86efac' }}>
                  Department at a Glance
                </h3>
                {[
                  { label: 'Established',    value: String(s.foundedYear) },
                  { label: 'Programs',       value: 'BSc · MSc · PhD' },
                  { label: 'Dept. Email',    value: s.email },
                  { label: 'Phone',          value: s.phone },
                ].map(r => (
                  <div key={r.label} className="flex justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-sm text-green-100/70">{r.label}</span>
                    <span className="text-sm font-bold text-white truncate ml-2 text-right max-w-[140px]">{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Contact</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p>📍 {s.address}</p>
                  <p>✉️ <a href={`mailto:${s.email}`} className="text-green-700 hover:underline">{s.email}</a></p>
                  <p>📞 {s.phone}</p>
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
