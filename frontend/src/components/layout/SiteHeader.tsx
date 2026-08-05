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

  // Fetch settings on mount (client-side for instant updates)
  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {/* keep fallback */});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setQuery(''); }
  }

  const s = settings;

  return (
    <header className="relative overflow-hidden text-white">

      {/* ── BACKGROUND LAYERS ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0b3d1f 0%, #0e4d2a 25%, #134e2a 50%, #0d3b22 75%, #0a2e1a 100%)' }}/>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)' }}/>
        {/* Dot matrix */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.09]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="white"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        {/* PCB traces */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="0" x2="15%" y2="100%" stroke="white" strokeWidth="1"/>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1"/>
          <line x1="85%" y1="0" x2="85%" y2="100%" stroke="white" strokeWidth="1"/>
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="white" strokeWidth="1"/>
          <circle cx="15%" cy="40%" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
          <circle cx="50%" cy="40%" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
          <circle cx="85%" cy="40%" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
          <circle cx="15%" cy="40%" r="2" fill="white"/>
          <circle cx="50%" cy="40%" r="2" fill="white"/>
          <circle cx="85%" cy="40%" r="2" fill="white"/>
        </svg>
        {/* Glow orbs */}
        <div className="absolute -left-20 top-0 w-80 h-full blur-[80px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 70%)' }}/>
        <div className="absolute -right-10 top-0 w-72 h-full blur-[70px] opacity-12"
          style={{ background: 'radial-gradient(ellipse, #14b8a6, transparent 70%)' }}/>
        {/* Gold accent line */}
        <div className="absolute bottom-0 inset-x-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #fbbf24 15%, #fde68a 40%, #fbbf24 60%, #d97706 85%, transparent 100%)' }}/>
        <div className="absolute bottom-[3px] inset-x-0 h-px bg-white/10"/>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="container-custom relative z-10">

        {/* ── DESKTOP ─────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-between gap-6 py-[1.1rem]">

          {/* Left: Logo + Identity */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            {/* Logo */}
            <div className="relative w-[4.75rem] h-[4.75rem] shrink-0">
              <div className="absolute inset-[-4px] rounded-full opacity-40 blur-md"
                style={{ background: 'radial-gradient(circle, #4ade80, #22c55e, transparent)' }}/>
              <div className="absolute inset-0 rounded-full p-[2px]"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #86efac, #fbbf24)' }}>
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl">
                  {s.deptLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.deptLogo} alt={s.deptShortName}
                      className="w-full h-full object-cover"/>
                  ) : (
                    <svg viewBox="0 0 80 80" className="w-[3.4rem] h-[3.4rem]" fill="none">
                      <defs>
                        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#166534"/>
                          <stop offset="100%" stopColor="#052e16"/>
                        </linearGradient>
                      </defs>
                      <path d="M40 7 L13 21 L13 43 C13 60 26 71 40 75 C54 71 67 60 67 43 L67 21 Z" fill="url(#shieldGrad)"/>
                      <line x1="23" y1="32" x2="57" y2="32" stroke="white" strokeWidth="1.8"/>
                      <line x1="23" y1="41" x2="57" y2="41" stroke="white" strokeWidth="1.8"/>
                      <line x1="23" y1="50" x2="57" y2="50" stroke="white" strokeWidth="1.8"/>
                      <line x1="31" y1="32" x2="31" y2="50" stroke="#4ade80" strokeWidth="1.3"/>
                      <line x1="49" y1="32" x2="49" y2="50" stroke="#4ade80" strokeWidth="1.3"/>
                      <circle cx="23" cy="32" r="2.5" fill="#4ade80"/>
                      <circle cx="40" cy="32" r="2.5" fill="#86efac"/>
                      <circle cx="57" cy="32" r="2.5" fill="#4ade80"/>
                      <circle cx="31" cy="41" r="2" fill="white"/>
                      <circle cx="49" cy="41" r="2" fill="white"/>
                      <circle cx="40" cy="50" r="2.5" fill="#bbf7d0"/>
                      <path d="M30 21 L40 13 L50 21" fill="none" stroke="#fbbf24" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic names from settings */}
            <div>
              <p className="text-white leading-tight tracking-tight group-hover:text-green-100 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                }}>
                {s.deptName}
              </p>
              <p className="mt-1 tracking-wide flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  color: '#fde68a',
                }}>
                <span className="inline-block w-1 h-1 rounded-full bg-yellow-400" aria-hidden="true"/>
                {s.universityName}
                <span className="opacity-50">·</span>
                <span style={{ color: '#86efac' }}>{s.universityShortName}</span>
              </p>
            </div>
          </Link>

          {/* Right: utility strip */}
          <div className="flex items-center gap-0.5 shrink-0">

            {/* Contact */}
            <Link href="/contact"
              className="flex items-center gap-1.5 text-[11px] font-medium text-green-100
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
              className="flex items-center gap-1.5 text-[11px] font-medium text-green-100
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
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: '#86efac' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search…" aria-label="Search"
                  className="pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-green-200/50
                             rounded-lg w-36 focus:outline-none focus:w-44 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}/>
              </div>
            </form>

            <div className="w-px h-4 mx-0.5 bg-white/15" aria-hidden="true"/>

            {/* Student Login */}
            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-green-100
                         hover:text-white hover:bg-white/10 transition px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid rgba(134,239,172,0.35)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>

            {/* Register — gold button */}
            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1
                         px-3.5 py-1.5 rounded-lg transition shadow-lg"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1a1a1a',
                       boxShadow: '0 2px 12px rgba(251,191,36,0.4)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register
            </Link>
          </div>
        </div>

        {/* ── TABLET ──────────────────────────────────────────────────────── */}
        <div className="hidden md:flex lg:hidden items-center justify-between py-3 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden"
              style={{ border: '2px solid #fbbf24' }}>
              {s.deptLogo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.deptLogo} alt="" className="w-full h-full object-cover"/>
                : <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                    <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                    <line x1="24" y1="38" x2="56" y2="38" stroke="white" strokeWidth="2"/>
                    <circle cx="32" cy="38" r="2.5" fill="#4ade80"/>
                    <circle cx="48" cy="38" r="2.5" fill="#4ade80"/>
                    <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </div>
            <div>
              <p className="text-sm font-extrabold text-white">{s.deptShortName}</p>
              <p className="text-[10px] font-semibold" style={{ color: '#fde68a' }}>{s.universityShortName}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
                className="rounded-lg px-3 py-1 text-xs text-white placeholder-green-200/50 focus:outline-none w-28"
                style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)' }}/>
            </form>
            <Link href="/contact" className="text-xs text-green-100 hover:text-white transition">Contact</Link>
            <span className="opacity-20 text-white">|</span>
            <a href={s.moodleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-100 hover:text-white transition">Moodle</a>
            <span className="opacity-20 text-white">|</span>
            <Link href="/student/login" className="text-xs font-semibold text-green-100 px-2.5 py-1 rounded-lg transition"
              style={{ border: '1px solid rgba(134,239,172,0.4)' }}>Login</Link>
            <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1a1a' }}>Register</Link>
          </div>
        </div>

        {/* ── MOBILE ──────────────────────────────────────────────────────── */}
        <div className="flex md:hidden items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center overflow-hidden"
              style={{ border: '2px solid #fbbf24' }}>
              {s.deptLogo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.deptLogo} alt="" className="w-full h-full object-cover"/>
                : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                    <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166634"/>
                    <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </div>
            <div>
              <p className="text-sm font-bold text-white">{s.deptShortName}</p>
              <p className="text-[10px]" style={{ color: '#fde68a' }}>{s.universityShortName}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/student/login" className="text-[11px] font-semibold text-green-100 px-2 py-1 rounded-lg"
              style={{ border: '1px solid rgba(134,239,172,0.4)' }}>Login</Link>
            <Link href="/admissions" className="text-[11px] font-extrabold px-2 py-1 rounded-lg"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1a1a' }}>Register</Link>
          </div>
        </div>

      </div>
    </header>
  );
}
