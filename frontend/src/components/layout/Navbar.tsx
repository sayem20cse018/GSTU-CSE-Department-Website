'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, SITE } from '@/constants';
import { cn } from '@/lib/utils/cn';

type NavLink   = typeof NAV_LINKS[number];
type ChildLink = { label: string; href: string };

// How many children before we split into 2 columns in the dropdown
const TWO_COL_THRESHOLD = 6;

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);

  const pathname    = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpenDropdown(null);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpand(null);
  }, [pathname]);

  const hasChildren = (l: NavLink): l is NavLink & { children: readonly ChildLink[] } =>
    'children' in l && Array.isArray((l as { children?: unknown }).children);

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-[#002244]/98 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/10'
          : 'bg-[#002244]',
      )}
      aria-label="Main navigation"
    >
      <div className="container-custom" ref={dropdownRef}>
        <div className="flex items-center justify-between h-[3.25rem]">

          {/* ── Mobile logo ───────────────────────────────────────────────── */}
          <Link href="/" className="flex lg:hidden items-center gap-2" aria-label="GSTU CSE Home">
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 4L6 12v9c0 7.18 5.927 13.905 14 15.354C28.073 34.905 34 28.18 34 21v-9L20 4z"
                  fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-white">{SITE.shortName}</span>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0 flex-1 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              if (hasChildren(link)) {
                const isOpen    = openDropdown === link.label;
                const twoCol    = link.children.length > TWO_COL_THRESHOLD;

                return (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-[0.8rem] font-semibold whitespace-nowrap rounded-md transition-all',
                        isActive || isOpen
                          ? 'text-white bg-white/15'
                          : 'text-blue-100 hover:text-white hover:bg-white/10',
                      )}
                    >
                      {link.label}
                      <svg
                        className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                      <div
                        className={cn(
                          'absolute top-[calc(100%+2px)] left-0 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50',
                          'animate-[fadeIn_0.15s_ease]',
                          twoCol ? 'w-[26rem]' : 'w-52',
                        )}
                      >
                        {/* Two-column layout for large menus */}
                        <div className={cn(twoCol && 'columns-2 gap-0')}>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'flex items-center gap-2 px-4 py-2 text-[0.8rem] transition-colors break-inside-avoid',
                                pathname === child.href
                                  ? 'text-blue-700 bg-blue-50 font-semibold'
                                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50',
                              )}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true"/>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2 text-[0.8rem] font-semibold whitespace-nowrap rounded-md transition-all',
                    isActive
                      ? 'text-white bg-white/15'
                      : 'text-blue-100 hover:text-white hover:bg-white/10',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop right: Admin ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center shrink-0 ml-2">
            <Link
              href="/admin/login"
              className="text-[11px] font-semibold text-blue-200 hover:text-white
                         border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg transition"
            >
              Admin
            </Link>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────────── */}
          <button
            className="lg:hidden p-2 rounded-lg text-blue-100 hover:bg-white/10 transition"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden bg-[#001a33] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="container-custom py-3 space-y-0.5">

            <div className="px-3 py-2 mb-2 border-b border-white/10">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">{SITE.shortName}</p>
              <p className="text-[10px] text-blue-300/60 mt-0.5">{SITE.university}</p>
            </div>

            {NAV_LINKS.map((link) => {
              if (hasChildren(link)) {
                const expanded = mobileExpand === link.label;
                return (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileExpand(expanded ? null : link.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
                      aria-expanded={expanded}
                    >
                      {link.label}
                      <svg className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    {expanded && (
                      <div className="ml-3 pl-3 border-l border-white/10 space-y-0.5 mb-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
                              pathname === child.href
                                ? 'text-white bg-white/15 font-semibold'
                                : 'text-blue-200 hover:text-white hover:bg-white/10',
                            )}
                          >
                            <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" aria-hidden="true"/>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors',
                    pathname === link.href
                      ? 'text-white bg-white/15'
                      : 'text-blue-100 hover:text-white hover:bg-white/10',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Bottom actions */}
            <div className="flex gap-2 pt-3 pb-2 border-t border-white/10 mt-3">
              <Link href="/student/login"
                className="flex-1 text-center text-sm font-bold text-white border border-white/30 hover:bg-white/10 py-2.5 rounded-lg transition">
                Student Login
              </Link>
              <Link href="/admissions"
                className="flex-1 text-center text-sm font-bold text-white bg-blue-500 hover:bg-blue-400 py-2.5 rounded-lg transition">
                Register
              </Link>
              <a href="https://moodle.gstu.edu.bd" target="_blank" rel="noopener noreferrer"
                className="flex-1 text-center text-sm font-semibold text-blue-100 border border-white/20 hover:bg-white/10 py-2.5 rounded-lg transition">
                Moodle
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
