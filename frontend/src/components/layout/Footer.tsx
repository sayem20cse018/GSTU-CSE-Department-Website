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
  { label: 'BSc in CSE',  href: '/academics/bsc' },
  { label: 'MSc in CSE',  href: '/academics/msc' },
  { label: 'PhD Program', href: '/academics/phd' },
  { label: 'Notices',     href: '/notices' },
  { label: 'News',        href: '/news' },
  { label: 'Events',      href: '/events' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2e] text-white" aria-label="Site footer">

      {/* ── Logo bar — centered above the grid ─────────────────────────── */}
      <div className="border-b border-white/10 py-6 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20
                        flex items-center justify-center overflow-hidden shadow-lg">
          <svg viewBox="0 0 80 80" className="w-10 h-10" fill="none">
            <path d="M40 6 L11 22 L11 44 C11 62 25 72 40 76 C55 72 69 62 69 44 L69 22 Z"
              fill="url(#ft-lg)"/>
            <defs>
              <linearGradient id="ft-lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#166534"/>
                <stop offset="100%" stopColor="#052e16"/>
              </linearGradient>
            </defs>
            <line x1="24" y1="34" x2="56" y2="34" stroke="white" strokeWidth="1.8"/>
            <line x1="24" y1="43" x2="56" y2="43" stroke="white" strokeWidth="1.8"/>
            <line x1="24" y1="52" x2="56" y2="52" stroke="white" strokeWidth="1.8"/>
            <line x1="32" y1="34" x2="32" y2="52" stroke="#4ade80" strokeWidth="1.3"/>
            <line x1="48" y1="34" x2="48" y2="52" stroke="#4ade80" strokeWidth="1.3"/>
            <circle cx="32" cy="34" r="2.2" fill="#4ade80"/>
            <circle cx="40" cy="34" r="2.2" fill="#86efac"/>
            <circle cx="48" cy="34" r="2.2" fill="#4ade80"/>
            <circle cx="40" cy="52" r="2.2" fill="#bbf7d0"/>
            <path d="M29 22 L40 14 L51 22" fill="none" stroke="#fbbf24"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {SITE.shortName}
        </p>
        <p className="text-slate-400 text-xs">{SITE.university}</p>
      </div>

      {/* ── Main footer ────────────────────────────────────────────────── */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div>
                <p className="font-bold text-white leading-tight">Dept. of CSE</p>
                <p className="text-xs text-slate-400">{SITE.universityShort}</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { href: SITE.socialLinks.facebook, label: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { href: SITE.socialLinks.twitter,  label: 'Twitter',  icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { href: SITE.socialLinks.linkedin, label: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                { href: SITE.socialLinks.youtube,  label: 'YouTube',  icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-400 transition shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Academics ─────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Academics</h3>
            <ul className="space-y-2.5">
              {ACADEMIC_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-600 group-hover:bg-blue-400 transition shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4">
              {[
                {
                  icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
                  text: SITE.address,
                },
                {
                  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  text: SITE.email,
                  href: `mailto:${SITE.email}`,
                },
                {
                  icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                  text: SITE.phone,
                  href: `tel:${SITE.phone}`,
                },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {item.icon.split(' M').map((part, i) => (
                        <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={i === 0 ? part : 'M' + part} />
                      ))}
                    </svg>
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-slate-400 hover:text-white transition leading-relaxed">
                      {item.text}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {SITE.name}, {SITE.university}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-slate-300 transition">Sitemap</Link>
            <Link href="/admin/login" className="hover:text-slate-300 transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
