'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import { AdminPageProvider, useAdminPage } from '@/context/AdminPageContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-emerald-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)}/>
        <main className="flex-1 overflow-y-auto bg-emerald-50">
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
