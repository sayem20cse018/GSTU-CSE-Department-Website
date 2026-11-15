'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import { AdminPageProvider } from '@/context/AdminPageContext';
import { ToastProvider }     from '@/components/admin/ui/Toast';

function ShellInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content — subtle inner shadow gives depth against the sidebar */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: '#f1f5f9' }}
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
