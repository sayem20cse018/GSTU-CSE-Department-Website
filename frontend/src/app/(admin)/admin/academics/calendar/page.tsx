'use client';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Link from 'next/link';

export default function AcademicCalendarPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Academic Calendar" />
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Academic Calendar Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload and manage academic calendars for each session</p>
      </div>

      {/* Quick action */}
      <Link href="/admin/academics/resources?type=calendar"
        className="flex items-center gap-4 p-6 bg-green-700 text-white rounded-2xl hover:bg-green-600 transition group mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shrink-0">📅</div>
        <div>
          <p className="font-bold text-lg">Manage Calendar Files</p>
          <p className="text-green-100/80 text-sm mt-0.5">Upload PDF calendars, view and delete existing ones →</p>
        </div>
        <svg className="w-6 h-6 ml-auto opacity-70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </Link>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-900 mb-2">ℹ️ How it works</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click the button above to manage calendar files</li>
          <li>• Upload a PDF using the "Upload Resource" button</li>
          <li>• Set <strong>Type = Academic Calendar</strong> and <strong>Published = On</strong></li>
          <li>• Students can download it from the public website</li>
        </ul>
      </div>
    </div>
  );
}
