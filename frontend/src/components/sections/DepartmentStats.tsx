'use client';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  _id: string; key: string; label: string; value: string; icon: string;
  sortOrder: number; isVisible: boolean;
}

const FALLBACK: Stat[] = [
  { _id:'1', key:'faculty_members',  label:'Faculty Members',      value:'14+',  icon:'👨‍🏫', sortOrder:1, isVisible:true },
  { _id:'2', key:'total_students',   label:'Total Students',        value:'800+', icon:'🎓',  sortOrder:2, isVisible:true },
  { _id:'3', key:'alumni',           label:'Alumni',                value:'500+', icon:'🌍',  sortOrder:3, isVisible:true },
  { _id:'4', key:'research_pubs',    label:'Research Publications', value:'50+',  icon:'📄',  sortOrder:4, isVisible:true },
  { _id:'5', key:'running_batches',  label:'Running Batches',       value:'8',    icon:'📚',  sortOrder:5, isVisible:true },
  { _id:'6', key:'labs',             label:'Laboratories',          value:'6',    icon:'🔬',  sortOrder:6, isVisible:true },
];

/** Extract numeric part and suffix (e.g. "800+" → [800, '+']) */
function parseValue(v: string): [number, string] {
  const match = v.match(/^(\d+)(.*)$/);
  if (!match) return [0, v];
  return [parseInt(match[1], 10), match[2]];
}

/** Animated counter hook */
function useCounter(target: number, duration = 1500, active: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCard({ s, active }: { s: Stat; active: boolean }) {
  const [num, suffix] = parseValue(s.value);
  const count = useCounter(num, 1600, active);

  return (
    <div className="flex flex-col items-center py-8 px-4 text-center hover:bg-white/5 transition-colors cursor-default group">
      <span className="text-3xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">{s.icon}</span>
      <span className="text-4xl font-black leading-none tabular-nums" style={{ color:'#fbbf24' }}>
        {active ? `${count}${suffix}` : s.value}
      </span>
      <span className="text-sm mt-2 font-medium" style={{ color:'rgba(187,247,208,0.85)' }}>{s.label}</span>
    </div>
  );
}

export default function DepartmentStats() {
  const [stats,  setStats]  = useState<Stat[]>(FALLBACK);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Fetch stats from API
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${api}/statistics`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: { data: Stat[] }) => { if (d.data?.length) setStats(d.data); })
      .catch(() => {});
  }, []);

  // Trigger animation when section enters viewport
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.2 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const visible = stats.filter(s => s.isVisible);

  return (
    <section ref={ref} aria-label="Department Statistics"
      style={{ background:'linear-gradient(135deg,#0b3d1f 0%,#0e4d2a 50%,#0b3d1f 100%)' }}>

      <div className="container-custom pt-10 pb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap text-white"
            style={{ fontFamily:'var(--font-oswald)' }}>
            Department Statistics
          </h2>
          <div className="flex-1 h-[2px]" style={{ background:'rgba(255,255,255,0.25)' }} aria-hidden="true"/>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className={`grid gap-0 divide-x divide-y divide-white/10 ${
          visible.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
        }`}>
          {visible.map(s => <StatCard key={s._id} s={s} active={active}/>)}
        </div>
      </div>

      <div className="h-[3px] w-full"
        style={{ background:'linear-gradient(90deg,transparent,#fbbf24 30%,#86efac 70%,transparent)' }}
        aria-hidden="true"/>
    </section>
  );
}
