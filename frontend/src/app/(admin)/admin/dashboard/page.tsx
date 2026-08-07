import type { Metadata } from 'next';
import { AdminPageTitle } from '@/context/AdminPageContext';
import OverviewStats from '@/components/admin/dashboard/OverviewStats';
import { NAV_GROUPS } from '@/components/admin/layout/nav-items';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

function getCardColor(group: string) {
  switch (group) {
    case 'About': return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    case 'Academics': return 'border-violet-200 bg-violet-50 text-violet-900';
    case 'Research & Publications': return 'border-cyan-200 bg-cyan-50 text-cyan-900';
    case 'Achievements': return 'border-rose-200 bg-rose-50 text-rose-900';
    case 'People': return 'border-sky-200 bg-sky-50 text-sky-900';
    case 'Students': return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'Admissions': return 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900';
    case 'Content': return 'border-slate-200 bg-slate-50 text-slate-900';
    case 'Configuration': return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    default: return 'border-slate-200 bg-slate-50 text-slate-900';
  }
}

const DASHBOARD_LINKS = NAV_GROUPS.flatMap(group =>
  group.items.map(item => ({ ...item, group: group.group })),
);

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminPageTitle title="Dashboard" />

      {/* Welcome */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-emerald-900 to-emerald-700 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex-1">
          <h2 className="text-lg font-bold">GSTU CSE — Content Management System</h2>
          <p className="text-emerald-200 text-sm mt-1">All website content is controlled from this panel. Use the cards below to jump into any admin module.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition">
          View Public Site ↗
        </a>
      </div>

      {/* Live counts */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Content Counts</h3>
        <OverviewStats />
      </section>

      {/* CMS Modules */}
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">All Admin Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DASHBOARD_LINKS.map(link => (
            <a key={link.href}
              href={link.href}
              className="group block rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl">{link.icon || '•'}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${getCardColor(link.group)}`}>
                  {link.group}
                </span>
              </div>
              <div className="mt-5">
                <p className="text-base font-semibold text-slate-900">{link.label}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{link.description ?? 'Manage this section of the website.'}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
