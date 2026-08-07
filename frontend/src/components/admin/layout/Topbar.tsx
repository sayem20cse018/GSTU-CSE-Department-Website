'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAdminPage } from '@/context/AdminPageContext';

interface TopbarProps { onMenuClick: () => void; }

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { admin, logout } = useAuth();
  const { pageTitle }     = useAdminPage();
  const router            = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="h-14 flex items-center gap-4 px-4 lg:px-6 shrink-0 bg-emerald-950 border-b border-emerald-800 text-white">

      {/* Hamburger */}
      <button onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition"
        aria-label="Open menu">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Breadcrumb / title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs text-emerald-300 hidden sm:inline">Admin</span>
        <span className="text-xs text-emerald-300 hidden sm:inline">/</span>
        <h1 className="text-sm font-semibold text-white truncate">{pageTitle}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white border border-emerald-700 hover:border-emerald-600 px-3 py-1.5 rounded-lg transition bg-emerald-900/70">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Site
        </a>

        <div className="h-5 w-px bg-slate-200 hidden sm:block"/>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-green-600">
            {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-white leading-none">{admin?.name}</p>
            <p className="text-[10px] text-emerald-200 capitalize mt-0.5">{admin?.role?.replace('_', ' ')}</p>
          </div>
        </div>

        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-red-400 border border-emerald-700 hover:border-red-400 px-3 py-1.5 rounded-lg transition bg-emerald-900/70">
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
