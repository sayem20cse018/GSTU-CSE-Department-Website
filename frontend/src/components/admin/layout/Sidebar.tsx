'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NAV_GROUPS } from './nav-items';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { admin, hasPermission } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose} aria-hidden="true"/>
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          width: '260px',
          background: 'linear-gradient(180deg, #052e16 0%, #064e24 40%, #065f30 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* ── Brand ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-5 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-white leading-tight truncate">GSTU CSE</p>
            <p className="text-[10px] text-green-300/60 truncate">Admin Control Panel</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-green-300/50 hover:text-white transition p-1 rounded-lg hover:bg-white/10" aria-label="Close">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {NAV_GROUPS.map((group) => {
            const visible = group.items.filter(item =>
              item.permission ? hasPermission(item.permission) : true,
            );
            if (!visible.length) return null;

            return (
              <div key={group.group}>
                <p className="px-3 mb-1.5 text-[9px] font-extrabold uppercase tracking-[0.15em]"
                  style={{ color: 'rgba(134,239,172,0.4)' }}>
                  {group.group}
                </p>

                <ul className="space-y-0.5">
                  {visible.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          title={item.description}
                          className={cn(
                            'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'text-white'
                              : 'text-green-100/60 hover:text-white hover:bg-white/5',
                          )}
                          style={isActive ? {
                            background: 'rgba(22,163,74,0.25)',
                            border: '1px solid rgba(22,163,74,0.35)',
                            boxShadow: '0 0 12px rgba(22,163,74,0.15)',
                          } : { border: '1px solid transparent' }}
                        >
                          <span className="shrink-0 w-4 h-4">
                            <svg className="w-full h-full" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.75}
                              style={{ color: isActive ? '#4ade80' : 'currentColor' }}
                              aria-hidden="true">
                              {item.icon.split(' M').map((part, i) => (
                                <path key={i} strokeLinecap="round" strokeLinejoin="round"
                                  d={i === 0 ? part : 'M' + part}/>
                              ))}
                            </svg>
                          </span>

                          <span className="truncate">{item.label}</span>

                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: '#4ade80' }} aria-hidden="true"/>
                          )}
                          {item.badge && (
                            <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* ── Admin profile ─────────────────────────────────────────── */}
        <div className="shrink-0 px-4 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
              {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{admin?.name ?? 'Admin'}</p>
              <p className="text-[10px] text-green-300/50 capitalize truncate">
                {admin?.role?.replace('_', ' ') ?? 'administrator'}
              </p>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer"
              title="View public site"
              className="text-green-300/40 hover:text-white transition shrink-0 p-1.5 rounded-lg hover:bg-white/5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
