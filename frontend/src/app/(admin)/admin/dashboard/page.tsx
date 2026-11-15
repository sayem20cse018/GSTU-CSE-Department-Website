import type { Metadata } from 'next';
import { AdminPageTitle } from '@/context/AdminPageContext';
import { NAV_GROUPS } from '@/components/admin/layout/nav-items';
import OverviewStats             from '@/components/admin/dashboard/OverviewStats';
import QuickActions              from '@/components/admin/dashboard/QuickActions';
import ActivityFeed              from '@/components/admin/dashboard/ActivityFeed';
import StudentStatsWidget        from '@/components/admin/dashboard/StudentStatsWidget';
import SystemInfo                from '@/components/admin/dashboard/SystemInfo';
import WelcomeBanner             from '@/components/admin/dashboard/WelcomeBanner';
import PendingTasksWidget        from '@/components/admin/dashboard/PendingTasksWidget';
import RecentPublicationsWidget  from '@/components/admin/dashboard/RecentPublicationsWidget';
import AnalyticsWidget           from '@/components/admin/dashboard/AnalyticsWidget';
import { RecentNotices, RecentNews, UpcomingEvents } from '@/components/admin/dashboard/ContentSummary';
import RoleGate                  from '@/components/admin/dashboard/RoleGate';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

const MODULES = NAV_GROUPS.filter(g => g.group !== 'Overview');

const GROUP_ICON: Record<string, string> = {
  'About': '🏛️', 'Academics': '📚', 'Research & Publications': '🔬',
  'Achievements': '🏆', 'People': '👥', 'Students': '🎓',
  'Admissions': '📋', 'Content': '📝', 'Configuration': '⚙️',
};

const ITEM_ICON: Record<string, string> = {
  'Dashboard':'🏠','About Department':'🏛️','Programs':'🎓','Courses':'📚',
  'Academic Calendar':'📅','Syllabus':'📖','Laboratories':'🔬','Resources':'📁',
  'Research Areas':'🔭','Publications':'📰','Achievements':'🏆',
  'Faculty & Staff':'👨‍🏫','Alumni':'🎓','Student Records':'🎒',
  'Clubs & Societies':'🤝','Undergraduate':'📋','Hero Slides':'🖼️',
  'Notices':'🔔','News':'📰','Events':'📅','Gallery':'📷','Forms':'📝',
  'Statistics':'📊','Nav Manager':'🗂️','Settings':'⚙️','Admin Users':'👥',
};

/** Consistent section heading */
function Heading({ accent, title, badge }: { accent: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className={`w-1 h-5 rounded-full ${accent}`} aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h2>
      </div>
      {badge && (
        <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full font-medium">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const totalModules = NAV_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      <div className="p-6 max-w-7xl mx-auto space-y-7">
        <AdminPageTitle title="Dashboard" />

        {/* ── Welcome banner ───────────────────────────────────────────── */}
        <WelcomeBanner />

        {/* ── Live stats ───────────────────────────────────────────────── */}
        <section>
          <Heading accent="bg-green-600" title="Live Content Stats" />
          <OverviewStats />
        </section>

        {/* ── Pending tasks row ────────────────────────────────────────── */}
        <section>
          <Heading accent="bg-orange-500" title="Pending Tasks" />
          <PendingTasksWidget />
        </section>

        {/* ── Quick actions ────────────────────────────────────────────── */}
        <section>
          <Heading accent="bg-blue-500" title="Quick Actions" />
          <QuickActions />
        </section>

        {/* ── Activity feed + Student stats (admin+ only) ──────────────── */}
        <RoleGate minRole="admin">
          <section>
            <Heading accent="bg-violet-500" title="Activity & Students" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ActivityFeed />
              <StudentStatsWidget />
            </div>
          </section>
        </RoleGate>

        {/* ── Content summary ──────────────────────────────────────────── */}
        <section>
          <Heading accent="bg-amber-500" title="Content Summary" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RecentNotices />
            <RecentNews />
            <UpcomingEvents />
          </div>
        </section>

        {/* ── Latest publications ──────────────────────────────────────── */}
        <section>
          <Heading accent="bg-blue-500" title="Latest Research Publications" />
          <div className="max-w-2xl">
            <RecentPublicationsWidget />
          </div>
        </section>

        {/* ── Analytics (shows setup prompt if Umami not configured) ──── */}
        <RoleGate minRole="admin">
          <section>
            <Heading accent="bg-blue-600" title="Visitor Analytics" />
            <AnalyticsWidget />
          </section>
        </RoleGate>

        {/* ── All modules grid ─────────────────────────────────────────── */}
        <section>
          <Heading accent="bg-indigo-500" title="All CMS Modules" badge={`${totalModules} modules`} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MODULES.map(group => (
              <div key={group.group}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                  <span className="text-base" aria-hidden="true">{GROUP_ICON[group.group] ?? '📁'}</span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{group.group}</span>
                  <span className="ml-auto text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {group.items.length}
                  </span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-1">
                  {group.items.map(item => (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors group">
                      <span className="text-sm shrink-0" aria-hidden="true">{ITEM_ICON[item.label] ?? '📄'}</span>
                      <span className="text-xs font-semibold truncate">{item.label}</span>
                      <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity shrink-0 text-slate-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── System health (admin+ only) ──────────────────────────────── */}
        <RoleGate minRole="admin">
          <section>
            <Heading accent="bg-green-500" title="System Health" />
            <div className="max-w-sm">
              <SystemInfo />
            </div>
          </section>
        </RoleGate>

        {/* ── Footer note ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl">
          <span className="text-2xl" aria-hidden="true">🌐</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">All changes are live instantly</p>
            <p className="text-xs text-slate-500 mt-0.5">Every edit is reflected on the public website immediately.</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="ml-auto shrink-0 text-xs font-bold text-green-700 hover:text-green-800 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all">
            Preview ↗
          </a>
        </div>
      </div>
    </div>
  );
}
