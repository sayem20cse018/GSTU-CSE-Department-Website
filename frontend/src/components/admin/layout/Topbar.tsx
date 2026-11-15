'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAdminPage } from '@/context/AdminPageContext';
import { NAV_GROUPS } from './nav-items';

interface TopbarProps { onMenuClick: () => void; }

/** Breadcrumb from current pathname */
function useBreadcrumb() {
  const pathname = usePathname();
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

const ROLE_STYLE: Record<string, string> = {
  super_admin: 'bg-rose-100 text-rose-700 border-rose-200',
  admin:       'bg-blue-100 text-blue-700 border-blue-200',
  editor:      'bg-slate-100 text-slate-500 border-slate-200',
};

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

  const initial   = admin?.name?.charAt(0).toUpperCase() ?? 'A';
  const roleLabel = admin?.role?.replace(/_/g, ' ') ?? '';
  const roleStyle = ROLE_STYLE[admin?.role ?? ''] ?? ROLE_STYLE.editor;

  return (
    <header className="h-14 flex items-center gap-3 px-4 lg:px-6 shrink-0 bg-white border-b border-slate-200">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 text-sm">
        <span className="text-slate-400 text-xs hidden sm:inline">Admin</span>
        {breadcrumb && (
          <>
            <svg className="w-3 h-3 text-slate-300 hidden sm:block shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
            <span className="text-slate-400 text-xs hidden sm:inline truncate">{breadcrumb.group}</span>
            <svg className="w-3 h-3 text-slate-300 hidden sm:block shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </>
        )}
        <h1 className="text-sm font-semibold text-slate-800 truncate">{pageTitle}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* View public site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-green-700 hover:bg-green-50 border border-slate-200 hover:border-green-200 px-3 py-1.5 rounded-lg transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Site
        </Link>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Admin info */}
        {admin && (
          <div className="hidden md:flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}
            >
              {initial}
            </div>
            <div className="text-left leading-none">
              <p className="text-xs font-semibold text-slate-800">{admin.name}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-px rounded border capitalize inline-block mt-0.5 ${roleStyle}`}>
                {roleLabel}
              </span>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition"
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
