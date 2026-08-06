'use client';
import Link from 'next/link';
import { AdminPageTitle } from '@/context/AdminPageContext';

const SECTIONS = [
  { icon: '📅', label: 'Class Routine',      desc: 'Upload class schedule PDF/image',         href: '/admin/academics/resources?type=routine',       color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { icon: '📝', label: 'Exam Routine',        desc: 'Upload exam schedule',                    href: '/admin/academics/resources?type=exam_schedule',  color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { icon: '📊', label: 'Results',             desc: 'Publish semester results',                href: '/admin/academics/resources?type=result',         color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { icon: '📆', label: 'Academic Calendar',   desc: 'Upload academic year calendar',           href: '/admin/academics/resources?type=calendar',       color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { icon: '🎓', label: 'Scholarships',        desc: 'Manage scholarship information',          href: '/admin/notices?cat=scholarship',                  color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { icon: '🤝', label: 'Clubs & Societies',   desc: 'Manage student clubs',                    href: '/admin/clubs',                                    color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { icon: '💼', label: 'Internship',          desc: 'Manage internship information',           href: '/admin/notices?cat=general',                     color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { icon: '📚', label: 'Thesis & Projects',   desc: 'Manage thesis guidelines and templates',  href: '/admin/academics/resources?type=guideline',      color: 'bg-orange-50 border-orange-200 text-orange-700' },
];

export default function StudentsAdminPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Student Resources" />
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Student Resources Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage all student-related content from one place</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SECTIONS.map(s => (
          <Link key={s.label} href={s.href}
            className={`flex flex-col gap-3 p-5 rounded-2xl border-2 ${s.color} hover:shadow-md transition-all duration-200 group`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="font-bold text-sm">{s.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-auto opacity-0 group-hover:opacity-100 transition">
              Manage →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-900 mb-2">ℹ️ How Student Resources Work</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Class/Exam Routine</strong> → Go to Academic Resources and upload a PDF or image with type set to "routine" or "exam_schedule"</li>
          <li>• <strong>Results</strong> → Upload a PDF with type "result" — students can download from the website</li>
          <li>• <strong>Scholarships</strong> → Post a notice with category "scholarship"</li>
          <li>• <strong>Clubs</strong> → Manage directly from Clubs section with full add/edit/delete</li>
        </ul>
      </div>
    </div>
  );
}
