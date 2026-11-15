import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageTitle } from '@/context/AdminPageContext';
import OverviewStats from '@/components/admin/dashboard/OverviewStats';
import { NAV_GROUPS } from '@/components/admin/layout/nav-items';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

// Quick access — most used modules
const QUICK_ACCESS = [
  { label: 'Add Faculty',    href: '/admin/faculty',      icon: '👨‍🏫', color: '#3b82f6' },
  { label: 'Post Notice',    href: '/admin/notices',      icon: '🔔', color: '#f59e0b' },
  { label: 'Write News',     href: '/admin/news',         icon: '📰', color: '#10b981' },
  { label: 'Add Event',      href: '/admin/events',       icon: '📅', color: '#8b5cf6' },
  { label: 'Upload Photos',  href: '/admin/gallery',      icon: '📷', color: '#ec4899' },
  { label: 'Hero Slides',    href: '/admin/hero-slides',  icon: '🖼️', color: '#f97316' },
  { label: 'View Students',  href: '/admin/students',     icon: '🎒', color: '#06b6d4' },
  { label: 'Site Settings',  href: '/admin/settings',     icon: '⚙️', color: '#6b7280' },
];

// Module groups config
const MODULES = NAV_GROUPS.filter(g => g.group !== 'Overview');

const GROUP_ICON: Record<string, string> = {
  'About':                   '🏛️',
  'Academics':               '📚',
  'Research & Publications': '🔬',
  'Achievements':            '🏆',
  'People':                  '👥',
  'Students':                '🎓',
  'Admissions':              '📋',
  'Content':                 '📝',
  'Configuration':           '⚙️',
};

const ITEM_ICON: Record<string, string> = {
  'Dashboard':'🏠','About Department':'🏛️','Programs':'🎓','Courses':'📚',
  'Academic Calendar':'📅','Syllabus':'📖','Laboratories':'🔬','Resources':'📁',
  'Research Areas':'🔭','Publications':'📰','Achievements':'🏆',
  'Faculty & Staff':'👨‍🏫','Alumni':'🎓','Student Records':'🎒',
  'Clubs & Societies':'🤝','Undergraduate':'📋','Hero Slides':'🖼️',
  'Notices':'🔔','News':'📰','Events':'📅','Gallery':'📷','Forms':'📝',
  'Statistics':'📊','Nav Manager':'🗂️','Settings':'⚙️',
};

export default function DashboardPage() {
  const totalModules = NAV_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <AdminPageTitle title="Dashboard" />

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">GSTU CSE Content Management System</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            View Public Site
          </a>
        </div>

        {/* ── Live stats ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-600"/>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Live Content</h2>
          </div>
          <OverviewStats />
        </section>

        {/* ── Quick access ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-blue-500"/>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {QUICK_ACCESS.map(q => (
              <Link key={q.href} href={q.href}
                className="group flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all duration-200 text-center">
                <span className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: q.color + '15' }}>
                  {q.icon}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors leading-tight">
                  {q.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── All CMS Modules ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-violet-500"/>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">All Modules</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              {totalModules} modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {MODULES.map(group => (
              <div key={group.group}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all">
                {/* Group header */}
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <span className="text-base">{GROUP_ICON[group.group] ?? '📁'}</span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{group.group}</span>
                  <span className="ml-auto text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {group.items.length}
                  </span>
                </div>
                {/* Items */}
                <div className="p-3 grid grid-cols-2 gap-1.5">
                  {group.items.map(item => (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all group">
                      <span className="text-sm shrink-0">{ITEM_ICON[item.label] ?? '📄'}</span>
                      <span className="text-xs font-semibold truncate">{item.label}</span>
                      <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer note ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-2xl">🌐</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">All changes are live instantly</p>
            <p className="text-xs text-slate-500 mt-0.5">Every edit in this panel is reflected on the public website immediately.</p>
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
