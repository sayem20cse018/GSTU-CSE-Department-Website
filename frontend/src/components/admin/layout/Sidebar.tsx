'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NAV_GROUPS } from './nav-items';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  accent?: string;
}

/** Fetch dept name + logo from settings (cached in module scope) */
let _cachedBrand: { name: string; logo: string } | null = null;
async function fetchBrand() {
  if (_cachedBrand) return _cachedBrand;
  try {
    const r = await fetch('/api/public/settings', { cache: 'no-store' });
    if (!r.ok) return null;
    const d = await r.json() as { data?: { deptShortName?: string; universityShortName?: string; deptLogo?: string } };
    const s = d.data;
    _cachedBrand = { name: s?.deptShortName ?? 'CSE Dept.', logo: s?.deptLogo ?? '' };
    return _cachedBrand;
  } catch { return null; }
}

export default function Sidebar({ isOpen, onClose, accent = '#16a34a' }: SidebarProps) {
  const pathname       = usePathname();
  const searchParams   = useSearchParams();
  const { admin, hasPermission } = useAuth();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [brand, setBrand] = useState<{ name: string; logo: string } | null>(null);

  useEffect(() => {
    fetchBrand().then(b => { if (b) setBrand(b); });
  }, []);

  function toggle(group: string) {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(group)) { next.delete(group); } else { next.add(group); }
      return next;
    });
  }

  function isItemActive(href: string): boolean {
    const [hrefPath, hrefQuery] = href.split('?');
    if (hrefQuery) {
      if (pathname !== hrefPath) return false;
      const hrefParams = new URLSearchParams(hrefQuery);
      for (const [key, val] of hrefParams.entries()) {
        if (searchParams.get(key) !== val) return false;
      }
      return true;
    }
    if (href === '/admin/dashboard') return pathname === href;
    if (pathname === hrefPath) return true;
    const group = NAV_GROUPS.find(g => g.items.some(i => i.href.split('?')[0] === hrefPath));
    if (group) {
      const hasSiblingWithLongerPath = group.items.some(item => {
        const sibPath = item.href.split('?')[0];
        return sibPath !== hrefPath && sibPath.startsWith(hrefPath + '/');
      });
      if (hasSiblingWithLongerPath) return pathname === hrefPath;
    }
    return pathname.startsWith(hrefPath + '/');
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose} aria-hidden="true"/>
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          width: '256px',
          background: 'var(--admin-sidebar-bg, #111827)',
          borderRight: '1px solid var(--admin-sidebar-border, #1f2937)',
        }}
      >
        {/* Brand — uses accent color gradient */}
        <div className="shrink-0 border-b" style={{ borderColor: 'var(--admin-sidebar-border, #1f2937)', background: `linear-gradient(135deg, ${accent}22, transparent)` }}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ring-1"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, borderColor: accent }}>
              {brand?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logo} alt="" className="w-full h-full object-contain p-0.5"/>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-none truncate" style={{ color: 'var(--admin-sidebar-fg)' }}>
                {brand?.name ?? 'GSTU CSE'}
              </p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color: accent }}>Admin Panel</p>
            </div>
            <button onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
              style={{ color: 'var(--admin-sidebar-fg)' }}
              aria-label="Close menu">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_GROUPS.map(group => {
            const visible = group.items.filter(item =>
              item.permission ? hasPermission(item.permission) : true
            );
            if (!visible.length) return null;
            const isCollapsed = collapsed.has(group.group);
            const hasActive   = visible.some(item => isItemActive(item.href));

            return (
              <div key={group.group} className="mb-1">
                <button
                  onClick={() => toggle(group.group)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 text-left rounded transition',
                    'text-[10px] font-bold uppercase tracking-widest',
                  )}
                  style={{ color: hasActive ? accent : 'var(--admin-sidebar-fg)' }}
                >
                  {group.group}
                  <svg className={cn('w-3 h-3 transition-transform', isCollapsed ? '-rotate-90' : '')}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {!isCollapsed && (
                  <ul className="mt-0.5 space-y-0.5">
                    {visible.map(item => {
                      const active = isItemActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link href={item.href} onClick={onClose}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                            style={active ? {
                              background: `color-mix(in srgb, ${accent} 15%, transparent)`,
                              color: accent,
                              fontWeight: 600,
                              borderLeft: `2px solid ${accent}`,
                              paddingLeft: '0.625rem',
                            } : {
                              color: 'var(--admin-sidebar-fg)',
                            }}
                            onMouseEnter={(e) => {
                              if (!active) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = '#fff';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!active) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--admin-sidebar-fg)';
                              }
                            }}
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.75}
                              style={{ color: active ? accent : 'currentColor' }}
                              aria-hidden="true">
                              {item.icon.split(' M').map((part, i) => (
                                <path key={i} strokeLinecap="round" strokeLinejoin="round"
                                  d={i === 0 ? part : 'M' + part}/>
                              ))}
                            </svg>
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 px-3 py-3 border-t"
          style={{ borderColor: 'var(--admin-sidebar-border, #1f2937)', background: 'color-mix(in srgb, var(--admin-sidebar-bg, #111827) 80%, #000)' }}>
          <div className="flex items-center gap-2.5 px-1">
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ring-2"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, borderColor: accent }}
            >
              {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--admin-sidebar-fg)' }}>
                {admin?.name ?? 'Admin'}
              </p>
              <p className="text-[10px] capitalize truncate" style={{ color: 'var(--admin-sidebar-fg)', opacity: 0.6 }}>
                {admin?.role?.replace('_', ' ') ?? 'administrator'}
              </p>
            </div>
            <Link href="/admin/settings"
              title="Settings"
              className="transition p-1.5 rounded-lg hover:bg-white/10"
              style={{ color: 'var(--admin-sidebar-fg)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
