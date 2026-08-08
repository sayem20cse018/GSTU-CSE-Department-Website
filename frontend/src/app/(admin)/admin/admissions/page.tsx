'use client';
import Link from 'next/link';
import { AdminPageTitle } from '@/context/AdminPageContext';

const SECTIONS = [
  { icon: '🎓', label: 'Programs (UG + PG)',  desc: 'Edit BSc, MSc, MPhil, PhD program details', href: '/admin/admissions/undergraduate', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { icon: '📢', label: 'Admission Notices',   desc: 'Post and manage all admission notices',        href: '/admin/notices',                            color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { icon: '📋', label: 'Requirements / Fees', desc: 'Upload requirements & fee structure PDFs',     href: '/admin/academics/resources?type=guideline',  color: 'bg-rose-50 border-rose-200 text-rose-800' },
  { icon: '📅', label: 'Academic Calendar',   desc: 'Upload academic session calendar PDF',         href: '/admin/academics/calendar',                  color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
];

export default function AdmissionsAdminPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Admissions" />
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Admissions Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage all admission-related content from one place</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(s => (
          <Link key={s.label} href={s.href}
            className={`flex flex-col gap-3 p-5 rounded-2xl border-2 ${s.color} hover:shadow-md transition-all group`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="font-bold text-sm">{s.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.desc}</p>
            </div>
            <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition">Manage →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
