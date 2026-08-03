import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Administration — GSTU CSE' };

const ADMIN_ROLES = [
  { title: 'Chairman',               name: 'Prof. Dr. [Name]',  email: 'chairman@gstu-cse.edu', icon: '🏛️' },
  { title: 'Graduate Coordinator',   name: 'Dr. [Name]',        email: 'grad@gstu-cse.edu',     icon: '🎓' },
  { title: 'Undergraduate Advisor',  name: 'Dr. [Name]',        email: 'ugadv@gstu-cse.edu',    icon: '📚' },
  { title: 'Research Coordinator',   name: 'Dr. [Name]',        email: 'research@gstu-cse.edu', icon: '🔬' },
  { title: 'Examination Controller', name: '[Name]',             email: 'exam@gstu-cse.edu',     icon: '📝' },
  { title: 'Lab Coordinator',        name: '[Name]',             email: 'lab@gstu-cse.edu',      icon: '💻' },
];

export default function AdministrationPage() {
  return (
    <>
      <SectionHero tag="About" title="Administration"
        description="Meet the administrative team managing the department."
        breadcrumbs={[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Administration'}]}/>
      <div className="bg-white section-py"><div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_ROLES.map(r => (
            <div key={r.title} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition text-center">
              <span className="text-4xl block mb-4" aria-hidden="true">{r.icon}</span>
              <h3 className="font-bold text-slate-900">{r.name}</h3>
              <p className="text-sm font-semibold text-green-700 mt-1">{r.title}</p>
              <a href={`mailto:${r.email}`} className="text-xs text-slate-400 hover:text-green-700 transition mt-2 block">{r.email}</a>
            </div>
          ))}
        </div>
      </div></div>
    </>
  );
}
