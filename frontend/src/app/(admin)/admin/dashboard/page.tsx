import type { Metadata } from 'next';
import { AdminPageTitle } from '@/context/AdminPageContext';
import OverviewStats from '@/components/admin/dashboard/OverviewStats';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

const CMS_MODULES = [
  {
    group: 'About',
    color: 'border-blue-200 bg-blue-50',
    textColor: 'text-blue-900',
    iconBg: 'bg-blue-100',
    items: [
      { label: 'About Dept',       href: '/admin/about',                         icon: '🏛️' },
      { label: "Chairman's Msg",   href: '/admin/settings?tab=chairman',          icon: '👤' },
    ],
  },
  {
    group: 'Academics',
    color: 'border-violet-200 bg-violet-50',
    textColor: 'text-violet-900',
    iconBg: 'bg-violet-100',
    items: [
      { label: 'Programs',        href: '/admin/academics',                       icon: '🎓' },
      { label: 'Courses',         href: '/admin/academics/courses',               icon: '📚' },
      { label: 'Resources',       href: '/admin/academics/resources',             icon: '📁' },
      { label: 'Labs',            href: '/admin/academics/labs',                  icon: '🔬' },
    ],
  },
  {
    group: 'People',
    color: 'border-emerald-200 bg-emerald-50',
    textColor: 'text-emerald-900',
    iconBg: 'bg-emerald-100',
    items: [
      { label: 'Faculty & Staff', href: '/admin/faculty',                         icon: '👨‍🏫' },
      { label: 'Alumni',          href: '/admin/alumni',                          icon: '🎓' },
    ],
  },
  {
    group: 'Students',
    color: 'border-amber-200 bg-amber-50',
    textColor: 'text-amber-900',
    iconBg: 'bg-amber-100',
    items: [
      { label: 'Resources',       href: '/admin/students',                        icon: '📋' },
      { label: 'Clubs',           href: '/admin/clubs',                           icon: '🤝' },
    ],
  },
  {
    group: 'Content',
    color: 'border-rose-200 bg-rose-50',
    textColor: 'text-rose-900',
    iconBg: 'bg-rose-100',
    items: [
      { label: 'Hero Slides',     href: '/admin/hero-slides',                     icon: '🖼️' },
      { label: 'Notices',         href: '/admin/notices',                         icon: '📢' },
      { label: 'News',            href: '/admin/news',                            icon: '📰' },
      { label: 'Events',          href: '/admin/events',                          icon: '📅' },
      { label: 'Achievements',    href: '/admin/achievements',                    icon: '🏆' },
      { label: 'Gallery',         href: '/admin/gallery',                         icon: '📷' },
      { label: 'Forms',           href: '/admin/forms',                           icon: '📝' },
    ],
  },
  {
    group: 'Settings',
    color: 'border-slate-200 bg-slate-50',
    textColor: 'text-slate-900',
    iconBg: 'bg-slate-100',
    items: [
      { label: 'Statistics',      href: '/admin/statistics',                      icon: '📊' },
      { label: 'Site Settings',   href: '/admin/settings',                        icon: '⚙️' },
    ],
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminPageTitle title="Dashboard" />

      {/* Welcome */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="flex-1">
          <h2 className="text-lg font-bold">GSTU CSE — Content Management System</h2>
          <p className="text-gray-400 text-sm mt-1">All website content is controlled from this panel. Select a module to start managing.</p>
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
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">All CMS Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CMS_MODULES.map(group => (
            <div key={group.group} className={`border-2 rounded-2xl p-4 ${group.color}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${group.textColor}`}>
                {group.group}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map(item => (
                  <a key={item.label} href={item.href}
                    className={`flex items-center gap-2 p-2.5 rounded-xl bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition group`}>
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-base shrink-0 ${group.iconBg}`}>
                      {item.icon}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 truncate">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
