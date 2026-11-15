import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/admin/LoginForm';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

export const metadata: Metadata = {
  title: 'Admin Login — GSTU CSE',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo + name */}
        <div className="flex flex-col items-center mb-8 text-center">
          {s.deptLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.deptLogo} alt={s.deptShortName}
              className="w-16 h-16 object-contain mb-4"/>
          ) : (
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          )}
          <h1 className="text-lg font-bold text-slate-900">{s.deptShortName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{s.universityShortName} · Admin Panel</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Sign In</h2>

          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"/>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} {s.deptName}
        </p>
      </div>
    </main>
  );
}
