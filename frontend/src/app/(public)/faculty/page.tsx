import type { Metadata } from 'next';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import { isValidFacultyRecord, sortBySeniority, groupByDesignation } from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Faculty — GSTU CSE',
  description: 'Faculty members of the Department of Computer Science & Engineering, GSTU.',
};

const SECTION_ACCENT: Record<string, string> = {
  'Dean':                    '#166534',
  'Head of the Department':  '#0f766e',
  'Professor':               '#1d4ed8',
  'Associate Professor':     '#6d28d9',
  'Assistant Professor':     '#166534',
  'Senior Lecturer':         '#0f766e',
  'Lecturer':                '#b45309',
  'Adjunct Faculty':         '#475569',
};

function SectionHeading({ label, count, accent = '#166534' }: { label: string; count: number; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full shrink-0" style={{ background: accent }} />
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
      <span className="text-xs text-slate-400 font-medium">({count})</span>
      <div className="flex-1 h-px bg-slate-100" />
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

  const all = result.members;

  const deans = all.filter(m => isValidFacultyRecord(m) && m.staffType === 'dean' && m.isActive !== false);

  const shownIds = new Set(deans.map(m => m.id));

  // CRITICAL: Only show the CURRENTLY SERVING Head of Department.
  // Former chairmen (leadershipRole='former_chairman') must NEVER appear here.
  const chairmen = all.filter(
    m =>
      isValidFacultyRecord(m) &&
      m.staffType === 'chairman' &&
      m.isActive !== false &&
      m.isCurrentChairman === true &&   // ← only the current one
      m.leadershipRole !== 'former_chairman' && // ← never ex-chairmen
      !shownIds.has(m.id),
  );
  chairmen.forEach(m => shownIds.add(m.id));

  const activeFaculty = sortBySeniority(
    all.filter(m =>
      isValidFacultyRecord(m) &&
      m.staffType === 'faculty' &&
      m.employmentStatus !== 'on_leave' &&
      m.isActive !== false &&
      !shownIds.has(m.id),
    ),
  );

  const groups = groupByDesignation(activeFaculty);
  const hasAny = deans.length + chairmen.length + activeFaculty.length > 0;

  return (
    <main className="bg-white min-h-screen pt-6 pb-16">
      <div className="container-custom max-w-7xl px-6">

        {!hasAny ? (
          <p className="text-slate-400 text-center py-24">No active faculty members found.</p>
        ) : (
          <div className="space-y-14">

            {deans.length > 0 && (
              <section>
                <SectionHeading label="Dean" count={deans.length} accent={SECTION_ACCENT['Dean']} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {deans.map((m, i) => <FacultyCard key={m.id} member={m} index={i} roleLabel="Dean" />)}
                </div>
              </section>
            )}

            {chairmen.length > 0 && (
              <section>
                <SectionHeading label="Head of the Department" count={chairmen.length} accent={SECTION_ACCENT['Head of the Department']} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {chairmen.map((m, i) => <FacultyCard key={m.id} member={m} index={i} roleLabel="Head of Dept." />)}
                </div>
              </section>
            )}

            {groups.map(({ designation, members }) => (
              <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                <SectionHeading label={designation} count={members.length} accent={SECTION_ACCENT[designation] ?? '#475569'} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {members.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            ))}

          </div>
        )}
      </div>
    </main>
  );
}
