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
    <header
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, #071e0f 0%, #0a2d17 30%, #0d3d21 60%, #0b3318 100%)',
      }}
    >
      {/* ── Layered background decorations ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* Circuit-board grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hdr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hdr-grid)"/>
        </svg>
        {/* Left green glow */}
        <div className="absolute -left-10 top-0 w-72 h-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(ellipse at left, #22c55e, transparent 70%)' }}/>
        {/* Right teal glow */}
        <div className="absolute right-0 top-0 w-56 h-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(ellipse at right, #14b8a6, transparent 70%)' }}/>
        {/* Horizontal light streak */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, #4ade80 30%, #fbbf24 50%, #4ade80 70%, transparent)' }}/>
        {/* Bottom gold accent */}
        <div className="absolute bottom-0 inset-x-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent, #fbbf24 20%, #fde68a 50%, #fbbf24 80%, transparent)' }}/>
      </div>

      {/* ── DESKTOP ─────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block relative z-10">
        <div className="container-custom flex items-center justify-between gap-6 py-4">

          {/* LEFT — Logo + Identity ───────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            {/* Logo */}
            <div className="relative shrink-0">
              {/* Glow ring */}
              <div className="absolute -inset-1 rounded-full blur-md opacity-50"
                style={{ background: 'radial-gradient(circle, #4ade80, #fbbf24, transparent)' }}
                aria-hidden="true"/>
              <div className="relative w-[62px] h-[62px] rounded-full overflow-hidden border-2 border-white/25
                              bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl">
                {s.deptLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.deptLogo} alt={s.deptShortName}
                    className="w-full h-full object-contain p-1"/>
                ) : (
                  <svg viewBox="0 0 80 80" className="w-10 h-10" fill="none">
                    <path d="M40 6 L11 22 L11 44 C11 62 25 72 40 76 C55 72 69 62 69 44 L69 22 Z"
                      fill="url(#lg1)"/>
                    <defs>
                      <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
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
                )}
              </div>
            </div>

            {/* Text block */}
            <div>
              {/* Dept name — big, bold, Montserrat */}
              <p
                className="text-white leading-none group-hover:text-green-200 transition-colors"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 800,
                  fontSize: '1.45rem',
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                }}
              >
                {s.deptName}
              </p>
              {/* University name — smaller, gold */}
              <p
                className="mt-1 leading-none"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  letterSpacing: '0.06em',
                  color: '#fde68a',
                  textTransform: 'uppercase',
                }}
              >
                {s.universityName}
                <span className="mx-2 opacity-40">·</span>
                <span style={{ color: '#86efac', fontWeight: 700 }}>{s.universityShortName}</span>
              </p>
            </div>
          </Link>

          {/* RIGHT — Utility strip ─────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5 shrink-0">

            <Link href="/contact"
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition"
              style={{ color: 'rgba(187,247,208,0.75)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(187,247,208,0.75)'; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact
            </Link>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition"
              style={{ color: 'rgba(187,247,208,0.75)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(187,247,208,0.75)'; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            {/* Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: '#86efac' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search…" aria-label="Search"
                  className="pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-green-300/40
                             rounded-lg w-32 focus:outline-none focus:w-44 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}/>
              </div>
            </form>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
              style={{ color: '#86efac', border: '1px solid rgba(134,239,172,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(134,239,172,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#86efac'; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>

            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1.5 px-4 py-1.5 rounded-lg transition"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#1a1a1a',
                boxShadow: '0 2px 12px rgba(251,191,36,0.35)',
              }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* ── TABLET ──────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex lg:hidden relative z-10 container-custom items-center justify-between py-3 gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm
                          flex items-center justify-center overflow-hidden shadow-md">
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                  <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                  <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </div>
          <div>
            <p className="text-white font-extrabold leading-tight text-sm group-hover:text-green-200 transition"
              style={{ fontFamily: 'var(--font-montserrat)' }}>{s.deptName}</p>
            <p className="text-[10px] font-medium" style={{ color: '#fde68a', fontFamily: 'var(--font-montserrat)' }}>
              {s.universityShortName}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
              className="rounded-lg px-3 py-1 text-xs text-white placeholder-green-300/40 focus:outline-none w-24"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}/>
          </form>
          <Link href="/contact" className="text-xs text-green-200/70 hover:text-white transition">Contact</Link>
          <span className="text-white/20">|</span>
          <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
            className="text-xs text-green-200/70 hover:text-white transition">Moodle</a>
          <span className="text-white/20">|</span>
          <Link href="/student/login" className="text-xs font-semibold px-2.5 py-1 rounded-lg transition"
            style={{ color: '#86efac', border: '1px solid rgba(134,239,172,0.3)' }}>Login</Link>
          <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded-lg"
            style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1a1a' }}>Register</Link>
        </div>
      </div>

      {/* ── MOBILE ──────────────────────────────────────────────────────────── */}
      <div className="flex md:hidden relative z-10 container-custom items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full border border-white/20 bg-white/10
                          flex items-center justify-center overflow-hidden shadow">
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                  <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                  <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            }
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-tight group-hover:text-green-200 transition"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {s.deptName}
            </p>
            <p className="text-[10px]" style={{ color: '#fde68a', fontFamily: 'var(--font-montserrat)' }}>
              {s.universityShortName}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href="/student/login" className="text-[11px] font-semibold px-2 py-1 rounded-lg"
            style={{ color: '#86efac', border: '1px solid rgba(134,239,172,0.3)' }}>Login</Link>
          <Link href="/admissions" className="text-[11px] font-extrabold px-2 py-1 rounded-lg"
            style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1a1a' }}>Register</Link>
        </div>
      </div>

    </header>
  );
}
