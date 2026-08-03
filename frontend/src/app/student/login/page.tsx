import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Student Login — GSTU CSE', robots: { index: false, follow: false } };

export default function StudentLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0b3d1f 0%, #166534 50%, #0b3d1f 100%)' }}>
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' }}>
            <svg className="w-8 h-8" fill="none" stroke="#1a1a1a" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Student Portal</h1>
          <p className="text-green-200 text-sm mt-1">GSTU CSE Department</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Sign in</h2>
          <p className="text-green-100/70 text-sm mb-6">Use your student ID and password</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-100 mb-1.5">Student ID</label>
              <input type="text" placeholder="e.g. 19CSE001"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white
                           placeholder-green-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-100 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white
                           placeholder-green-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"/>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 rounded-lg px-4 py-3 text-sm text-center">
              🚧 Student portal is under development
            </div>

            <Link href="/"
              className="block w-full text-center py-2.5 text-sm font-bold rounded-xl transition"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1a1a' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
