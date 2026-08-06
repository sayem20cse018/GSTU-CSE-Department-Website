import type { Metadata } from 'next';
import { AdminPageTitle } from '@/context/AdminPageContext';
import OverviewStats from '@/components/admin/dashboard/OverviewStats';
import QuickActions from '@/components/admin/dashboard/QuickActions';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

const SECTIONS = [
  { label: 'Hero Slides',       href: '/admin/hero-slides',   icon: '🖼️',  desc: 'Homepage slideshow' },
  { label: 'Site Settings',     href: '/admin/settings',      icon: '⚙️',  desc: 'Dept name, logo, contact, about, chairman' },
  { label: 'Notices',           href: '/admin/notices',       icon: '📢',  desc: 'Official announcements' },
  { label: 'News Articles',     href: '/admin/news',          icon: '📰',  desc: 'News & updates' },
  { label: 'Events',            href: '/admin/events',        icon: '📅',  desc: 'Upcoming & past events' },
  { label: 'Achievements',      href: '/admin/achievements',  icon: '🏆',  desc: 'Department achievements' },
  { label: 'Faculty Members',   href: '/admin/faculty',       icon: '👨‍🏫',  desc: 'Faculty profiles' },
  { label: 'Alumni',            href: '/admin/alumni',        icon: '🎓',  desc: 'Alumni directory' },
  { label: 'Gallery',           href: '/admin/gallery',       icon: '📷',  desc: 'Photo albums' },
  { label: 'Clubs',             href: '/admin/clubs',         icon: '🤝',  desc: 'Student clubs' },
  { label: 'Academic Programs', href: '/admin/academics',     icon: '📚',  desc: 'BSc/MSc/PhD programs' },
  { label: 'Statistics',        href: '/admin/statistics',    icon: '📊',  desc: 'Homepage counters' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminPageTitle title="Dashboard" />

      {/* Welcome banner */}
      <div className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
        }}>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">Welcome to GSTU CSE Admin Panel</h2>
          <p className="text-green-200/70 text-sm mt-1">
            Manage all website content from here. Every change reflects immediately on the public site.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Public Site
        </a>
      </div>

      {/* Live stats */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full inline-block" style={{ background: '#16a34a' }} aria-hidden="true"/>
          Live Statistics
        </h3>
        <OverviewStats />
      </div>

      {/* All manageable sections */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full inline-block" style={{ background: '#16a34a' }} aria-hidden="true"/>
          Manage Website Sections
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href}
              className="group flex flex-col gap-2 p-4 rounded-xl border bg-white hover:border-green-400 hover:shadow-md transition-all duration-200"
              style={{ borderColor: '#e5e7eb' }}>
              <span className="text-2xl" aria-hidden="true">{s.icon}</span>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-green-700 transition">
                  {s.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-green-600 mt-auto opacity-0 group-hover:opacity-100 transition">
                Manage
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full inline-block" style={{ background: '#16a34a' }} aria-hidden="true"/>
          Quick Actions
        </h3>
        <QuickActions />
      </div>

    </div>
  );
}
