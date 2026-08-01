'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, SITE } from '@/constants';
import { cn } from '@/lib/utils/cn';

type NavLink = typeof NAV_LINKS[number];
type ChildLink = { label: string; href: string };

export default function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Scroll shadow ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Close mobile menu on route change ───────────────────────────────────
  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  const hasChildren = (link: NavLink): link is NavLink & { children: readonly ChildLink[] } =>
    'children' in link && Array.isArray((link as { children?: unknown }).children);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-white border-b border-transparent',
      )}
    >
      {/* ── University strip ────────────────────────────────────────────── */}
      <div className="bg-[#1e3a5f] text-white hidden md:block">
        <div className="container-custom flex items-center justify-between py-1.5">
          <span className="text-xs font-medium tracking-wide opacity-90">
            {SITE.university}
          </span>
          <div className="flex items-center gap-4 text-xs opacity-80">
            <a href={`mailto:${SITE.email}`} className="hover:opacity-100 transition">
              {SITE.email}
            </a>
            <span className="text-white/30">|</span>
            <a href={`tel:${SITE.phone}`} className="hover:opacity-100 transition">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ────────────────────────────────────────────────── */}
      <div className="container-custom" ref={dropdownRef}>
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="GSTU CSE Home">
            {/* Shield icon */}
            <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center shrink-0 shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                Dept. of CSE
              </p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {SITE.universityShort}
              </p>
            </div>
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              if (hasChildren(link)) {
                const isOpen = openDropdown === link.label;
                return (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive ? 'text-blue-700' : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50',
                      )}
                    >
                      {link.label}
                      <svg
                        className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2 text-sm transition-colors',
                              pathname === child.href
                                ? 'text-blue-700 bg-blue-50 font-medium'
                                : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50',
                            )}
                          >
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
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTA ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/admissions"
              className="text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition shadow-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────────── */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="container-custom py-3 space-y-0.5" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              if (hasChildren(link)) {
                return (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 first:mt-0">
                      {link.label}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-5 py-2 text-sm rounded-lg transition-colors',
                          pathname === child.href
                            ? 'text-blue-700 font-medium bg-blue-50'
                            : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50',
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    pathname === link.href
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-2 border-t border-slate-100 mt-2">
              <Link
                href="/admissions"
                className="block text-center text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2.5 rounded-lg transition"
              >
                Apply Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
