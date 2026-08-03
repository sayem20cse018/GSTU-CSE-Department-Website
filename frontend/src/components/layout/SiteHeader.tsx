'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SITE } from '@/constants';

export default function SiteHeader() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setQuery(''); }
  }

  return (
    <header className="relative overflow-hidden bg-[#003366] text-white">

      {/* ── Decorative background ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Circuit-board grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hdr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hdr-grid)"/>
        </svg>
        {/* Gradient orbs */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl"/>
        <div className="absolute -bottom-10 left-1/3 w-56 h-56 bg-cyan-400/10 rounded-full blur-3xl"/>
        {/* Horizontal accent line */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"/>
      </div>

      <div className="container-custom relative z-10">

        {/* ── Desktop (lg+) ────────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-between gap-6 py-4">

          {/* Left — Logo + Identity */}
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            {/* Crest */}
            <div className="relative w-[4.5rem] h-[4.5rem] shrink-0">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-md scale-110"/>
              <div className="relative w-full h-full rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-2 border-blue-200/40">
                <svg viewBox="0 0 80 80" className="w-[3.25rem] h-[3.25rem]" fill="none" aria-hidden="true">
                  {/* Shield */}
                  <path d="M40 8 L14 21 L14 43 C14 59 26 70 40 74 C54 70 66 59 66 43 L66 21 Z"
                    fill="#003366"/>
                  {/* PCB lines inside shield */}
                  <line x1="24" y1="34" x2="56" y2="34" stroke="white" strokeWidth="2"/>
                  <line x1="24" y1="42" x2="56" y2="42" stroke="white" strokeWidth="2"/>
                  <line x1="24" y1="50" x2="56" y2="50" stroke="white" strokeWidth="2"/>
                  {/* Dots */}
                  <circle cx="24" cy="34" r="2.5" fill="#60a5fa"/>
                  <circle cx="40" cy="34" r="2.5" fill="#60a5fa"/>
                  <circle cx="56" cy="34" r="2.5" fill="#60a5fa"/>
                  <circle cx="32" cy="42" r="2"   fill="white"/>
                  <circle cx="48" cy="42" r="2"   fill="white"/>
                  <circle cx="40" cy="50" r="2.5" fill="#93c5fd"/>
                  {/* Top chevron */}
                  <path d="M31 21 L40 14 L49 21" fill="none" stroke="white" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Text identity */}
            <div>
              <p className="text-[1.3rem] font-extrabold text-white tracking-tight leading-tight
                            group-hover:text-blue-100 transition drop-shadow-sm">
                Department of Computer Science &amp; Engineering
              </p>
              <p className="text-[0.82rem] font-semibold text-blue-200 mt-0.5 tracking-wide">
                {SITE.university} &nbsp;·&nbsp; Est. {SITE.founded}
              </p>
            </div>
          </Link>

          {/* Right — utility strip */}
          <div className="flex items-center gap-0.5 shrink-0">

            {/* Contact */}
            <Link href="/contact"
              className="flex items-center gap-1.5 text-[11px] font-medium text-blue-100
                         hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact
            </Link>

            <div className="w-px h-4 bg-white/20 mx-0.5" aria-hidden="true"/>

            {/* Moodle */}
            <a href="https://moodle.gstu.edu.bd" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium text-blue-100
                         hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>

            <div className="w-px h-4 bg-white/20 mx-0.5" aria-hidden="true"/>

            {/* Inline search bar — always visible */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex items-center">
                <svg className="absolute left-2.5 w-3.5 h-3.5 text-blue-300 pointer-events-none" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  aria-label="Site search"
                  className="bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-1.5 text-[11px]
                             text-white placeholder-blue-300/70 focus:outline-none focus:bg-white/20
                             focus:border-white/40 w-36 transition"
                />
              </div>
            </form>

            <div className="w-px h-4 bg-white/20 mx-0.5" aria-hidden="true"/>

            {/* Student Login */}
            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-100
                         hover:text-white border border-white/25 hover:border-white/50
                         hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>

            {/* Register */}
            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-400 hover:to-blue-500
                         px-3 py-1.5 rounded-lg transition shadow-md shadow-blue-900/40 ml-0.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register
            </Link>
          </div>
        </div>

        {/* ── Tablet (md – lg) ─────────────────────────────────────────────── */}
        <div className="hidden md:flex lg:hidden items-center justify-between py-3 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none" aria-hidden="true">
                <circle cx="40" cy="40" r="38" stroke="#003366" strokeWidth="3" fill="white"/>
                <path d="M40 10 L16 22 L16 42 C16 57 27 68 40 72 C53 68 64 57 64 42 L64 22 Z" fill="#003366"/>
                <line x1="26" y1="37" x2="54" y2="37" stroke="white" strokeWidth="2"/>
                <circle cx="33" cy="37" r="2" fill="#60a5fa"/>
                <circle cx="47" cy="37" r="2" fill="#60a5fa"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold text-white leading-tight">Dept. of CSE</p>
              <p className="text-[10px] text-blue-200 font-medium">{SITE.universityShort}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center">
              <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…"
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-xs text-white placeholder-blue-300/70 focus:outline-none focus:bg-white/20 w-28 transition"/>
            </form>
            <Link href="/contact" className="text-xs text-blue-100 hover:text-white transition">Contact</Link>
            <span className="text-white/20">|</span>
            <a href="https://moodle.gstu.edu.bd" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-100 hover:text-white transition">Moodle</a>
            <span className="text-white/20">|</span>
            <Link href="/student/login"
              className="text-xs font-semibold text-blue-100 border border-white/30 px-2.5 py-1 rounded-lg hover:bg-white/10 transition">
              Login
            </Link>
            <Link href="/admissions"
              className="text-xs font-bold text-white bg-blue-500 hover:bg-blue-400 px-2.5 py-1 rounded-lg transition shadow-sm">
              Register
            </Link>
          </div>
        </div>

        {/* ── Mobile ───────────────────────────────────────────────────────── */}
        <div className="flex md:hidden items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none" aria-hidden="true">
                <circle cx="40" cy="40" r="38" stroke="#003366" strokeWidth="3" fill="white"/>
                <path d="M40 10 L16 22 L16 42 C16 57 27 68 40 72 C53 68 64 57 64 42 L64 22 Z" fill="#003366"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Dept. of CSE</p>
              <p className="text-[10px] text-blue-200">{SITE.universityShort}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/student/login"
              className="text-[11px] font-semibold text-blue-100 border border-white/30 px-2 py-1 rounded-lg">
              Login
            </Link>
            <Link href="/admissions"
              className="text-[11px] font-bold text-white bg-blue-500 px-2 py-1 rounded-lg">
              Register
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
