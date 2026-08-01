import Link from 'next/link';
import { SITE } from '@/constants';

/**
 * Top header bar — university branding, contact, Moodle link, login button.
 * Sits above the sticky Navbar. Hidden on small screens (shown from md).
 */
export default function SiteHeader() {
  return (
    <div className="bg-[#1e3a5f] text-white">
      <div className="container-custom">

        {/* ── Wide desktop: logo + name on left, links on right ──────────── */}
        <div className="hidden lg:flex items-center justify-between gap-6 py-3">

          {/* Left: department identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Crest / logo placeholder */}
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition">
              <svg className="w-7 h-7 text-white" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.1"/>
                <path d="M20 6L8 13v8c0 6.627 5.158 12.83 12 14 6.842-1.17 12-7.373 12-14v-8L20 6z"
                  fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M15 20l3 3 7-7" stroke="#60a5fa" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-base font-extrabold text-white tracking-tight group-hover:text-blue-200 transition">
                {SITE.name}
              </p>
              <p className="text-xs text-blue-200/80 font-medium">{SITE.university}</p>
            </div>
          </Link>

          {/* Right: quick links */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Contact */}
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {SITE.email}
            </a>

            <div className="w-px h-4 bg-white/20 mx-1" aria-hidden="true"/>

            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {SITE.phone}
            </a>

            <div className="w-px h-4 bg-white/20 mx-1" aria-hidden="true"/>

            {/* Moodle */}
            <a
              href="https://moodle.gstu.edu.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>

            <div className="w-px h-4 bg-white/20 mx-1" aria-hidden="true"/>

            {/* Admin Login */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Login
            </Link>
          </div>
        </div>

        {/* ── Tablet (md–lg): compact strip ──────────────────────────────── */}
        <div className="hidden md:flex lg:hidden items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 6L8 13v8c0 6.627 5.158 12.83 12 14 6.842-1.17 12-7.373 12-14v-8L20 6z"
                  fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{SITE.shortName}</p>
              <p className="text-[10px] text-blue-200/80">{SITE.universityShort}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a href={`mailto:${SITE.email}`} className="text-xs text-blue-100 hover:text-white transition">{SITE.email}</a>
            <div className="w-px h-3 bg-white/20" aria-hidden="true"/>
            <a href="https://moodle.gstu.edu.bd" target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-100 hover:text-white transition">Moodle</a>
            <Link href="/admin/login"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg transition">Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
