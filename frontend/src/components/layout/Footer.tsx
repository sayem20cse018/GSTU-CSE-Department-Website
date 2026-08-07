import Link from 'next/link';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

const ABOUT_LINKS = [
  { label: 'Vision & Mission',    href: '/about/vision' },
  { label: 'History',             href: '/about/history' },
  { label: 'About Department',    href: '/about' },
  { label: 'Contact Us',          href: '/contact' },
];

const ACADEMIC_LINKS = [
  { label: 'Academic Calendar',      href: '/academics/resources?type=calendar' },
  { label: 'Class Routine',          href: '/academics/resources?type=routine' },
  { label: 'Undergraduate Studies',  href: '/academics/bsc' },
  { label: 'Graduate Studies',       href: '/academics/msc' },
  { label: 'Syllabus',               href: '/academics/resources?type=guideline' },
];

const RESEARCH_LINKS = [
  { label: 'Research Areas',   href: '/research' },
  { label: 'Publications',     href: '/research/publications' },
  { label: 'Year Book',        href: '/research/yearbook' },
];

const ADMISSION_LINKS = [
  { label: 'Undergraduate',    href: '/admissions/undergraduate' },
  { label: 'Postgraduate',     href: '/admissions/graduate' },
  { label: 'Admission Notice', href: '/notices?cat=admission' },
  { label: 'Tuition & Fees',   href: '/admissions#fees' },
];

export default async function Footer() {
  // SSOT: contact info comes from settings API
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  return (
    <footer aria-label="Site footer">

      {/* ── MAIN FOOTER ── */}
      <div style={{ background: '#f8f9fa', borderTop: '4px solid #1a7a3c' }}>
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Column 1: Dept info — from settings API */}
            <div className="lg:col-span-1">
              <p className="font-extrabold text-slate-900 leading-snug mb-1"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.88rem' }}>
                {s.deptName}
              </p>
              <p className="text-slate-600 mb-4"
                style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 500, fontSize: '0.75rem' }}>
                {s.universityName}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{s.address}</p>
              <p className="text-xs text-slate-600 mb-1">
                <span className="font-semibold">Telephone:</span>{' '}
                <a href={`tel:${s.phone}`} className="hover:text-green-700 transition">{s.phone}</a>
              </p>
              <p className="text-xs text-slate-600 mb-5">
                <span className="font-semibold">E-mail:</span>{' '}
                <a href={`mailto:${s.email}`} className="hover:text-green-700 transition">{s.email}</a>
              </p>

              {/* Social icons from settings */}
              <div className="flex items-center gap-2.5">
                {[
                  { label: 'Facebook', href: s.facebookUrl, path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', cls: 'hover:bg-blue-600 hover:border-blue-600 hover:text-white text-blue-600 border-blue-400' },
                  { label: 'LinkedIn', href: s.linkedinUrl, path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z', cls: 'hover:bg-blue-700 hover:border-blue-700 hover:text-white text-blue-700 border-blue-500' },
                  { label: 'YouTube',  href: s.youtubeUrl,  path: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z', cls: 'hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 border-red-400' },
                ].filter(soc => soc.href).map(soc => (
                  <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer"
                    aria-label={soc.label}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white transition ${soc.cls}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {soc.path.split(' M').map((part, i) => (
                        <path key={i} d={i === 0 ? part : 'M' + part}/>
                      ))}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: About */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">About Us</h3>
              <ul className="space-y-2.5">
                {ABOUT_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-600 hover:text-green-700 transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Academics */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Academics</h3>
              <ul className="space-y-2.5">
                {ACADEMIC_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-600 hover:text-green-700 transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Research */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Research</h3>
              <ul className="space-y-2.5">
                {RESEARCH_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-600 hover:text-green-700 transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Admission */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Admission</h3>
              <ul className="space-y-2.5">
                {ADMISSION_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-600 hover:text-green-700 transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright — from settings */}
      <div style={{ background: '#1e2d3d' }}>
        <div className="container-custom py-3.5 flex items-center justify-center">
          <p className="text-xs text-center text-slate-400">
            Copyright &copy; {new Date().getFullYear()} {s.footerText || `${s.deptName}, ${s.universityName}. All rights reserved.`}
          </p>
        </div>
      </div>

    </footer>
  );
}
