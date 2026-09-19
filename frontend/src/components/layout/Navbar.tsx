'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { NAV_LINKS, SITE } from '@/constants';
import { cn } from '@/lib/utils/cn';
import { useStudentAuth } from '@/context/StudentAuthContext';
import ThemeLangSwitcher from '@/components/ui/ThemeLangSwitcher';

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
  const panelWidth = state.twoCol ? 480 : 230;
  const viewportW  = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const left       = Math.min(state.left, viewportW - panelWidth - 12);

  return createPortal(
    <div
      id="nav-dropdown-portal"
      style={{ position: 'fixed', top: state.top, left, width: panelWidth, zIndex: 99999 }}
      className="animate-[fadeIn_0.15s_ease]"
    >
      <div className="overflow-hidden rounded-xl shadow-2xl"
        style={{
          background: 'linear-gradient(160deg,#0f2d18 0%,#0e3d22 50%,#0a2e1a 100%)',
          border: '1px solid rgba(134,239,172,0.18)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45),0 0 0 1px rgba(255,255,255,0.05)',
        }}>
        <div className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg,transparent,#fbbf24,transparent)' }}/>
        <div className={cn('py-1.5', state.twoCol && 'grid grid-cols-2')}>
          {state.children.map((child) => {
            const active = pathname === child.href;
            return (
              <Link key={child.href} href={child.href} onClick={onClose}
                className="group flex items-center gap-2.5 px-5 py-2.5 transition-all duration-200"
                style={{ color: active ? '#fbbf24' : 'rgba(220,252,231,0.85)' }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#4ade80';
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
                }}>
                <span className="nav-dot shrink-0 rounded-full transition-all duration-200"
                  style={{ width: active ? '6px' : '5px', height: active ? '6px' : '5px',
                    background: active ? '#fbbf24' : 'rgba(134,239,172,0.5)' }}
                  aria-hidden="true"/>
                <span className="text-[0.81rem] font-medium">{child.label}</span>
                <svg className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: '#4ade80' }} aria-hidden="true">
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

// ─── NavItem base classes ─────────────────────────────────────────────────────
const ITEM_BASE = [
  'relative flex items-center gap-1',
  'px-3 h-[3.25rem]',
  'text-[0.8rem] font-semibold whitespace-nowrap',
  'transition-colors duration-200',
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
  const [hiddenItems,  setHiddenItems]  = useState<string[]>([]);

  const pathname = usePathname();
  const navRef   = useRef<HTMLElement>(null);
  const btnRefs  = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Student auth state
  const { student, isLoading: studentLoading, logout: studentLogout } = useStudentAuth();

  // Student nav children — all shown when logged in, only login + portal when logged out
  const STUDENT_CHILDREN_LOCKED: readonly ChildLink[] = [
    { label: 'Student Login',    href: '/student/login' },
    { label: 'Register Account', href: '/student/register' },
  ];

  useEffect(() => {
    fetch('/api/public/settings')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: { data?: { hiddenNavItems?: string[] } }) => {
        const hidden = d?.data?.hiddenNavItems;
        if (Array.isArray(hidden)) setHiddenItems(hidden);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const target   = e.target as Node;
      const inNav    = navRef.current?.contains(target);
      const inPortal = document.getElementById('nav-dropdown-portal')?.contains(target);
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

    // For Students dropdown resolve children based on auth
    const children: readonly ChildLink[] =
      link.label === 'Students'
        ? (student ? link.children : STUDENT_CHILDREN_LOCKED)
        : link.children;

    setDropdown(prev =>
      prev?.label === label ? null : {
        label, left: rect.left, top: rect.bottom + 2,
        twoCol: children.length > 6, children,
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  function itemStyle(isActive: boolean, isOpen = false): React.CSSProperties {
    if (isActive || isOpen) return { color: '#1a7a3c' };
    return { color: '#1a1a1a' };
  }

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-[9999] transition-all duration-300"
        style={{
          background: '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : undefined,
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.10)' : 'none',
        }}
        aria-label="Main navigation"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-[3.25rem]">

            <div className="flex lg:hidden items-center gap-2"/>

            {/* Desktop nav items */}
            <div className="hidden lg:flex items-center flex-1 h-full gap-0">
              {NAV_LINKS.filter(link => !hiddenItems.includes(link.href)).map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                const isOpen = dropdown?.label === link.label;

                const commonCls = cn(
                  ITEM_BASE,
                  (isActive || isOpen) ? 'after:bg-[#1a7a3c] after:scale-x-100' : 'after:bg-[#1a7a3c]',
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
                      <svg className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                  );
                }

                return (
                  <Link key={link.href} href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    style={itemStyle(isActive)}
                    className={commonCls}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#1a7a3c'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#1a1a1a'; }}>
                    {link.label}
                  </Link>
                );
              })}

              {/* Student avatar / login — after all nav items */}
              {!studentLoading && (
                <div className="ml-auto shrink-0 flex items-center gap-2 pl-3">
                  <ThemeLangSwitcher />
                  {student ? (
                    <>
                      <Link href="/students"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
                        style={{ background: 'rgba(26,122,60,0.07)', borderColor: 'rgba(26,122,60,0.3)', color: '#166534' }}>
                        <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold hidden md:inline max-w-[90px] truncate">
                          {student.name.split(' ')[0]}
                        </span>
                      </Link>
                      <button onClick={() => studentLogout()}
                        title="Student logout"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                      </button>
                    </>
                  ) : (
                    <Link href="/student/login"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                      style={{ color: '#1a7a3c', borderColor: 'rgba(26,122,60,0.35)', background: 'rgba(26,122,60,0.04)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(26,122,60,0.1)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(26,122,60,0.04)'; }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Student
                    </Link>
                  )}
                </div>
              )}
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div id="mobile-menu"
            className="lg:hidden border-t max-h-[80vh] overflow-y-auto"
            style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.08)' }}>
            <div className="container-custom py-3 space-y-0.5">
              <div className="px-3 py-2 mb-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a7a3c' }}>{SITE.shortName}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{SITE.university}</p>
              </div>

              {NAV_LINKS.filter(link => !hiddenItems.includes(link.href)).map((link) => {
                if (hasChildren(link)) {
                  const expanded = mobileExpand === link.label;
                  // For Students on mobile: filter children based on auth
                  const mobileChildren: readonly ChildLink[] =
                    link.label === 'Students'
                      ? (student ? link.children : STUDENT_CHILDREN_LOCKED)
                      : link.children;

                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileExpand(expanded ? null : link.label)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                        style={{ color: '#1a1a1a' }}
                        aria-expanded={expanded}>
                        {link.label}
                        <svg className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                      {expanded && (
                        <div className="ml-3 pl-3 border-l space-y-0.5 mb-1"
                          style={{ borderColor: 'rgba(26,122,60,0.2)' }}>
                          {mobileChildren.map((child) => (
                            <Link key={child.href} href={child.href}
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors"
                              style={{ color: pathname === child.href ? '#1a7a3c' : '#374151' }}>
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
                  <Link key={link.href} href={link.href}
                    className="block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                    style={{ color: pathname === link.href ? '#1a7a3c' : '#1a1a1a' }}>
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile student CTA + switchers */}
              <div className="flex gap-2 pt-3 pb-2 mt-3 border-t"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <ThemeLangSwitcher />
                {student ? (
                  <>
                    <Link href="/students" className="flex-1 text-center text-sm font-bold py-2.5 rounded-lg"
                      style={{ background: 'rgba(26,122,60,0.08)', color: '#166534', border: '1px solid rgba(26,122,60,0.3)' }}>
                      👤 {student.name.split(' ')[0]}
                    </Link>
                    <button onClick={() => studentLogout()}
                      className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg"
                      style={{ color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/student/login" className="flex-1 text-center text-sm font-bold py-2.5 rounded-lg"
                      style={{ color: '#1a7a3c', border: '1px solid rgba(26,122,60,0.4)' }}>
                      Student Login
                    </Link>
                    <Link href="/student/register" className="flex-1 text-center text-sm font-extrabold py-2.5 rounded-lg"
                      style={{ background: '#1a7a3c', color: '#ffffff' }}>
                      Register
                    </Link>
                  </>
                )}
                <a href="https://moodle.gstu.edu.bd" target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg"
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
        <DropdownPortal state={dropdown} pathname={pathname} onClose={() => setDropdown(null)}/>
      )}
    </>
  );
}
