import type { Metadata } from 'next';
import { AdminPageTitle } from '@/context/AdminPageContext';
import OverviewStats from '@/components/admin/dashboard/OverviewStats';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import SystemInfo from '@/components/admin/dashboard/SystemInfo';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Sets the topbar title */}
      <AdminPageTitle title="Dashboard" />

      {/* Welcome banner */}
      <div className="rounded-2xl px-6 py-5"
        style={{ background:'linear-gradient(135deg,rgba(22,101,52,0.25),rgba(21,128,61,0.12))', border:'1px solid rgba(22,101,52,0.3)' }}>
        <h2 className="text-lg font-bold text-white">Welcome to GSTU CSE Admin Panel</h2>
        <p className="text-slate-400 text-sm mt-1">Manage all content, settings and configurations for the public website.</p>
      </div>

      {/* Stats grid */}
      <OverviewStats />

      {/* Lower grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions — wider */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        {/* System info — narrower */}
        <div>
          <SystemInfo />
        </div>
      </div>
    </div>
  );
}
