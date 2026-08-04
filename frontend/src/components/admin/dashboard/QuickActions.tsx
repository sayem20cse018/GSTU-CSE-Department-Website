import Link from 'next/link';

const ACTIONS = [
  { label:'Add Faculty',   href:'/admin/faculty',   desc:'Add new faculty member',     bg:'#1d3a6e', border:'#2d5299', icon:'👨‍🏫' },
  { label:'Post Notice',   href:'/admin/notices',   desc:'Publish official notice',     bg:'#3d2900', border:'#7c5200', icon:'🔔' },
  { label:'Write News',    href:'/admin/news',      desc:'Create news article',         bg:'#0f3320', border:'#166534', icon:'📰' },
  { label:'Add Event',     href:'/admin/events',    desc:'Schedule new event',          bg:'#2d1b69', border:'#4c2fb5', icon:'📅' },
  { label:'Achievements',  href:'/admin/achievements',desc:'Add achievement',           bg:'#3b1f07', border:'#7c4a1a', icon:'🏆' },
  { label:'Manage Clubs',  href:'/admin/clubs',     desc:'Edit student clubs',          bg:'#1a1f4b', border:'#2d3580', icon:'🏫' },
  { label:'Statistics',    href:'/admin/statistics',desc:'Edit homepage numbers',       bg:'#3b0d0d', border:'#7c2020', icon:'📊' },
  { label:'Site Settings', href:'/admin/settings',  desc:'Logo, name, contact info',   bg:'#0f3320', border:'#15803d', icon:'⚙️' },
];

export default function QuickActions() {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map(a => (
          <Link key={a.label} href={a.href}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border text-center
                       hover:scale-[1.03] transition-transform"
            style={{ background: a.bg, borderColor: a.border }}>
            <span className="text-2xl" aria-hidden="true">{a.icon}</span>
            <span className="text-xs font-bold text-white">{a.label}</span>
            <span className="text-[10px] text-slate-400 hidden sm:block">{a.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
