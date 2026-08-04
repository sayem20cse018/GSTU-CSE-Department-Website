'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAdminPage } from '@/context/AdminPageContext';

interface TopbarProps {
  onMenuClick: () => void;
}

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
    <header className="h-[3.5rem] flex items-center gap-4 px-4 lg:px-6 shrink-0"
      style={{
        background: '#0d1f38',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
      }}>

      {/* Hamburger */}
      <button onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        aria-label="Open sidebar">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-white truncate">{pageTitle}</h1>
        <p className="text-[10px] text-slate-500 hidden sm:block">GSTU CSE Admin Panel</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* View site */}
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white
                     border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Site
        </a>

        <div className="w-px h-5 bg-white/10 hidden sm:block" aria-hidden="true"/>

        {/* Admin info */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
            {admin?.name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-semibold text-white leading-tight">{admin?.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{admin?.role?.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400
                     border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition">
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
