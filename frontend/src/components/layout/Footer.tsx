import Link from 'next/link';
import { SITE } from '@/constants';

const ABOUT_LINKS = [
  { label: 'Vision & Mission',   href: '/about/vision' },
  { label: 'History',            href: '/about/history' },
  { label: 'Awards',             href: '/about#awards' },
  { label: 'About Department',   href: '/about' },
  { label: 'Contact Us',         href: '/contact' },
];

const ACADEMIC_LINKS = [
  { label: 'Academic Calendar',    href: '/academics/resources?type=calendar' },
  { label: 'Class Routine',        href: '/academics/resources?type=routine' },
  { label: 'Undergraduate Studies',href: '/academics/bsc' },
  { label: 'Graduate Studies',     href: '/academics/msc' },
  { label: 'Syllabus',             href: '/academics/resources?type=guideline' },
];

const RESEARCH_LINKS = [
  { label: 'Research Areas', href: '/research' },
  { label: 'Faculty',        href: '/faculty' },
  { label: 'Publications',   href: '/research/publications' },
  { label: 'Year Book',      href: '/research/yearbook' },
];

const ADMISSION_LINKS = [
  { label: 'Undergraduate',       href: '/admissions/undergraduate' },
  { label: 'Postgraduate',        href: '/admissions/graduate' },
  { label: 'Admission Notice',    href: '/notices?cat=admission' },
  { label: 'Tuition & Fees',      href: '/admissions#fees' },
];

const SOCIALS = [
  { label: 'Facebook', href: SITE.socialLinks.facebook,
    path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
  { label: 'Twitter',  href: SITE.socialLinks.twitter,
    path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { label: 'LinkedIn', href: SITE.socialLinks.linkedin,
    path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
  { label: 'YouTube',  href: SITE.socialLinks.youtube,
    path: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
];

export default function Footer() {
  return (
    <footer aria-label="Site footer">

      {/* ── MAIN — light gray/white background (BUET-style) ─────────── */}
      <div style={{ background: '#f8f9fa', borderTop: '4px solid #1a7a3c' }}>
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* ── Brand column (2 units wide) ───────────────────────── */}
            <div className="lg:col-span-1">
              {/* Logo + name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full border-2 overflow-hidden bg-white flex items-center justify-center shadow-sm shrink-0"
                  style={{ borderColor: '#1a7a3c' }}
                >
                  <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                    <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                    <rect x="26" y="28" width="28" height="22" rx="2" fill="white" opacity="0.9"/>
                    {[31,36,41,46].map(x => (
                      <g key={x}>
                        <line x1={x} y1="24" x2={x} y2="28" stroke="white" strokeWidth="2"/>
                        <line x1={x} y1="50" x2={x} y2="54" stroke="white" strokeWidth="2"/>
                      </g>
                    ))}
                    {[32,37,42].map(y => (
                      <g key={y}>
                        <line x1="22" y1={y} x2="26" y2={y} stroke="white" strokeWidth="2"/>
                        <line x1="54" y1={y} x2="58" y2={y} stroke="white" strokeWidth="2"/>
                      </g>
                    ))}
                    <text x="40" y="40" textAnchor="middle" dominantBaseline="middle"
                      fontSize="8" fontWeight="900" fill="#dc2626"
                      style={{ fontFamily: 'Arial, sans-serif' }}>CSE</text>
                    <text x="40" y="62" textAnchor="middle" dominantBaseline="middle"
                      fontSize="5" fontWeight="bold" fill="white" opacity="0.85"
                      style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>GSTU</text>
                  </svg>
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Computer Science and Engineering
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {SITE.university}
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 mb-5">
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Telephone:</span> {SITE.phone}
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">E-mail:</span>{' '}
                  <a href={`mailto:${SITE.email}`} className="hover:text-green-700 transition">
                    {SITE.email}
                  </a>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {SITE.address}
                </p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center
                               text-slate-600 transition-all duration-200
                               hover:bg-green-700 hover:border-green-700 hover:text-white"
                    style={{ borderColor: '#cbd5e1' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      strokeWidth={1.75} aria-hidden="true">
                      {s.path.split(' M').map((part, i) => (
                        <path key={i} strokeLinecap="round" strokeLinejoin="round"
                          d={i === 0 ? part : 'M' + part}/>
                      ))}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── About us ─────────────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 pb-2"
                style={{ borderBottom: '2px solid #1a7a3c' }}>
                About us
              </h3>
              <ul className="space-y-2">
                {ABOUT_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Academics ────────────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 pb-2"
                style={{ borderBottom: '2px solid #1a7a3c' }}>
                Academics
              </h3>
              <ul className="space-y-2">
                {ACADEMIC_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Research ─────────────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 pb-2"
                style={{ borderBottom: '2px solid #1a7a3c' }}>
                Research
              </h3>
              <ul className="space-y-2">
                {RESEARCH_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Admission ────────────────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 pb-2"
                style={{ borderBottom: '2px solid #1a7a3c' }}>
                Admission
              </h3>
              <ul className="space-y-2">
                {ADMISSION_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── COPYRIGHT BAR — dark navy (BUET-style) ──────────────────── */}
      <div style={{ background: '#1e2d3d' }}>
        <div className="container-custom py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Copyright © Department of Computer Science and Engineering, {SITE.universityShort}.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href="/privacy"    className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/sitemap"    className="hover:text-slate-300 transition">Sitemap</Link>
            <Link href="/admin/login" className="hover:text-slate-300 transition">Admin</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
