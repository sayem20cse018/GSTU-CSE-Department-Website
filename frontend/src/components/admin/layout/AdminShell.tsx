'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import { AdminPageProvider, useAdminPage } from '@/context/AdminPageContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0fdf4' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)}/>
        {/* Right side: light green tinted background */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 30%, #f0fdf4 100%)' }}>
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
