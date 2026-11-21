import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord,
  sortBySeniority,
  groupByDesignation,
  type FacultyMember,
} from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Active Faculty — GSTU CSE',
  description: 'Active faculty members of the Department of Computer Science & Engineering, GSTU.',
};

// Display order: Dean → Chairman → then by designation seniority
const DESIGNATION_PRIORITY = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Adjunct Faculty',
];

function SectionHeading({ label, count, accent = '#166534' }: {
  label: string; count?: number; accent?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-5 rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
        {count !== undefined && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
            {count}
          </span>
        )}
      </div>
      <div className="h-px w-full bg-slate-100" />
    </div>
  );
}

export default async function ActiveFacultyPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-7xl">
          <PageHeader />
          <FacultyLoadError title="Couldn't load faculty" />
        </div>
      </main>
    );
  }

  // ── Partition the full list ───────────────────────────────────────────────

  // Dean — staffType === 'dean'
  const deans = result.members.filter(
    m => isValidFacultyRecord(m) && m.staffType === 'dean' && m.isActive !== false,
  );

  // Current Chairman — staffType === 'chairman' AND (isCurrentChairman OR leadershipRole === 'running_chairman')
  const currentChairmen = result.members.filter(
    m => isValidFacultyRecord(m) &&
      (m.staffType === 'chairman' || m.staffType === 'dean') &&
      (m.isCurrentChairman || m.leadershipRole === 'running_chairman') &&
      m.isActive !== false,
  );

  // Collect IDs already shown so we don't repeat them
  const shownIds = new Set([
    ...deans.map(m => m.id),
    ...currentChairmen.map(m => m.id),
  ]);

  // Active faculty — staffType === 'faculty', not on_leave, not already shown
  const activeFaculty = sortBySeniority(
    result.members.filter(
      m =>
        isValidFacultyRecord(m) &&
        m.staffType === 'faculty' &&
        m.employmentStatus !== 'on_leave' &&
        m.isActive !== false &&
        !shownIds.has(m.id),
    ),
  );

  const groups = groupByDesignation(activeFaculty);

  // Count totals for the page header
  const totalActive = deans.length + currentChairmen.length + activeFaculty.length;

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">
        <PageHeader count={totalActive} />

        {totalActive === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4" aria-hidden="true">👨‍🏫</span>
            <p className="text-slate-500 font-medium">No active faculty members found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. Dean */}
            {deans.length > 0 && (
              <section>
                <SectionHeading label="Dean" count={deans.length} accent="#166534" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {deans.map((m, i) => (
                    <FacultyCard key={m.id} member={m} index={i} ribbon="Dean" ribbonColor="#166534" />
                  ))}
                </div>
              </section>
            )}

            {/* 2. Current Chairman */}
            {currentChairmen.length > 0 && (
              <section>
                <SectionHeading label="Head of the Department" count={currentChairmen.length} accent="#0f766e" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {currentChairmen.map((m, i) => (
                    <FacultyCard key={m.id} member={m} index={i} ribbon="Chairman" ribbonColor="#0f766e" />
                  ))}
                </div>
              </section>
            )}

            {/* 3. Faculty grouped by designation */}
            {groups.map(({ designation, members }) => {
              const accent = {
                'Professor':           '#1d4ed8',
                'Associate Professor': '#6d28d9',
                'Assistant Professor': '#166534',
                'Senior Lecturer':     '#0f766e',
                'Lecturer':            '#b45309',
                'Adjunct Faculty':     '#475569',
              }[designation] ?? '#166534';

              return (
                <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                  <SectionHeading label={designation} count={members.length} accent={accent} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {members.map((m, i) => (
                      <FacultyCard key={m.id} member={m} index={i} />
                    ))}
                  </div>
                </section>
              );
            })}
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
        <span className="text-slate-600 font-medium">Active Faculty</span>
      </nav>
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Faculty</h1>
        {count !== undefined && count > 0 && (
          <span className="text-sm font-semibold text-slate-400">{count} members</span>
        )}
      </div>
      <p className="text-sm text-slate-500 mt-1">
        Department of Computer Science &amp; Engineering, GSTU
      </p>
    </div>
  );
}
