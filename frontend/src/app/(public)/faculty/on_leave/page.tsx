import type { Metadata } from 'next';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import { isValidFacultyRecord, sortBySeniority, groupByDesignation } from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Faculty on Leave — GSTU CSE',
  description: 'Faculty members of the Department of CSE, GSTU currently on leave.',
};

export default async function FacultyOnLeavePage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-7xl">
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
      <div className="container-custom max-w-7xl">

        {members.length === 0 ? (
          <div className="text-center py-24 text-slate-400 font-medium">
            No faculty members are currently on leave.
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map(({ designation, members: list }) => (
              <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-800">{designation}</h2>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400">{list.length}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
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
