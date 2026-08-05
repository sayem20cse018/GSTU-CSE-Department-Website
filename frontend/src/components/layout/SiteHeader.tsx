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
  const deptCore = s.deptName.replace(/^Department\s+of\s*/i, '');

  return (
    <>
      {/* ══════════════════════ DESKTOP (lg+) ══════════════════════════ */}
      <header className="hidden lg:block overflow-hidden" style={{ height: '100px' }}>
        <div className="flex h-full">

          {/* ── WHITE LEFT — logo + identity ──────────────────────────── */}
          <Link href="/"
            className="relative flex items-center gap-4 px-6 shrink-0 bg-white group"
            style={{ minWidth: '420px', zIndex: 2 }}
            aria-label="Homepage"
          >
            {/* Logo */}
            <div className="relative shrink-0 w-[68px] h-[68px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: 'rgba(26,122,60,0.25)' }} aria-hidden="true"/>
              <div className="w-full h-full rounded-full overflow-hidden border-2 bg-white shadow-md flex items-center justify-center"
                style={{ borderColor: '#1a7a3c' }}>
                {s.deptLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.deptLogo} alt={s.deptShortName} className="w-full h-full object-contain p-1"/>
                ) : (
                  /* Default SVG shield-chip logo */
                  <svg viewBox="0 0 80 80" className="w-11 h-11" fill="none">
                    {/* Shield */}
                    <path d="M40 5 L10 20 L10 44 C10 62 24 73 40 77 C56 73 70 62 70 44 L70 20 Z"
                      fill="#dc2626" stroke="white" strokeWidth="1.5"/>
                    {/* Chip body */}
                    <rect x="22" y="27" width="36" height="26" rx="3" fill="white" opacity="0.15"/>
                    <rect x="26" y="30" width="28" height="20" rx="2" fill="white" opacity="0.9"/>
                    {/* Chip pins */}
                    {[30,36,42,48].map(x => (
                      <g key={x}>
                        <line x1={x} y1="27" x2={x} y2="30" stroke="white" strokeWidth="2"/>
                        <line x1={x} y1="50" x2={x} y2="53" stroke="white" strokeWidth="2"/>
                      </g>
                    ))}
                    {[33,39,45].map(y => (
                      <g key={y}>
                        <line x1="22" y1={y} x2="25" y2={y} stroke="white" strokeWidth="2"/>
                        <line x1="55" y1={y} x2="58" y2={y} stroke="white" strokeWidth="2"/>
                      </g>
                    ))}
                    {/* CSE text */}
                    <text x="40" y="44" textAnchor="middle" dominantBaseline="middle"
                      fontSize="7" fontWeight="bold" fill="#dc2626"
                      style={{ fontFamily: 'sans-serif' }}>CSE</text>
                    {/* GSTU text bottom */}
                    <text x="40" y="65" textAnchor="middle" dominantBaseline="middle"
                      fontSize="5" fill="white" opacity="0.9"
                      style={{ fontFamily: 'sans-serif', letterSpacing: '1px' }}>GSTU</text>
                  </svg>
                )}
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-slate-500 font-semibold leading-none mb-1.5"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                Department of
              </p>
              <p className="text-slate-900 leading-tight group-hover:text-green-800 transition"
                style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 800, fontSize: '1.55rem', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                {deptCore}
              </p>
              <p className="mt-1.5 text-slate-600"
                style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {s.universityName}
              </p>
            </div>

            {/* Right edge: diagonal white wedge + green stripe */}
            <div className="absolute right-0 top-0 h-full flex" style={{ width: '52px' }} aria-hidden="true">
              <div className="h-full w-full bg-white" style={{ clipPath: 'polygon(0 0, 40% 0, 0 100%)' }}/>
              {/* green stripe 1 */}
              <div className="absolute right-0 top-0 h-full" style={{ width: '18px', background: '#1a7a3c', clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0 100%)' }}/>
              {/* white stripe between greens */}
              <div className="absolute right-0 top-0 h-full" style={{ width: '10px', background: 'white', clipPath: 'polygon(60% 0, 100% 0, 40% 100%, 0 100%)', marginRight: '10px' }}/>
              {/* green stripe 2 */}
              <div className="absolute right-0 top-0 h-full" style={{ width: '10px', background: '#1a7a3c' }}/>
            </div>
          </Link>

          {/* ── DARK GREEN RIGHT — building silhouette bg ─────────────── */}
          <div className="relative flex-1 flex items-center justify-end px-8 overflow-hidden"
            style={{ background: 'linear-gradient(120deg, #0d4a1f 0%, #1a7a3c 60%, #155f30 100%)' }}>

            {/* Subtle dot pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" aria-hidden="true">
              <defs>
                <pattern id="sh-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sh-dots)"/>
            </svg>

            {/* Building silhouette outline — right side decoration */}
            <div className="absolute left-8 top-0 bottom-0 flex items-center opacity-10 pointer-events-none select-none" aria-hidden="true">
              <svg viewBox="0 0 320 90" className="w-72 h-20" fill="none">
                {/* Main building blocks */}
                <rect x="10" y="30" width="60" height="55" fill="white"/>
                <rect x="80" y="15" width="80" height="70" fill="white"/>
                <rect x="170" y="25" width="50" height="60" fill="white"/>
                <rect x="230" y="35" width="40" height="50" fill="white"/>
                <rect x="280" y="45" width="35" height="40" fill="white"/>
                {/* Windows */}
                {[20,35,50].map(x => [40,55,68].map(y => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="8" height="7" fill="#0d4a1f"/>
                )))}
                {[90,108,126,144].map(x => [25,38,51,64,77].map(y => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="10" height="8" fill="#0d4a1f"/>
                )))}
              </svg>
            </div>

            {/* Utility strip */}
            <div className="relative flex items-center gap-0.5 shrink-0">

              <Link href="/contact"
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/70 hover:text-white hover:bg-white/10">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Contact
              </Link>
              <div className="w-px h-4 mx-0.5 bg-white/20" aria-hidden="true"/>
              <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/70 hover:text-white hover:bg-white/10">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Moodle
              </a>
              <div className="w-px h-4 mx-0.5 bg-white/20" aria-hidden="true"/>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search…" aria-label="Search"
                    className="pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-white/30 rounded-lg w-28 focus:outline-none focus:w-40 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}/>
                </div>
              </form>
              <div className="w-px h-4 mx-0.5 bg-white/20" aria-hidden="true"/>
              <Link href="/student/login"
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition text-white"
                style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Student Login
              </Link>
              <Link href="/admissions"
                className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1.5 px-4 py-1.5 rounded-lg transition text-slate-900"
                style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════ TABLET (md–lg) ═════════════════════════ */}
      <header className="hidden md:flex lg:hidden overflow-hidden" style={{ height: '64px' }}>
        <Link href="/" className="flex items-center gap-3 px-4 shrink-0 bg-white">
          <div className="w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center bg-white shadow"
            style={{ borderColor: '#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                  <path d="M40 5 L10 20 L10 44 C10 62 24 73 40 77 C56 73 70 62 70 44 L70 20 Z" fill="#dc2626" stroke="white" strokeWidth="1.5"/>
                  <text x="40" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="bold" fill="white" style={{fontFamily:'sans-serif'}}>CSE</text>
                </svg>
            }
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-[0.18em]"
              style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-extrabold text-slate-900 text-sm leading-tight"
              style={{ fontFamily: 'var(--font-montserrat)' }}>{deptCore}</p>
            <p className="text-[9px] text-slate-500" style={{ fontFamily: 'var(--font-montserrat)' }}>{s.universityShortName}</p>
          </div>
        </Link>
        <div className="flex-1 flex items-center justify-end px-4 gap-2"
          style={{ background: 'linear-gradient(90deg,#0d4a1f,#1a7a3c)' }}>
          <form onSubmit={handleSearch}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
              className="rounded-lg px-3 py-1 text-xs text-white placeholder-white/40 focus:outline-none w-20"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}/>
          </form>
          <Link href="/contact" className="text-xs text-white/70 hover:text-white transition">Contact</Link>
          <span className="text-white/30">|</span>
          <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
            className="text-xs text-white/70 hover:text-white transition">Moodle</a>
          <span className="text-white/30">|</span>
          <Link href="/student/login" className="text-xs font-semibold px-2.5 py-1 rounded-lg text-white transition"
            style={{ border: '1px solid rgba(255,255,255,0.3)' }}>Login</Link>
          <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded-lg text-green-900"
            style={{ background: 'white' }}>Register</Link>
        </div>
      </header>

      {/* ══════════════════════ MOBILE ═════════════════════════════════ */}
      <header className="flex md:hidden items-center justify-between px-4 bg-white"
        style={{ height: '60px', borderBottom: '3px solid #1a7a3c' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full border-2 overflow-hidden bg-white flex items-center justify-center shadow"
            style={{ borderColor: '#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                  <path d="M40 5 L10 20 L10 44 C10 62 24 73 40 77 C56 73 70 62 70 44 L70 20 Z" fill="#dc2626" stroke="white" strokeWidth="1.5"/>
                  <text x="40" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="bold" fill="white" style={{fontFamily:'sans-serif'}}>CSE</text>
                </svg>
            }
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-extrabold text-slate-900 text-sm leading-tight"
              style={{ fontFamily: 'var(--font-montserrat)' }}>{deptCore}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href="/student/login" className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-green-700"
            style={{ borderColor: '#1a7a3c' }}>Login</Link>
          <Link href="/admissions" className="text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg text-white"
            style={{ background: '#1a7a3c' }}>Register</Link>
        </div>
      </header>
    </>
  );
}
