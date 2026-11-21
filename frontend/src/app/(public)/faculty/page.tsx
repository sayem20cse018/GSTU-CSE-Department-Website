import type { Metadata } from 'next';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord,
  sortBySeniority,
  groupByDesignation,
} from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Faculty — GSTU CSE',
  description: 'Faculty members of the Department of Computer Science & Engineering, GSTU.',
};

/** BUET-style section heading: bold label + full-width bottom border */
function GroupLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-5 pb-1.5 border-b-2 border-slate-800">
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
        {label}
      </h2>
    </div>
  );
}

export default async function ActiveFacultyPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-6xl">
          <FacultyLoadError title="Couldn't load faculty" />
        </div>
      </main>
    );
  }

  const all = result.members;

  // ── Dean ─────────────────────────────────────────────────────────────────
  const deans = all.filter(
    m => isValidFacultyRecord(m) && m.staffType === 'dean' && m.isActive !== false,
  );

  // ── Head of Department — ALL active chairmen (not just running ones) ─────
  // Show every active chairman record here so none are "missing"
  const shownIds = new Set(deans.map(m => m.id));
  const chairmen = all.filter(
    m => isValidFacultyRecord(m) &&
      m.staffType === 'chairman' &&
      m.isActive !== false &&
      !shownIds.has(m.id),
  );
  chairmen.forEach(m => shownIds.add(m.id));

  // ── Active faculty by designation ────────────────────────────────────────
  const activeFaculty = sortBySeniority(
    all.filter(
      m => isValidFacultyRecord(m) &&
        m.staffType === 'faculty' &&
        m.employmentStatus !== 'on_leave' &&
        m.isActive !== false &&
        !shownIds.has(m.id),
    ),
  );

  const groups = groupByDesignation(activeFaculty);
  const totalShown = deans.length + chairmen.length + activeFaculty.length;

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-6xl">

        {totalShown === 0 ? (
          <p className="text-slate-400 text-center py-24">No active faculty members found.</p>
        ) : (
          <div className="space-y-12">

            {/* Dean */}
            {deans.length > 0 && (
              <section>
                <GroupLabel label="Dean" count={deans.length} />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                  {deans.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

            {/* Head of Department */}
            {chairmen.length > 0 && (
              <section>
                <GroupLabel label="Head of the Department" count={chairmen.length} />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                  {chairmen.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

            {/* Faculty grouped by designation */}
            {groups.map(({ designation, members }) => (
              <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                <GroupLabel label={designation} count={members.length} />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
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
