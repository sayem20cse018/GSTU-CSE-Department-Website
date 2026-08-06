import Link from 'next/link';

const ACTIONS = [
  { label:'Add Faculty',    href:'/admin/faculty',      icon:'👨‍🏫', color:'#166534' },
  { label:'Post Notice',    href:'/admin/notices',      icon:'🔔', color:'#b45309' },
  { label:'Write News',     href:'/admin/news',         icon:'📰', color:'#1d4ed8' },
  { label:'Add Event',      href:'/admin/events',       icon:'📅', color:'#7c3aed' },
  { label:'Add Achievement',href:'/admin/achievements', icon:'🏆', color:'#be123c' },
  { label:'Manage Clubs',   href:'/admin/clubs',        icon:'🤝', color:'#0e7490' },
  { label:'Hero Slides',    href:'/admin/hero-slides',  icon:'🖼️', color:'#15803d' },
  { label:'Site Settings',  href:'/admin/settings',     icon:'⚙️', color:'#374151' },
];

export default function QuickActions() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map(a => (
          <Link key={a.label} href={a.href}
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200
                       bg-white hover:border-green-400 hover:bg-green-50 hover:shadow-sm
                       text-center transition-all duration-200">
            <span className="text-2xl" aria-hidden="true">{a.icon}</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-green-700 transition">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
