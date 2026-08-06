'use client';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Link from 'next/link';

export default function FormsAdminPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Forms Management" />
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Forms Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage downloadable forms for students and faculty</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Upload Forms</h2>
          <span className="text-xs text-slate-400">Forms are uploaded via Academic Resources</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link href="/admin/academics/resources?type=guideline"
            className="flex items-start gap-4 p-5 border-2 border-blue-100 bg-blue-50 rounded-2xl hover:border-blue-300 hover:shadow-md transition group">
            <span className="text-3xl">📋</span>
            <div>
              <p className="font-bold text-blue-900">General Forms</p>
              <p className="text-xs text-blue-600 mt-0.5">Leave applications, scholarship forms, admission forms</p>
              <p className="text-xs font-semibold text-blue-700 mt-2 opacity-0 group-hover:opacity-100 transition">
                Go to Academic Resources →
              </p>
            </div>
          </Link>
          <Link href="/admin/academics/resources?type=guideline"
            className="flex items-start gap-4 p-5 border-2 border-emerald-100 bg-emerald-50 rounded-2xl hover:border-emerald-300 hover:shadow-md transition group">
            <span className="text-3xl">📝</span>
            <div>
              <p className="font-bold text-emerald-900">Evaluation Forms</p>
              <p className="text-xs text-emerald-600 mt-0.5">Course evaluation, teacher evaluation forms</p>
              <p className="text-xs font-semibold text-emerald-700 mt-2 opacity-0 group-hover:opacity-100 transition">
                Go to Academic Resources →
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <strong>ℹ️ How to upload forms:</strong>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            <li>Go to <strong>Academics → Resources</strong></li>
            <li>Click <strong>Upload Resource</strong></li>
            <li>Set type as <strong>guideline</strong> and add the PDF file URL</li>
            <li>The form will appear on the public Forms page automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
