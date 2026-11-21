import type { Metadata } from 'next';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import { isValidFacultyRecord, sortBySeniority, groupByDesignation } from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = { title: 'Faculty on Leave — GSTU CSE' };

function SectionHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full shrink-0" style={{ background: '#d97706' }} />
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
      <span className="text-xs text-slate-400 font-medium">({count})</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

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
    result.members.filter(m =>
      isValidFacultyRecord(m) && m.staffType === 'faculty' && m.employmentStatus === 'on_leave',
    ),
  );

  const groups = groupByDesignation(members);

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">
        {members.length === 0 ? (
          <p className="text-slate-400 text-center py-24">No faculty members are currently on leave.</p>
        ) : (
          <div className="space-y-14">
            {groups.map(({ designation, members: list }) => (
              <section key={designation}>
                <SectionHeading label={designation} count={list.length} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {list.map((m, i) => (
                    <FacultyCard key={m.id} member={m} index={i} badge="On Leave" badgeColor="#d97706" />
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
