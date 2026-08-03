import Link from 'next/link';

const ACTIONS = [
  {
    label: 'Add Faculty',
    href: '/admin/faculty?action=new',
    description: 'Add a new faculty member',
    color: 'bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20',
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    label: 'Post Notice',
    href: '/admin/notices?action=new',
    description: 'Publish a new notice',
    color: 'bg-amber-600/10 border-amber-600/20 hover:bg-amber-600/20',
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Write News',
    href: '/admin/news?action=new',
    description: 'Create a news article',
    color: 'bg-emerald-600/10 border-emerald-600/20 hover:bg-emerald-600/20',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: 'Add Event',
    href: '/admin/events?action=new',
    description: 'Schedule a new event',
    color: 'bg-violet-600/10 border-violet-600/20 hover:bg-violet-600/20',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${action.color}`}
          >
            <div className="shrink-0">{action.icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white leading-tight">{action.label}</p>
              <p className="text-xs text-slate-400 truncate">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
