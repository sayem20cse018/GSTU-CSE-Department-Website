'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import { AdminPageProvider } from '@/context/AdminPageContext';
import { ToastProvider }     from '@/components/admin/ui/Toast';

/** Fetch admin accent color from settings (cached in module scope) */
let _cachedAccent = '#16a34a';
async function fetchAccent() {
  try {
    const r = await fetch('/api/public/settings', { cache: 'no-store' });
    if (!r.ok) return;
    const d = await r.json() as { data?: { adminAccentColor?: string } };
    if (d.data?.adminAccentColor) _cachedAccent = d.data.adminAccentColor;
  } catch { /* keep default */ }
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accent, setAccent] = useState(_cachedAccent);

  useEffect(() => {
    fetchAccent().then(() => setAccent(_cachedAccent));
  }, []);

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{
        background: 'var(--admin-bg, #f1f5f9)',
        '--admin-accent': accent,
      } as React.CSSProperties}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} accent={accent} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main
          className="flex-1 overflow-y-auto transition-colors duration-300"
          style={{ background: 'var(--admin-content-bg, #f1f5f9)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminPageProvider>
      <ToastProvider>
        <ShellInner>{children}</ShellInner>
      </ToastProvider>
    </AdminPageProvider>
  );
}
