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
    <header className="bg-white border-b border-slate-200">
      <div className="container-custom">

        {/* ── DESKTOP ─────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-between gap-6 py-3">

          {/* LEFT: Logo + Identity */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">

            {/* Logo circle */}
            <div className="w-[4.5rem] h-[4.5rem] shrink-0 rounded-full overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center">
              {s.deptLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.deptLogo} alt={s.deptShortName} className="w-full h-full object-contain p-1"/>
              ) : (
                <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
                  <path d="M40 7 L13 21 L13 43 C13 60 26 71 40 75 C54 71 67 60 67 43 L67 21 Z" fill="#166534"/>
                  <line x1="23" y1="35" x2="57" y2="35" stroke="white" strokeWidth="2"/>
                  <line x1="23" y1="44" x2="57" y2="44" stroke="white" strokeWidth="2"/>
                  <circle cx="32" cy="35" r="2.5" fill="#4ade80"/>
                  <circle cx="48" cy="35" r="2.5" fill="#4ade80"/>
                  <path d="M30 21 L40 13 L50 21" fill="none" stroke="#fbbf24" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Text */}
            <div>
              {/* "DEPARTMENT OF" label */}
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-0.5"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                Department of
              </p>
              {/* Dept name — large ExtraBold like the image */}
              <p className="text-slate-900 leading-none group-hover:text-green-800 transition"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 800,
                  fontSize: '1.55rem',
                  letterSpacing: '0.01em',
                }}>
                {/* Show only the core name after "Department of" */}
                {s.deptName.replace(/^Department of\s*/i, '').toUpperCase()}
              </p>
              {/* University name */}
              <p className="mt-1 text-slate-500"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 500,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                }}>
                {s.universityName}
                <span className="mx-1.5 opacity-40">·</span>
                <span className="font-bold text-slate-700">{s.universityShortName}</span>
              </p>
            </div>
          </Link>

          {/* RIGHT: utility strip */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Contact */}
            <Link href="/contact"
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600
                         hover:text-green-700 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact
            </Link>

            <div className="w-px h-4 bg-slate-200" aria-hidden="true"/>

            {/* Moodle */}
            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600
                         hover:text-green-700 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>

            <div className="w-px h-4 bg-slate-200" aria-hidden="true"/>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-slate-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search…" aria-label="Search"
                  className="pl-8 pr-3 py-1.5 text-[11px] text-slate-700 placeholder-slate-400
                             rounded-lg w-32 focus:outline-none focus:w-40 focus:ring-2 focus:ring-green-500 transition-all duration-300 border border-slate-200 bg-slate-50"/>
              </div>
            </form>

            <div className="w-px h-4 bg-slate-200" aria-hidden="true"/>

            {/* Student Login */}
            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700
                         hover:bg-green-50 transition px-3 py-1.5 rounded-lg border border-green-300">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>

            {/* Register */}
            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1
                         px-3.5 py-1.5 rounded-lg transition"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)', color: '#fff',
                       boxShadow: '0 2px 8px rgba(22,101,52,0.3)' }}>
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
            <div className="w-11 h-11 rounded-full border-2 border-slate-200 bg-white shadow-sm
                            flex items-center justify-center overflow-hidden">
              {s.deptLogo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-1"/>
                : <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                    <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                    <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
              <p className="font-extrabold text-slate-900 leading-tight"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.95rem' }}>
                {s.deptName.replace(/^Department of\s*/i, '')}
              </p>
              <p className="text-[10px] text-slate-500">{s.universityShortName}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
                className="rounded-lg px-3 py-1 text-xs text-slate-700 placeholder-slate-400 border border-slate-200 bg-slate-50 focus:outline-none w-24"/>
            </form>
            <Link href="/contact" className="text-xs text-slate-600 hover:text-green-700 transition">Contact</Link>
            <span className="text-slate-300">|</span>
            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-green-700 transition">Moodle</a>
            <span className="text-slate-300">|</span>
            <Link href="/student/login" className="text-xs font-semibold text-green-700 px-2.5 py-1 rounded-lg border border-green-300 hover:bg-green-50 transition">Login</Link>
            <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded-lg text-white transition"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>Register</Link>
          </div>
        </div>

        {/* ── MOBILE ──────────────────────────────────────────────────────── */}
        <div className="flex md:hidden items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-white shadow-sm
                            flex items-center justify-center overflow-hidden">
              {s.deptLogo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-1"/>
                : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                    <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z" fill="#166534"/>
                    <path d="M30 21 L40 14 L50 21" fill="none" stroke="#fbbf24" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500"
                style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
              <p className="text-sm font-extrabold text-slate-900 leading-tight"
                style={{ fontFamily: 'var(--font-montserrat)' }}>
                {s.deptName.replace(/^Department of\s*/i, '')}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/student/login" className="text-[11px] font-semibold text-green-700 px-2 py-1 rounded-lg border border-green-300">Login</Link>
            <Link href="/admissions" className="text-[11px] font-extrabold px-2 py-1 rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>Register</Link>
          </div>
        </div>

      </div>
    </header>
  );
}
