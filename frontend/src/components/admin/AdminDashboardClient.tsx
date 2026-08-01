'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient() {
  const { admin, logout, isLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">CSE Admin Panel</h1>
          <p className="text-slate-400 text-xs mt-0.5">Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{admin?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{admin?.role?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {['Faculty', 'News', 'Events', 'Notices'].map((item) => (
            <div key={item} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-slate-400 text-sm">{item}</p>
              <p className="text-2xl font-bold mt-1">—</p>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="font-semibold mb-1">Welcome, {admin?.name}!</h2>
          <p className="text-slate-400 text-sm">
            You are signed in as <span className="text-blue-400 font-medium">{admin?.role}</span>.
            Use the sidebar to manage content.
          </p>
        </div>
      </main>
    </div>
  );
}
