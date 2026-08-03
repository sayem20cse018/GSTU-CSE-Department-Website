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
      {/* ── Mobile backdrop ───────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 border-r border-white/10',
          'flex flex-col transition-transform duration-300 ease-in-out',
          // Desktop: always visible
          'lg:translate-x-0 lg:static lg:z-auto',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* ── Brand ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight truncate">GSTU CSE</p>
            <p className="text-xs text-slate-400 truncate">Admin Panel</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-slate-400 hover:text-white transition"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => {
            // Filter items by permission
            const visibleItems = group.items.filter((item) =>
              item.permission ? hasPermission(item.permission) : true,
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                            isActive
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                              : 'text-slate-400 hover:text-white hover:bg-white/5',
                          )}
                        >
                          <svg
                            className="w-4.5 h-4.5 shrink-0"
                            style={{ width: '1.125rem', height: '1.125rem' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          >
                            {item.icon.split(' M').map((part, i) => (
                              <path
                                key={i}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={i === 0 ? part : 'M' + part}
                              />
                            ))}
                          </svg>
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
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

        {/* ── Admin profile at bottom ──────────────────────────────────────── */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-blue-400">
                {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{admin?.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">
                {admin?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
