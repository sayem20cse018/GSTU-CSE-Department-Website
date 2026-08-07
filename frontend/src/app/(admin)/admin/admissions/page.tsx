'use client';
import Link from 'next/link';
import { AdminPageTitle } from '@/context/AdminPageContext';

const SECTIONS = [
  { icon: '🎓', label: 'Undergraduate Admission',  desc: 'BSc program admission requirements & process',  href: '/admin/academics', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { icon: '📖', label: 'Graduate Admission',        desc: 'MSc, MPhil & PhD admission details',             href: '/admin/academics', color: 'bg-violet-50 border-violet-200 text-violet-800' },
  { icon: '📢', label: 'Admission Notices',         desc: 'Post admission-related notices',                 href: '/admin/notices',   color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { icon: '💰', label: 'Tuition & Fees',            desc: 'Update fee structure information',               href: '/admin/settings',  color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { icon: '📋', label: 'Requirements',              desc: 'Edit admission requirements documents',          href: '/admin/academics/resources?type=guideline', color: 'bg-rose-50 border-rose-200 text-rose-800' },
];

export default function AdmissionsAdminPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Admissions" />
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Admissions Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage all admission-related content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(s => (
          <Link key={s.label} href={s.href}
            className={`flex flex-col gap-3 p-5 rounded-2xl border-2 ${s.color} hover:shadow-md transition group`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="font-bold text-sm">{s.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.desc}</p>
            </div>
            <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition">Manage →</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-900 mb-2">ℹ️ How Admissions Work</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Admission notices</strong> → Post via Notices with category "admission"</li>
          <li>• <strong>Requirements & fees</strong> → Upload PDF via Academic Resources (type: guideline)</li>
          <li>• <strong>Program details</strong> → Edit via Academic Programs</li>
        </ul>
      </div>
    </div>
  );
}
