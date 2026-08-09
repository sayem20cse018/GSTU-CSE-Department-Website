'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAdminPage } from '@/context/AdminPageContext';
import { NAV_GROUPS } from './nav-items';

interface TopbarProps { onMenuClick: () => void; }

/** Build breadcrumb from current pathname */
function useBreadcrumb() {
  const pathname = usePathname();
  // Find matching nav item
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      const itemPath = item.href.split('?')[0];
      if (pathname === itemPath || pathname.startsWith(itemPath + '/')) {
        return { group: group.group, label: item.label };
      }
    }
  }
  return null;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { admin, logout } = useAuth();
  const { pageTitle }     = useAdminPage();
  const router            = useRouter();
  const breadcrumb        = useBreadcrumb();

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
    router.refresh();
  }

  const roleLabel = admin?.role?.replace(/_/g, ' ') ?? 'administrator';
  const initial   = admin?.name?.charAt(0).toUpperCase() ?? 'A';

  return (
    <header
      className="h-14 flex items-center gap-3 px-4 lg:px-6 shrink-0 border-b"
      style={{ background: '#0f1f0f', borderColor: '#1a2e1a' }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 text-sm">
        <span className="text-gray-600 text-xs hidden sm:inline font-medium">Admin</span>
        {breadcrumb && (
          <>
            <svg className="w-3 h-3 text-gray-700 hidden sm:block shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
            <span className="text-gray-600 text-xs hidden sm:inline truncate">{breadcrumb.group}</span>
            <svg className="w-3 h-3 text-gray-700 hidden sm:block shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </>
        )}
        <h1 className="text-sm font-semibold text-white truncate">{pageTitle}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* View site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Site
        </Link>

        <div className="h-4 w-px bg-gray-700 hidden sm:block"/>

        {/* Admin avatar + name */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-green-700 ring-2 ring-green-900">
            {initial}
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-none">{admin?.name}</p>
            <p className="text-[10px] text-gray-500 capitalize mt-0.5">{roleLabel}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-700/40 px-3 py-1.5 rounded-lg transition"
          title="Logout"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
