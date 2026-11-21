import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord,
  sortBySeniority,
  groupByDesignation,
} from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Faculty on Leave — GSTU CSE',
  description: 'Faculty members of the Department of CSE, GSTU who are currently on leave.',
};

function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-5 rounded-full shrink-0" style={{ background: '#d97706' }} aria-hidden="true" />
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
        {count !== undefined && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: '#d97706', borderColor: '#d9770640', background: '#d9770610' }}>
            {count}
          </span>
        )}
      </div>
      <div className="h-px w-full bg-slate-100" />
    </div>
  );
}

export default async function FacultyOnLeavePage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-7xl">
          <PageHeader />
          <FacultyLoadError title="Couldn't load faculty records" />
        </div>
      </main>
    );
  }

  // Strictly: staffType=faculty AND employmentStatus=on_leave
  const members = sortBySeniority(
    result.members.filter(
      m =>
        isValidFacultyRecord(m) &&
        m.staffType === 'faculty' &&
        m.employmentStatus === 'on_leave',
    ),
  );

  const groups = groupByDesignation(members);

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">
        <PageHeader count={members.length} />

        {members.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4" aria-hidden="true">✈️</span>
            <p className="text-slate-500 font-medium">No faculty members are currently on leave.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map(({ designation, members: list }) => (
              <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                <SectionHeading label={designation} count={list.length} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {list.map((m, i) => (
                    <FacultyCard key={m.id} member={m} index={i} ribbon="On Leave" ribbonColor="#d97706" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function PageHeader({ count }: { count?: number }) {
  return (
    <div className="mb-10 pb-5 border-b border-slate-100">
      <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
        <Link href="/" className="hover:text-green-700 transition">Home</Link>
        <span>/</span>
        <Link href="/faculty" className="hover:text-green-700 transition">Active Faculty</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">On Leave</span>
      </nav>
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Faculty on Leave</h1>
        {count !== undefined && count > 0 && (
          <span className="text-sm font-semibold text-slate-400">{count} members</span>
        )}
      </div>
      <p className="text-sm text-slate-500 mt-1">
        Faculty members currently on approved leave — Department of CSE, GSTU
      </p>
    </div>
  );
}
