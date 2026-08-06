'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NAV_GROUPS } from './nav-items';
import { cn } from '@/lib/utils/cn';

interface SidebarProps { isOpen: boolean; onClose: () => void; }

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { admin, hasPermission } = useAuth();
  // Track which groups are collapsed (by group label)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggle(group: string) {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
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
        style={{ width: '256px', background: '#111827', borderRight: '1px solid #1f2937' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: '#16a34a' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-none">GSTU CSE</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Content Management</p>
          </div>
          <button onClick={onClose}
            className="lg:hidden text-gray-600 hover:text-white p-1 rounded transition"
            aria-label="Close menu">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_GROUPS.map(group => {
            const visible = group.items.filter(item =>
              item.permission ? hasPermission(item.permission) : true
            );
            if (!visible.length) return null;

            const isCollapsed = collapsed.has(group.group);
            const hasActive = visible.some(item =>
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href.split('?')[0]))
            );

            return (
              <div key={group.group} className="mb-1">
                {/* Group header */}
                <button
                  onClick={() => toggle(group.group)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 text-left',
                    'text-[10px] font-bold uppercase tracking-widest transition',
                    hasActive ? 'text-green-400' : 'text-gray-500 hover:text-gray-300',
                  )}>
                  {group.group}
                  <svg className={cn('w-3 h-3 transition-transform', isCollapsed ? '-rotate-90' : '')}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <ul className="mt-0.5 space-y-0.5">
                    {visible.map(item => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/admin/dashboard' &&
                          item.href.split('?')[0] !== '/admin/notices' &&
                          pathname.startsWith(item.href.split('?')[0]));

                      return (
                        <li key={item.href}>
                          <Link href={item.href} onClick={onClose}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                              isActive
                                ? 'bg-green-900/40 text-green-300 font-semibold border-l-2 border-green-500 pl-2.5'
                                : 'text-gray-400 hover:text-white hover:bg-white/5',
                            )}>
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24" strokeWidth={isActive ? 2.2 : 1.75}
                              style={{ color: isActive ? '#4ade80' : 'currentColor' }}
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

        {/* Footer profile */}
        <div className="shrink-0 px-3 py-3 border-t border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: '#16a34a' }}>
              {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{admin?.name ?? 'Admin'}</p>
              <p className="text-[10px] text-gray-500 capitalize truncate">
                {admin?.role?.replace('_', ' ') ?? 'administrator'}
              </p>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer"
              title="View site" className="text-gray-600 hover:text-white transition p-1 rounded">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
