'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export default function Topbar({ onMenuClick, pageTitle }: TopbarProps) {
  const { admin, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="h-16 bg-slate-900 border-b border-white/10 flex items-center gap-4 px-4 lg:px-6 shrink-0">
      {/* ── Hamburger (mobile only) ────────────────────────────────────── */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        aria-label="Open sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── Page title ────────────────────────────────────────────────── */}
      <h1 className="text-sm font-semibold text-white flex-1 truncate">{pageTitle}</h1>

      {/* ── Right actions ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="View public site"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Site
        </a>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10 hidden sm:block" aria-hidden="true" />

        {/* Admin avatar + logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-white leading-tight">{admin?.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{admin?.role?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
