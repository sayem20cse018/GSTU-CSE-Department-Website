'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { AdminPageProvider, useAdminPage } from '@/context/AdminPageContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pageTitle } = useAdminPage();

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminPageProvider>
      <ShellInner>{children}</ShellInner>
    </AdminPageProvider>
  );
}
