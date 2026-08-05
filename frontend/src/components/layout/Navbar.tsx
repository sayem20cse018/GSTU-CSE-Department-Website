'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { NAV_LINKS, SITE } from '@/constants';
import { cn } from '@/lib/utils/cn';

type NavLink   = typeof NAV_LINKS[number];
type ChildLink = { label: string; href: string };

interface DropdownState {
  label: string;
  left: number;
  top: number;
  twoCol: boolean;
  children: readonly ChildLink[];
}

// ─── Portal Dropdown ─────────────────────────────────────────────────────────
function DropdownPortal({
  state, pathname, onClose,
}: { state: DropdownState; pathname: string; onClose: () => void }) {
  const panelWidth  = state.twoCol ? 480 : 230;
  const viewportW   = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const left        = Math.min(state.left, viewportW - panelWidth - 12);

  return createPortal(
    <div
      id="nav-dropdown-portal"
      style={{ position: 'fixed', top: state.top, left, width: panelWidth, zIndex: 99999 }}
      className="animate-[fadeIn_0.15s_ease]"
    >
      {/* Dropdown card */}
      <div className="overflow-hidden rounded-xl shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #0f2d18 0%, #0e3d22 50%, #0a2e1a 100%)',
          border: '1px solid rgba(134,239,172,0.18)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>

        {/* Thin gold top line */}
        <div className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg,transparent,#fbbf24,transparent)' }}
        />

        <div className={cn('py-1.5', state.twoCol && 'grid grid-cols-2')}>
          {state.children.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="group flex items-center gap-2.5 px-5 py-2.5 transition-all duration-200"
                style={{ color: active ? '#fbbf24' : 'rgba(220,252,231,0.85)' }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#4ade80';
                    // animate the dot
                    const dot = e.currentTarget.querySelector('.nav-dot') as HTMLElement;
                    if (dot) dot.style.background = '#4ade80';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(220,252,231,0.85)';
                    const dot = e.currentTarget.querySelector('.nav-dot') as HTMLElement;
                    if (dot) dot.style.background = 'rgba(134,239,172,0.5)';
                  }
                }}
              >
                {/* Animated left indicator */}
                <span
                  className="nav-dot shrink-0 rounded-full transition-all duration-200"
                  style={{
                    width: active ? '6px' : '5px',
                    height: active ? '6px' : '5px',
                    background: active ? '#fbbf24' : 'rgba(134,239,172,0.5)',
                  }}
                  aria-hidden="true"
                />
                <span className="text-[0.81rem] font-medium">{child.label}</span>
                {/* Arrow that slides in on hover */}
                <svg
                  className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: '#4ade80' }}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── NavItem classes ──────────────────────────────────────────────────────────
const ITEM_BASE = [
  'relative flex items-center gap-1',
  'px-3 h-[3.25rem]',
  'text-[0.8rem] font-semibold whitespace-nowrap',
  'transition-colors duration-200',
  // Sliding underline
  'after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full',
  'after:scale-x-0 after:origin-left after:transition-transform after:duration-250',
  'hover:after:scale-x-100',
].join(' ');

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdown,     setDropdown]     = useState<DropdownState | null>(null);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);
  const [mounted,      setMounted]      = useState(false);

  const pathname = usePathname();
  const navRef   = useRef<HTMLElement>(null);
  const btnRefs  = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const target    = e.target as Node;
      const inNav     = navRef.current?.contains(target);
      const inPortal  = document.getElementById('nav-dropdown-portal')?.contains(target);
      if (!inNav && !inPortal) setDropdown(null);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false); setDropdown(null); setMobileExpand(null);
  }, [pathname]);

  useEffect(() => {
    const fn = () => setDropdown(null);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const hasChildren = (l: NavLink): l is NavLink & { children: readonly ChildLink[] } =>
    'children' in l && Array.isArray((l as { children?: unknown }).children);

  const openDropdown = useCallback((label: string) => {
    const btn = btnRefs.current.get(label);
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const link = NAV_LINKS.find(l => l.label === label);
    if (!link || !hasChildren(link)) return;
    setDropdown(prev =>
      prev?.label === label ? null : {
        label, left: rect.left, top: rect.bottom + 2,
        twoCol: link.children.length > 6, children: link.children,
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Shared styles ────────────────────────────────────────────────────────
  // Active: green underline + green text
  // Hover:  green text + green underline slides in
  function itemStyle(isActive: boolean, isOpen = false): React.CSSProperties {
    if (isActive || isOpen) return { color: '#1a7a3c' };  // green when active
    return { color: '#1a1a1a' };                           // black normally
  }

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-[9999] transition-all duration-300"
        style={{
          background: '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : undefined,
          borderBottom: scrolled
            ? '1px solid rgba(0,0,0,0.1)'
            : '1px solid rgba(0,0,0,0.08)',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.10)' : 'none',
        }}
        aria-label="Main navigation"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-[3.25rem]">

            {/* Mobile logo */}
            <Link href="/" className="flex lg:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-full border flex items-center justify-center"
                style={{ background: '#1a7a3c', borderColor: '#1a7a3c' }}>
                <svg className="w-4 h-4 text-white" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <path d="M20 4L6 12v9c0 7.18 5.927 13.905 14 15.354C28.073 34.905 34 28.18 34 21v-9L20 4z"
                    fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-slate-900">{SITE.shortName}</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center flex-1 h-full">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                const isOpen = dropdown?.label === link.label;

                const commonCls = cn(
                  ITEM_BASE,
                  isActive || isOpen
                    ? 'after:bg-[#1a7a3c] after:scale-x-100'   // green, always visible
                    : 'after:bg-[#1a7a3c]',                     // green, slides in on hover
                );

                if (hasChildren(link)) {
                  return (
                    <button
                      key={link.label}
                      ref={el => { if (el) btnRefs.current.set(link.label, el); }}
                      onClick={() => openDropdown(link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      style={itemStyle(isActive, isOpen)}
                      className={cn(commonCls, 'group')}
                      onMouseEnter={e => { if (!isActive && !isOpen) e.currentTarget.style.color = '#1a7a3c'; }}
                      onMouseLeave={e => { if (!isActive && !isOpen) e.currentTarget.style.color = '#1a1a1a'; }}
                    >
                      {link.label}
                      <svg
                        className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    style={itemStyle(isActive)}
                    className={commonCls}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#1a7a3c'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#1a1a1a'; }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg transition"
              style={{ color: '#374151' }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────────── */}
        {mobileOpen && (
          <div id="mobile-menu"
            className="lg:hidden border-t max-h-[80vh] overflow-y-auto"
            style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.08)' }}
          >
            <div className="container-custom py-3 space-y-0.5">
              <div className="px-3 py-2 mb-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a7a3c' }}>{SITE.shortName}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{SITE.university}</p>
              </div>

              {NAV_LINKS.map((link) => {
                if (hasChildren(link)) {
                  const expanded = mobileExpand === link.label;
                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileExpand(expanded ? null : link.label)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                        style={{ color: '#1a1a1a' }}
                        aria-expanded={expanded}
                        onMouseEnter={e => (e.currentTarget.style.color = '#1a7a3c')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#1a1a1a')}
                      >
                        {link.label}
                        <svg className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                      {expanded && (
                        <div className="ml-3 pl-3 border-l space-y-0.5 mb-1"
                          style={{ borderColor: 'rgba(26,122,60,0.2)' }}>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                              style={{
                                color: pathname === child.href ? '#1a7a3c' : '#374151',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#1a7a3c')}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = pathname === child.href ? '#1a7a3c' : '#374151';
                              }}
                            >
                              <span className="w-1 h-1 rounded-full shrink-0"
                                style={{ background: '#1a7a3c' }} aria-hidden="true"/>
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
                    className="block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{ color: pathname === link.href ? '#1a7a3c' : '#1a1a1a' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#1a7a3c')}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = pathname === link.href ? '#1a7a3c' : '#1a1a1a';
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="flex gap-2 pt-3 pb-2 mt-3 border-t"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <Link href="/student/login"
                  className="flex-1 text-center text-sm font-bold py-2.5 rounded-lg transition"
                  style={{ color: '#1a7a3c', border: '1px solid rgba(26,122,60,0.4)' }}>
                  Student Login
                </Link>
                <Link href="/admissions"
                  className="flex-1 text-center text-sm font-extrabold py-2.5 rounded-lg transition"
                  style={{ background: '#1a7a3c', color: '#ffffff' }}>
                  Register
                </Link>
                <a href="https://moodle.gstu.edu.bd" target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg transition"
                  style={{ color: '#374151', border: '1px solid rgba(0,0,0,0.15)' }}>
                  Moodle
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Portal dropdown */}
      {mounted && dropdown && (
        <DropdownPortal
          state={dropdown}
          pathname={pathname}
          onClose={() => setDropdown(null)}
        />
      )}
    </>
  );
}
