import type { Metadata } from 'next';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import { isValidFacultyRecord, sortBySeniority, groupByDesignation } from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Faculty on Leave — GSTU CSE',
};

function GroupLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-5 pb-1.5 border-b-2 border-slate-800">
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{label}</h2>
    </div>
  );
}

export default async function FacultyOnLeavePage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-6xl">
          <FacultyLoadError title="Couldn't load faculty records" />
        </div>
      </main>
    );
  }

  const members = sortBySeniority(
    result.members.filter(
      m => isValidFacultyRecord(m) &&
        m.staffType === 'faculty' &&
        m.employmentStatus === 'on_leave',
    ),
  );

  const groups = groupByDesignation(members);

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-6xl">

        {members.length === 0 ? (
          <p className="text-slate-400 text-center py-24">No faculty members are currently on leave.</p>
        ) : (
          <div className="space-y-12">
            {groups.map(({ designation, members: list }) => (
              <section key={designation}>
                <GroupLabel label={designation} count={list.length} />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                  {list.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
