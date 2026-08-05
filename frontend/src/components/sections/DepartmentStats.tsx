/**
 * Department Statistics — fetches from /api/statistics (admin-controlled).
 * Falls back to constants if API unavailable.
 */

interface Stat {
  _id: string;
  key: string;
  label: string;
  value: string;
  icon: string;
  sortOrder: number;
  isVisible: boolean;
}

const FALLBACK: Stat[] = [
  { _id:'1', key:'faculty_members',  label:'Faculty Members',      value:'14+',  icon:'👨‍🏫', sortOrder:1, isVisible:true },
  { _id:'2', key:'total_students',   label:'Total Students',        value:'800+', icon:'🎓',  sortOrder:2, isVisible:true },
  { _id:'3', key:'alumni',           label:'Alumni',                value:'500+', icon:'🌍',  sortOrder:3, isVisible:true },
  { _id:'4', key:'research_pubs',    label:'Research Publications', value:'50+',  icon:'📄',  sortOrder:4, isVisible:true },
  { _id:'5', key:'running_batches',  label:'Running Batches',       value:'8',    icon:'📚',  sortOrder:5, isVisible:true },
  { _id:'6', key:'labs',             label:'Laboratories',          value:'6',    icon:'🔬',  sortOrder:6, isVisible:true },
];

async function fetchStats(): Promise<Stat[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/statistics`, { next:{revalidate:3600} });
    if (!r.ok) return FALLBACK;
    const d = await r.json() as { data: Stat[] };
    return d.data?.length ? d.data : FALLBACK;
  } catch { return FALLBACK; }
}

export default async function DepartmentStats() {
  const stats = await fetchStats();

  return (
    <section aria-label="Department Statistics"
      style={{ background:'linear-gradient(135deg,#0b3d1f 0%,#0e4d2a 50%,#0b3d1f 100%)' }}>

      {/* Header */}
      <div className="container-custom pt-10 pb-2">
        <div className="flex items-center gap-4">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap text-white"
            style={{ fontFamily: 'var(--font-oswald)' }}>
            Department Statistics
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: 'rgba(255,255,255,0.25)' }} aria-hidden="true" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="container-custom py-8">
        <div className={`grid gap-0 divide-x divide-y divide-white/10 
          ${stats.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
          {stats.map((s) => (
            <div key={s._id}
              className="flex flex-col items-center py-8 px-4 text-center
                         hover:bg-white/5 transition-colors cursor-default group">
              {/* Icon */}
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform"
                aria-hidden="true">
                {s.icon}
              </span>
              {/* Value */}
              <span className="text-4xl font-black leading-none" style={{ color:'#fbbf24' }}>
                {s.value}
              </span>
              {/* Label */}
              <span className="text-sm mt-2 font-medium" style={{ color:'rgba(187,247,208,0.85)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-[3px] w-full"
        style={{ background:'linear-gradient(90deg,transparent,#fbbf24 30%,#86efac 70%,transparent)' }}
        aria-hidden="true"
      />
    </section>
  );
}
