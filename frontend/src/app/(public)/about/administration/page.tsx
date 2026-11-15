import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

export const metadata: Metadata = {
  title: 'Administration — GSTU CSE',
  description: 'Meet the administrative team managing the Department of CSE.',
};

export default async function AdministrationPage() {
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  const ADMIN_ROLES = [
    { title: 'Chairman',         name: s.chairmanName || 'To be announced', email: s.chairmanEmail || s.email, icon: '🏛️' },
    { title: 'Office Contact',    name: s.deptName || 'Department Office',   email: s.email,                    icon: '📞' },
    { title: 'General Enquiry',   name: s.deptShortName || 'CSE Office',    email: s.email,                    icon: '✉️' },
  ];

  return (
    <>
      <SectionHero tag="About" title="Administration"
        description="Meet the administrative team managing the department."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Administration' }]} />
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
        <p className="text-sm text-slate-400 text-center mt-8">
          For specific coordinator roles (graduate, undergraduate, research, exam, lab), please contact the department office.
        </p>
      </div></div>
    </>
  );
}
