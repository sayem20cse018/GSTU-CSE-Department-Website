import type { Metadata } from 'next';
import { AdminPageTitle } from '@/context/AdminPageContext';
import OverviewStats from '@/components/admin/dashboard/OverviewStats';
import { NAV_GROUPS } from '@/components/admin/layout/nav-items';

export const metadata: Metadata = { title: 'Dashboard — GSTU CSE Admin' };

// Group color palette — green-toned right side theme
const GROUP_COLORS: Record<string, { border: string; bg: string; text: string; icon: string }> = {
  'Overview':                 { border: 'border-green-200',   bg: 'bg-green-50',    text: 'text-green-900',   icon: 'bg-green-100' },
  'About':                    { border: 'border-emerald-200', bg: 'bg-emerald-50',  text: 'text-emerald-900', icon: 'bg-emerald-100' },
  'Academics':                { border: 'border-teal-200',    bg: 'bg-teal-50',     text: 'text-teal-900',    icon: 'bg-teal-100' },
  'Research & Publications':  { border: 'border-cyan-200',    bg: 'bg-cyan-50',     text: 'text-cyan-900',    icon: 'bg-cyan-100' },
  'Achievements':             { border: 'border-lime-200',    bg: 'bg-lime-50',     text: 'text-lime-900',    icon: 'bg-lime-100' },
  'People':                   { border: 'border-green-300',   bg: 'bg-green-50',    text: 'text-green-900',   icon: 'bg-green-200' },
  'Students':                 { border: 'border-emerald-300', bg: 'bg-emerald-50',  text: 'text-emerald-900', icon: 'bg-emerald-200' },
  'Admissions':               { border: 'border-teal-200',    bg: 'bg-teal-50',     text: 'text-teal-900',    icon: 'bg-teal-100' },
  'Content':                  { border: 'border-green-200',   bg: 'bg-green-50',    text: 'text-green-800',   icon: 'bg-green-100' },
  'Configuration':            { border: 'border-slate-200',   bg: 'bg-slate-50',    text: 'text-slate-800',   icon: 'bg-slate-100' },
};

// Map group label → emoji icon for each item (best-effort)
const ICON_MAP: Record<string, string> = {
  'Dashboard': '🏠',
  'About Department': '🏛️',
  'Programs': '🎓', 'Courses': '📚', 'Academic Calendar': '📅',
  'Syllabus': '📖', 'Laboratories': '🔬', 'Resources': '📁',
  'Research Areas': '🔭', 'Publications': '📰',
  'Achievements': '🏆',
  'Faculty & Staff': '👨‍🏫', 'Alumni': '🎓',
  'Student Resources': '📋', 'Clubs & Societies': '🤝',
  'Admission Notices': '📢',
  'Hero Slides': '🖼️', 'Notices': '🔔', 'News': '📰',
  'Events': '📅', 'Gallery': '📷', 'Forms': '📝',
  'Statistics': '📊', 'Site Settings': '⚙️',
};

export default function DashboardPage() {
  // Auto-generate from NAV_GROUPS — always in sync with sidebar
  const modules = NAV_GROUPS.filter(g => g.group !== 'Overview');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminPageTitle title="Dashboard" />

      {/* Welcome banner */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 text-white"
        style={{ background: 'linear-gradient(135deg, #052e16 0%, #0b3d1f 50%, #166534 100%)' }}>
        <div className="flex-1">
          <h2 className="text-lg font-bold">GSTU CSE — Content Management System</h2>
          <p className="text-gray-400 text-sm mt-1">
            All website content is controlled from this panel. Changes are reflected live on the public site.
          </p>
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

      {/* CMS Modules — auto-generated from NAV_GROUPS (SSOT) */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">All CMS Modules</h3>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {NAV_GROUPS.reduce((acc, g) => acc + g.items.length, 0)} modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.map(group => {
            const c = GROUP_COLORS[group.group] ?? GROUP_COLORS['Configuration'];
            return (
              <div key={group.group} className={`border-2 rounded-2xl p-4 ${c.border} ${c.bg}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${c.text}`}>
                  {group.group}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map(item => (
                    <a key={item.href} href={item.href}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-transparent
                                 hover:border-green-300 hover:shadow-sm hover:bg-green-50/50 transition-all duration-150 group">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${c.icon}`}>
                        {ICON_MAP[item.label] ?? '📄'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{item.label}</p>
                        {item.description && (
                          <p className="text-[10px] text-slate-400 truncate hidden group-hover:block">{item.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick tips */}
      <section className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h3 className="font-bold text-green-900 text-sm mb-3">💡 Single Source of Truth</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-green-800">
          <p>✅ <strong>About text & photos</strong> → Settings → About Department</p>
          <p>✅ <strong>Chairman message</strong> → Settings → About Department → Chairman tab</p>
          <p>✅ <strong>Header & Footer</strong> → Settings → Identity + Contact</p>
          <p>✅ <strong>Social links</strong> → Settings → Social</p>
          <p>✅ <strong>Homepage sections</strong> → Each respective module above</p>
          <p>✅ <strong>Login page branding</strong> → Settings → Identity (auto-synced)</p>
        </div>
      </section>
    </div>
  );
}
