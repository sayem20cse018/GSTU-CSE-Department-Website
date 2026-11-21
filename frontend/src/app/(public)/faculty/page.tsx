import type { Metadata } from 'next';
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
  title: 'Faculty — GSTU CSE',
  description: 'Faculty members of the Department of Computer Science & Engineering, GSTU.',
};

const DESIG_ACCENT: Record<string, string> = {
  'Professor':           '#1d4ed8',
  'Associate Professor': '#6d28d9',
  'Assistant Professor': '#166534',
  'Senior Lecturer':     '#0f766e',
  'Lecturer':            '#b45309',
  'Adjunct Faculty':     '#475569',
};

function GroupHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-base font-extrabold uppercase tracking-wide" style={{ color: accent }}>
        {label}
      </h2>
      <div className="flex-1 h-px" style={{ background: accent + '30' }} />
    </div>
  );
}

export default async function ActiveFacultyPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-7xl">
          <FacultyLoadError title="Couldn't load faculty" />
        </div>
      </main>
    );
  }

  // Dean
  const deans = result.members.filter(
    m => isValidFacultyRecord(m) && m.staffType === 'dean' && m.isActive !== false,
  );

  // Current Chairman / Head
  const shownIds = new Set(deans.map(m => m.id));
  const currentChairmen = result.members.filter(
    m => isValidFacultyRecord(m) &&
      (m.staffType === 'chairman' || m.staffType === 'dean') &&
      (m.isCurrentChairman || m.leadershipRole === 'running_chairman') &&
      m.isActive !== false &&
      !shownIds.has(m.id),
  );
  currentChairmen.forEach(m => shownIds.add(m.id));

  // Active faculty
  const activeFaculty = sortBySeniority(
    result.members.filter(
      m => isValidFacultyRecord(m) &&
        m.staffType === 'faculty' &&
        m.employmentStatus !== 'on_leave' &&
        m.isActive !== false &&
        !shownIds.has(m.id),
    ),
  );

  const groups = groupByDesignation(activeFaculty);
  const hasAny = deans.length + currentChairmen.length + activeFaculty.length > 0;

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">

        {!hasAny ? (
          <div className="text-center py-24 text-slate-400 font-medium">
            No active faculty members found.
          </div>
        ) : (
          <div className="space-y-14">

            {/* Dean */}
            {deans.length > 0 && (
              <section>
                <GroupHeading label="Dean" accent="#166534" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                  {deans.map((m, i) => <FacultyCard key={m.id} member={m} index={i} ribbon="Dean" ribbonColor="#166534" />)}
                </div>
              </section>
            )}

            {/* Head of Department */}
            {currentChairmen.length > 0 && (
              <section>
                <GroupHeading label="Head of the Department" accent="#0f766e" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                  {currentChairmen.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

            {/* Faculty by designation */}
            {groups.map(({ designation, members }) => {
              const accent = DESIG_ACCENT[designation] ?? '#475569';
              return (
                <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                  <GroupHeading label={designation} accent={accent} />
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                    {members.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
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
