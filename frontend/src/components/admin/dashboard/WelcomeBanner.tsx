'use client';
import { useAuth } from '@/context/AuthContext';

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  editor:      'Editor',
};

const ROLE_COLOR: Record<string, string> = {
  super_admin: 'bg-rose-100 text-rose-700 border-rose-200',
  admin:       'bg-blue-100 text-blue-700 border-blue-200',
  editor:      'bg-slate-100 text-slate-600 border-slate-200',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeBanner() {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-3.5 bg-slate-100 rounded w-1/2" />
      </div>
    );
  }

  if (!admin) return null;

  const roleLabel = ROLE_LABEL[admin.role] ?? admin.role;
  const roleStyle = ROLE_COLOR[admin.role] ?? ROLE_COLOR.editor;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-white/70 text-sm font-medium">{greeting()},</p>
        <h2 className="text-white text-xl font-bold mt-0.5">{admin.name}</h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${roleStyle}`}>
            {roleLabel}
          </span>
          {admin.lastLoginAt && (
            <span className="text-white/60 text-[11px]">
              Last login: {new Date(admin.lastLoginAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl transition-colors border border-white/20"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Site
        </a>
        <a
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl transition-colors border border-white/20"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Settings
        </a>
      </div>
    </div>
  );
}
