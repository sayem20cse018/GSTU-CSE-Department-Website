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

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP (lg+) — two-panel design matching the reference image
      ══════════════════════════════════════════════════════════════════ */}
      <header className="hidden lg:block" style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-stretch" style={{ minHeight: '72px' }}>

          {/* ── LEFT PANEL — white, logo + identity ─────────────────────── */}
          <Link href="/"
            className="flex items-center gap-4 px-6 shrink-0 group"
            style={{ minWidth: '360px' }}
            aria-label="Go to homepage"
          >
            {/* Logo */}
            <div className="w-[54px] h-[54px] shrink-0 rounded-full overflow-hidden border-2
                            flex items-center justify-center bg-white shadow-md"
              style={{ borderColor: '#1a7a3c' }}>
              {s.deptLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.deptLogo} alt={s.deptShortName}
                  className="w-full h-full object-contain p-1"/>
              ) : (
                <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                  <path d="M40 6 L11 22 L11 44 C11 62 25 72 40 76 C55 72 69 62 69 44 L69 22 Z"
                    fill="url(#hdr-g1)"/>
                  <defs>
                    <linearGradient id="hdr-g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#166534"/>
                      <stop offset="100%" stopColor="#052e16"/>
                    </linearGradient>
                  </defs>
                  <line x1="24" y1="33" x2="56" y2="33" stroke="white" strokeWidth="2"/>
                  <line x1="24" y1="42" x2="56" y2="42" stroke="white" strokeWidth="2"/>
                  <line x1="24" y1="51" x2="56" y2="51" stroke="white" strokeWidth="2"/>
                  <line x1="32" y1="33" x2="32" y2="51" stroke="#4ade80" strokeWidth="1.5"/>
                  <line x1="48" y1="33" x2="48" y2="51" stroke="#4ade80" strokeWidth="1.5"/>
                  <circle cx="32" cy="33" r="2.5" fill="#4ade80"/>
                  <circle cx="40" cy="33" r="2.5" fill="#86efac"/>
                  <circle cx="48" cy="33" r="2.5" fill="#4ade80"/>
                  <path d="M29 22 L40 13 L51 22" fill="none" stroke="#fbbf24"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Text */}
            <div>
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.2em] leading-none mb-1"
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                Department of
              </p>
              <p className="text-slate-900 leading-none group-hover:text-green-800 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.01em',
                }}>
                {/* Strip "Department of" prefix if present */}
                {s.deptName.replace(/^Department\s+of\s*/i, '')}
              </p>
              <p className="mt-0.5 text-slate-500"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 500,
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                {s.universityName}
              </p>
            </div>
          </Link>

          {/* ── DIAGONAL SEPARATOR ──────────────────────────────────────── */}
          <div className="relative shrink-0 w-10 z-10" aria-hidden="true">
            {/* White overhang */}
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 30% 0, 0 100%)' }}/>
            {/* Dark fill */}
            <div className="absolute inset-0" style={{
              background: '#12253d',
              clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
            }}/>
          </div>

          {/* ── RIGHT PANEL — dark navy ──────────────────────────────────── */}
          <div className="flex-1 flex items-center justify-between px-5"
            style={{ background: '#12253d' }}>

            {/* Subtle texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 40px)',
              }} aria-hidden="true"/>

            {/* Utility links */}
            <div className="relative flex items-center gap-0.5">

              <Link href="/contact"
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/60 hover:text-white hover:bg-white/10">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Contact
              </Link>

              <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

              <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/60 hover:text-white hover:bg-white/10">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Moodle
              </a>

              <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-white/40"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input ref={inputRef} type="text" value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search…" aria-label="Search"
                    className="pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-white/30
                               rounded-lg w-32 focus:outline-none focus:w-44 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}/>
                </div>
              </form>

              <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

              <Link href="/student/login"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
                style={{ color: '#86efac', border: '1px solid rgba(134,239,172,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(134,239,172,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Student Login
              </Link>

              <Link href="/admissions"
                className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1.5 px-4 py-1.5 rounded-lg transition"
                style={{
                  background: 'linear-gradient(135deg,#1a7a3c,#15803d)',
                  color: '#fff',
                  boxShadow: '0 2px 10px rgba(26,122,60,0.4)',
                }}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom green accent line */}
        <div className="h-[3px]"
          style={{ background: 'linear-gradient(90deg,#1a7a3c 0%,#4ade80 40%,#1a7a3c 100%)' }}
          aria-hidden="true"/>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          TABLET (md–lg)
      ══════════════════════════════════════════════════════════════════ */}
      <header className="hidden md:flex lg:hidden items-stretch"
        style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', minHeight: '60px' }}>

        <Link href="/" className="flex items-center gap-3 px-4 shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 bg-white flex items-center justify-center shadow"
            style={{ borderColor: '#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                  <path d="M40 6 L11 22 L11 44 C11 62 25 72 40 76 C55 72 69 62 69 44 L69 22 Z" fill="#166534"/>
                  <path d="M29 22 L40 13 L51 22" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-extrabold text-slate-900 leading-tight text-sm"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {s.deptName.replace(/^Department\s+of\s*/i, '')}
            </p>
            <p className="text-[10px] text-slate-500" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {s.universityShortName}
            </p>
          </div>
        </Link>

        <div className="flex-1 flex items-center justify-end px-4 gap-2"
          style={{ background: '#12253d' }}>
          <form onSubmit={handleSearch}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
              className="rounded-lg px-3 py-1 text-xs text-white placeholder-white/30 focus:outline-none w-24"
              style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.15)' }}/>
          </form>
          <Link href="/contact" className="text-xs text-white/60 hover:text-white transition">Contact</Link>
          <span className="text-white/20">|</span>
          <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
            className="text-xs text-white/60 hover:text-white transition">Moodle</a>
          <span className="text-white/20">|</span>
          <Link href="/student/login" className="text-xs font-semibold px-2.5 py-1 rounded-lg transition"
            style={{ color: '#86efac', border: '1px solid rgba(134,239,172,0.3)' }}>Login</Link>
          <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded-lg text-white"
            style={{ background: 'linear-gradient(135deg,#1a7a3c,#15803d)' }}>Register</Link>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg,#1a7a3c,#4ade80,#1a7a3c)' }} aria-hidden="true"/>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE
      ══════════════════════════════════════════════════════════════════ */}
      <header className="flex md:hidden items-center justify-between px-4 py-3"
        style={{ background: '#fff', borderBottom: '3px solid #1a7a3c' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 bg-white flex items-center justify-center shadow"
            style={{ borderColor: '#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                  <path d="M40 6 L11 22 L11 44 C11 62 25 72 40 76 C55 72 69 62 69 44 L69 22 Z" fill="#166534"/>
                  <path d="M29 22 L40 13 L51 22" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-extrabold text-slate-900 text-sm leading-tight"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {s.deptName.replace(/^Department\s+of\s*/i, '')}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href="/student/login"
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-green-700"
            style={{ borderColor: '#1a7a3c' }}>Login</Link>
          <Link href="/admissions"
            className="text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg text-white"
            style={{ background: '#1a7a3c' }}>Register</Link>
        </div>
      </header>
    </>
  );
}
