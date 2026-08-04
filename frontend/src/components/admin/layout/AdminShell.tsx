'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import { AdminPageProvider, useAdminPage } from '@/context/AdminPageContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060f1e' }}>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)}/>
        <main className="flex-1 overflow-y-auto" style={{ background: '#08152a' }}>
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
