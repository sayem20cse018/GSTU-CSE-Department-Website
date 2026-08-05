'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchSettings, type SiteSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

export default function SiteHeader() {
  const [settings, setSettings] = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [query, setQuery]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setQuery(''); }
  }

  const s = settings;
  // Core dept name — strip leading "Department of" so we can render it separately
  const deptCore = s.deptName.replace(/^Department\s+of\s*/i, '');

  return (
    <header className="relative overflow-hidden select-none" style={{ height: '72px' }}>

      {/* ── DESKTOP (lg+) ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex h-full">

        {/* ── LEFT PANEL — green, logo + university ─────────────────────── */}
        <Link
          href="/"
          className="relative flex items-center gap-4 px-6 shrink-0 group"
          style={{
            background: 'linear-gradient(135deg, #0d5c2e 0%, #1a7a3c 60%, #15803d 100%)',
            minWidth: '340px',
          }}
          aria-label="Go to homepage"
        >
          {/* subtle dot pattern overlay */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '18px 18px',
            }} aria-hidden="true"/>

          {/* Logo */}
          <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-white/30
                          bg-white flex items-center justify-center shadow-lg z-10">
            {s.deptLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
            ) : (
              <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                <path d="M40 7 L13 21 L13 43 C13 60 26 71 40 75 C54 71 67 60 67 43 L67 21 Z"
                  fill="#166534"/>
                <line x1="23" y1="35" x2="57" y2="35" stroke="white" strokeWidth="2"/>
                <line x1="23" y1="44" x2="57" y2="44" stroke="white" strokeWidth="2"/>
                <circle cx="32" cy="35" r="2" fill="#4ade80"/>
                <circle cx="48" cy="35" r="2" fill="#4ade80"/>
                <path d="M30 21 L40 13 L50 21" fill="none" stroke="#fbbf24"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {/* University name */}
          <div className="z-10">
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-1"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {s.universityShortName}
            </p>
            <p className="text-white font-extrabold leading-tight"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                maxWidth: '200px',
              }}>
              {s.universityName}
            </p>
          </div>

          {/* Diagonal right edge — skewed pseudo-divider using a div */}
          <div className="absolute right-0 top-0 h-full w-10 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #0d5c2e 0%, #1a7a3c 60%, #15803d 100%)',
              clipPath: 'polygon(0 0, 60% 0, 100% 100%, 0 100%)',
            }} aria-hidden="true"/>
        </Link>

        {/* ── DIAGONAL BLADE — overlap transition ───────────────────────── */}
        <div className="relative z-10 -ml-4 shrink-0 pointer-events-none" style={{ width: '40px' }}>
          <div className="h-full w-full" style={{
            background: '#152540',
            clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0 100%)',
          }} aria-hidden="true"/>
        </div>

        {/* ── RIGHT PANEL — dark navy, dept name ────────────────────────── */}
        <div className="flex-1 flex items-center justify-between px-5"
          style={{ background: '#152540' }}>

          {/* Dept name */}
          <Link href="/" className="group shrink-0">
            <p className="text-white/50 leading-none mb-0.5"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.7rem',
                fontStyle: 'italic',
                letterSpacing: '0.02em',
              }}>
              Department of
            </p>
            <p className="text-white leading-tight group-hover:text-green-300 transition-colors"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '1.45rem',
                letterSpacing: '0.01em',
              }}>
              {deptCore}
            </p>
          </Link>

          {/* Utility strip */}
          <div className="flex items-center gap-0.5 shrink-0">

            {/* Contact */}
            <Link href="/contact"
              className="flex items-center gap-1.5 text-[11px] font-medium text-white/60
                         hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact
            </Link>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            {/* Moodle */}
            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium text-white/60
                         hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-white/40"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search…" aria-label="Search"
                  className="pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-white/30
                             rounded-lg w-32 focus:outline-none focus:w-44 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}/>
              </div>
            </form>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            {/* Student Login */}
            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-green-300
                         hover:text-white hover:bg-white/10 transition px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid rgba(134,239,172,0.3)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>

            {/* Register */}
            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1 px-3.5 py-1.5 rounded-lg transition"
              style={{
                background: 'linear-gradient(135deg, #1a7a3c, #15803d)',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(26,122,60,0.4)',
              }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register
            </Link>
          </div>
        </div>

        {/* Bottom green accent line */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #1a7a3c 0%, #4ade80 40%, #fbbf24 60%, #1a7a3c 100%)' }}
          aria-hidden="true"/>
      </div>

      {/* ── TABLET (md–lg) ────────────────────────────────────────────────── */}
      <div className="hidden md:flex lg:hidden h-full items-stretch">

        {/* Green left */}
        <Link href="/" className="flex items-center gap-3 px-4 shrink-0"
          style={{ background: 'linear-gradient(135deg,#0d5c2e,#1a7a3c)' }}>
          <div className="w-9 h-9 rounded-full bg-white/90 border border-white/40
                          flex items-center justify-center overflow-hidden shadow">
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                  <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                  <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </div>
          <p className="text-white font-bold text-xs uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {s.universityShortName}
          </p>
        </Link>

        {/* Dark right */}
        <div className="flex-1 flex items-center justify-between px-4" style={{ background: '#152540' }}>
          <div>
            <p className="text-white/40 text-[9px] italic">Department of</p>
            <p className="text-white font-bold text-sm leading-tight"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {deptCore}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
                className="rounded-lg px-3 py-1 text-xs text-white placeholder-white/30 w-24 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.15)' }}/>
            </form>
            <Link href="/contact" className="text-xs text-white/60 hover:text-white transition">Contact</Link>
            <span className="text-white/20">|</span>
            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="text-xs text-white/60 hover:text-white transition">Moodle</a>
            <span className="text-white/20">|</span>
            <Link href="/student/login" className="text-xs font-semibold text-green-300 px-2.5 py-1 rounded-lg border border-green-400/30 hover:bg-white/10 transition">Login</Link>
            <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded-lg text-white transition"
              style={{ background: 'linear-gradient(135deg,#1a7a3c,#15803d)' }}>Register</Link>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg,#1a7a3c,#4ade80,#fbbf24,#1a7a3c)' }}
          aria-hidden="true"/>
      </div>

      {/* ── MOBILE ────────────────────────────────────────────────────────── */}
      <div className="flex md:hidden h-full items-stretch">

        {/* Green left */}
        <Link href="/" className="flex items-center gap-2.5 px-3 shrink-0"
          style={{ background: 'linear-gradient(135deg,#0d5c2e,#1a7a3c)', minWidth: '120px' }}>
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center overflow-hidden">
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-6 h-6" fill="none">
                  <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                  <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </div>
          <p className="text-white font-bold text-[10px] uppercase tracking-wide leading-tight"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            {s.universityShortName}
          </p>
        </Link>

        {/* Dark right */}
        <div className="flex-1 flex items-center justify-between px-3" style={{ background: '#152540' }}>
          <div>
            <p className="text-white/40 text-[8px] italic">Dept. of</p>
            <p className="text-white font-bold text-xs leading-tight"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {deptCore}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Link href="/student/login" className="text-[11px] font-semibold text-green-300 px-2 py-1 rounded-lg border border-green-400/30">Login</Link>
            <Link href="/admissions" className="text-[11px] font-extrabold px-2 py-1 rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg,#1a7a3c,#15803d)' }}>Register</Link>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg,#1a7a3c,#4ade80,#fbbf24,#1a7a3c)' }}
          aria-hidden="true"/>
      </div>

    </header>
  );
}
