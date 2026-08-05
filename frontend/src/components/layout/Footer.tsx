import Link from 'next/link';
import { SITE } from '@/constants';

const QUICK_LINKS = [
  { label: 'About the Department', href: '/about' },
  { label: 'Faculty Members',      href: '/faculty' },
  { label: 'Academic Programs',    href: '/academics' },
  { label: 'Research Groups',      href: '/research' },
  { label: 'Admissions',           href: '/admissions' },
  { label: 'Contact Us',           href: '/contact' },
];

const ACADEMIC_LINKS = [
  { label: 'BSc in CSE',    href: '/academics/bsc' },
  { label: 'MSc in CSE',   href: '/academics/msc' },
  { label: 'PhD Program',  href: '/academics/phd' },
  { label: 'Notices',      href: '/notices' },
  { label: 'News',         href: '/news' },
  { label: 'Events',       href: '/events' },
  { label: 'Gallery',      href: '/gallery' },
  { label: 'Alumni',       href: '/alumni' },
];

const SOCIALS = [
  {
    label: 'Facebook',
    href: SITE.socialLinks.facebook,
    path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'Twitter / X',
    href: SITE.socialLinks.twitter,
    path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  },
  {
    label: 'LinkedIn',
    href: SITE.socialLinks.linkedin,
    path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    label: 'YouTube',
    href: SITE.socialLinks.youtube,
    path: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
];

export default function Footer() {
  return (
    <footer aria-label="Site footer">

      {/* ── MAIN FOOTER — dark green with building photo overlay ─────── */}
      <div className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(160deg, #1a4a2e 0%, #1e6b3a 40%, #206b3c 70%, #1a5530 100%)' }}>

        {/* Campus building aerial photo — low-opacity overlay */}
        {/* Using a CSS background pattern to mimic aerial photo texture */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Circuit/tech grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
            <defs>
              <pattern id="ft-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M60 0L0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
                <circle cx="0" cy="0" r="2" fill="white" opacity="0.4"/>
                <circle cx="60" cy="60" r="2" fill="white" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ft-grid)"/>
          </svg>
          {/* Right-side glow blob */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(ellipse at right top, #4ade80 0%, transparent 60%)' }}/>
          {/* Bottom left glow */}
          <div className="absolute left-0 bottom-0 w-72 h-72 opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 60%)' }}/>
        </div>

        <div className="container-custom relative z-10 pt-14 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ── Brand + Social ───────────────────────────────────────── */}
            <div className="lg:col-span-1">
              {/* Logo + name */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10
                                flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                  <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                    <path d="M40 5 L10 20 L10 44 C10 62 24 73 40 77 C56 73 70 62 70 44 L70 20 Z"
                      fill="url(#ft-shield)"/>
                    <defs>
                      <linearGradient id="ft-shield" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#166534"/>
                        <stop offset="100%" stopColor="#052e16"/>
                      </linearGradient>
                    </defs>
                    <line x1="24" y1="34" x2="56" y2="34" stroke="white" strokeWidth="2"/>
                    <line x1="24" y1="43" x2="56" y2="43" stroke="white" strokeWidth="2"/>
                    <line x1="24" y1="52" x2="56" y2="52" stroke="white" strokeWidth="2"/>
                    <line x1="32" y1="34" x2="32" y2="52" stroke="#4ade80" strokeWidth="1.5"/>
                    <line x1="48" y1="34" x2="48" y2="52" stroke="#4ade80" strokeWidth="1.5"/>
                    <circle cx="32" cy="34" r="2.5" fill="#4ade80"/>
                    <circle cx="40" cy="34" r="2.5" fill="#86efac"/>
                    <circle cx="48" cy="34" r="2.5" fill="#4ade80"/>
                    <path d="M29 22 L40 14 L51 22" fill="none" stroke="#fbbf24"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm leading-tight"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {SITE.shortName}
                  </p>
                  <p className="text-white/50 text-[10px] mt-0.5">{SITE.universityShort}</p>
                </div>
              </div>

              {/* Address */}
              <p className="text-white/60 text-xs leading-relaxed mb-4">{SITE.address}</p>

              {/* Follow us */}
              <p className="text-xs font-extrabold text-white uppercase tracking-[0.18em] mb-3">
                Follow Us:
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full border-2 border-white/60 bg-white/10
                               flex items-center justify-center text-white
                               hover:bg-white hover:text-green-800 hover:border-white
                               transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
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

            {/* ── Quick Links ─────────────────────────────────────────── */}
            <div>
              <h3 className="text-xs font-extrabold text-white/50 uppercase tracking-[0.15em] mb-5 pb-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-white/70 hover:text-white transition flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-green-400 group-hover:bg-white transition shrink-0" aria-hidden="true"/>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Academics ───────────────────────────────────────────── */}
            <div>
              <h3 className="text-xs font-extrabold text-white/50 uppercase tracking-[0.15em] mb-5 pb-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Academics & More
              </h3>
              <ul className="space-y-2.5">
                {ACADEMIC_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-white/70 hover:text-white transition flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-green-400 group-hover:bg-white transition shrink-0" aria-hidden="true"/>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact ─────────────────────────────────────────────── */}
            <div>
              <h3 className="text-xs font-extrabold text-white/50 uppercase tracking-[0.15em] mb-5 pb-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                Contact Us
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: SITE.address },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: SITE.phone, href: `tel:${SITE.phone}` },
                  { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: SITE.email, href: `mailto:${SITE.email}` },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {item.icon.split(' M').map((p, j) => (
                          <path key={j} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={j === 0 ? p : 'M' + p}/>
                        ))}
                      </svg>
                    </div>
                    {item.href ? (
                      <a href={item.href} className="text-xs text-white/70 hover:text-white transition leading-relaxed">{item.text}</a>
                    ) : (
                      <p className="text-xs text-white/70 leading-relaxed">{item.text}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* ── GRASS SILHOUETTE — BAU style ──────────────────────────── */}
        <div className="relative w-full overflow-hidden" style={{ height: '60px' }} aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,60 L0,42 C8,38 10,32 14,28 C16,26 17,30 18,34 C20,30 22,22 26,18 C28,16 30,22 31,28
                 C34,22 36,14 40,10 C42,8 44,14 45,20 C48,14 50,6 54,4 C56,2 58,8 59,14
                 C62,8 65,0 69,0 C71,0 72,6 73,12 C76,6 78,-2 82,0 C84,2 85,8 86,14
                 C89,8 92,2 96,4 C98,6 99,12 100,18
                 C103,12 106,6 110,8 C112,10 113,16 114,22
                 C117,16 120,10 124,12 C126,14 127,20 128,26
                 C131,20 134,14 138,16 C140,18 141,24 142,30
                 C146,24 149,18 153,20 C155,22 156,28 157,34
                 C161,28 164,20 168,18 C171,16 173,24 174,30
                 C178,22 182,14 186,12 C189,10 191,18 192,24
                 C196,16 200,8 204,6 C207,4 209,12 210,18
                 C214,10 218,2 222,0 C225,-2 227,6 228,12
                 C232,4 237,-4 242,0 C244,4 245,10 246,16
                 C250,8 255,0 260,2 C262,4 263,10 264,16
                 C268,8 273,0 278,4 C280,8 281,14 282,20
                 C286,12 291,4 296,6 C299,8 300,14 301,20
                 C305,12 310,4 315,8 C318,12 319,18 320,24
                 C324,16 329,8 334,10 C337,12 338,18 339,24
                 C343,16 349,8 354,12 C357,16 358,22 359,28
                 C363,20 369,12 374,14 C377,16 378,22 379,28
                 C384,20 390,12 395,16 C398,20 399,26 400,32
                 C405,24 411,16 416,18 C419,20 420,26 421,32
                 C426,24 432,16 437,20 C440,24 441,30 442,36
                 C447,28 453,20 458,22 C461,24 462,30 463,36
                 C468,28 474,20 479,24 C482,28 483,34 484,40
                 C489,32 495,24 500,26 C503,28 504,34 505,40
                 C510,32 516,24 521,28 C524,32 525,38 526,44
                 C531,36 537,28 542,30 C545,32 546,38 547,44
                 C552,36 558,28 563,32 C566,36 567,42 568,48
                 C573,40 579,32 584,34 C587,36 588,42 589,48
                 C594,40 600,32 605,36 C608,40 609,46 610,52
                 C615,44 621,36 626,38 C629,40 630,46 631,52
                 C636,44 642,36 647,40 C650,44 651,50 652,56
                 C657,48 663,40 668,42 C671,44 672,50 673,56
                 C678,48 684,40 689,44 C692,48 693,54 694,60
                 C699,52 705,44 710,46 C713,48 714,54 715,60
                 C720,52 726,44 731,48 C734,52 735,58 736,60
                 L736,60 C900,44 1100,44 1200,48 C1250,50 1300,52 1350,50 C1400,48 1440,50 1440,52
                 L1440,60 Z"
              fill="rgba(255,255,255,0.06)"
            />
            <path
              d="M0,60 L0,52 C60,46 120,42 180,44 C240,46 300,52 360,50
                 C420,48 480,42 540,44 C600,46 660,52 720,50
                 C780,48 840,42 900,44 C960,46 1020,52 1080,50
                 C1140,48 1200,44 1260,46 C1320,48 1380,52 1440,50
                 L1440,60 Z"
              fill="rgba(255,255,255,0.04)"
            />
          </svg>
        </div>
      </div>

      {/* ── COPYRIGHT BAR ─────────────────────────────────────────────── */}
      <div style={{ background: '#0f2d19' }}>
        <div className="container-custom py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          <p>© {new Date().getFullYear()} {SITE.name}, {SITE.university}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-white transition">Sitemap</Link>
            <Link href="/admin/login" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
