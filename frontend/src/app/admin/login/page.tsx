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
    <main className="min-h-screen flex" style={{ background: '#f8fafc' }}>

      {/* ── Left panel — branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #052e16 0%, #064e24 50%, #065f30 100%)' }}>

        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden="true">
          <svg className="w-full h-full">
            <defs><pattern id="lg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#lg-grid)"/>
          </svg>
        </div>

        {/* Logo + dept */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              {s.deptLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.deptLogo} alt={s.deptShortName} className="w-full h-full object-contain p-1"/>
              ) : (
                <svg viewBox="0 0 80 80" className="w-10 h-10" fill="none">
                  <path d="M40 6 L11 22 L11 44 C11 62 25 72 40 76 C55 72 69 62 69 44 L69 22 Z" fill="url(#lg-shield)"/>
                  <defs><linearGradient id="lg-shield" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#16a34a"/><stop offset="100%" stopColor="#052e16"/>
                  </linearGradient></defs>
                  <line x1="24" y1="34" x2="56" y2="34" stroke="white" strokeWidth="2"/>
                  <line x1="24" y1="43" x2="56" y2="43" stroke="white" strokeWidth="2"/>
                  <line x1="32" y1="34" x2="32" y2="52" stroke="#4ade80" strokeWidth="1.5"/>
                  <line x1="48" y1="34" x2="48" y2="52" stroke="#4ade80" strokeWidth="1.5"/>
                  <path d="M29 22 L40 14 L51 22" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div>
              <p className="text-green-300/70 text-xs font-semibold uppercase tracking-widest">Content Management</p>
              <p className="text-white font-bold text-sm mt-0.5">{s.deptShortName}</p>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {s.deptName}
          </h2>
          <p className="mt-2 text-green-300/70 text-sm">{s.universityName}</p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: '📋', text: 'Manage all website content' },
            { icon: '👥', text: 'Faculty, staff & alumni records' },
            { icon: '📢', text: 'Publish notices, news & events' },
            { icon: '🎓', text: 'Academic programs & resources' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3 text-sm text-green-100/80">
              <span className="text-base">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

        <p className="relative z-10 text-xs text-green-300/40">
          © {new Date().getFullYear()} {s.universityShortName} — Admin Panel
        </p>
      </div>

      {/* ── Right panel — login form ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center">
              {s.deptLogo
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-1"/>
                : <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
              }
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{s.deptName}</p>
              <p className="text-xs text-slate-500">{s.universityShortName}</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-7">Sign in to the admin panel to manage website content</p>

            <Suspense fallback={
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"/>
              </div>
            }>
              <LoginForm />
            </Suspense>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            © {new Date().getFullYear()} {s.deptName}, {s.universityName}
          </p>
        </div>
      </div>
    </main>
  );
}
