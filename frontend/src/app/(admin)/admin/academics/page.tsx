import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageTitle } from '@/context/AdminPageContext';

export const metadata: Metadata = { title: 'Academics — GSTU CSE Admin' };

const SECTIONS = [
  { label:'Programs',  href:'/admin/academics/programs',  icon:'🎓', desc:'Manage BSc, MSc and PhD programs', color:'from-blue-600/20 to-indigo-600/10 border-blue-600/20' },
  { label:'Courses',   href:'/admin/academics/courses',   icon:'📚', desc:'Add and edit course catalog',       color:'from-violet-600/20 to-purple-600/10 border-violet-600/20' },
  { label:'Resources', href:'/admin/academics/resources', icon:'📋', desc:'Upload routines, schedules, results', color:'from-amber-600/20 to-orange-600/10 border-amber-600/20' },
  { label:'Labs',      href:'/admin/academics/labs',      icon:'🔬', desc:'Manage laboratory information',     color:'from-emerald-600/20 to-teal-600/10 border-emerald-600/20' },
];

export default function AcademicsAdminPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Academics Management" />
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Academics</h2>
        <p className="text-slate-400 text-sm mt-1">Manage all academic content for the public website.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SECTIONS.map(s => (
          <Link key={s.label} href={s.href}
            className={`group bg-gradient-to-br border rounded-2xl p-6 hover:scale-[1.02] transition-transform text-white ${s.color}`}>
            <span className="text-3xl block mb-3" aria-hidden="true">{s.icon}</span>
            <h3 className="text-lg font-bold group-hover:text-blue-300 transition">{s.label}</h3>
            <p className="text-slate-400 text-sm mt-1">{s.desc}</p>
          </Link>))}
      </div>
    </div>
  );
}
