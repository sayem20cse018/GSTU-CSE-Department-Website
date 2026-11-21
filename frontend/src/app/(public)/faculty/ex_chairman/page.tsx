import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord,
  formatServicePeriod,
  profileHref,
  type FacultyMember,
} from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Ex Chairman — GSTU CSE',
};

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-5 pb-1.5 border-b-2 border-slate-800">
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{label}</h2>
    </div>
  );
}

export default async function ExChairmanPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-3xl">
          <FacultyLoadError title="Couldn't load chairman records" />
        </div>
      </main>
    );
  }

  const all = result.members.filter(
    m => isValidFacultyRecord(m) && (m.staffType === 'chairman' || m.staffType === 'dean'),
  );

  const running = all.filter(m => m.isCurrentChairman || m.leadershipRole === 'running_chairman');

  // Former — oldest first (numbered 1, 2, 3…)
  const former = all
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 9999;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 9999;
      return ay - by;
    });

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-3xl">
        <div className="space-y-12">

          {/* Running Chairman */}
          {running.length > 0 && (
            <section>
              <SectionLabel label="Head of the Department" />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {running.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

          {/* Former Chairmen — numbered list like BUET ex_heads */}
          <section>
            <SectionLabel label="Former Chairman" />
            {former.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">No former chairman records found.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {former.map((m, idx) => (
                  <ExChairRow key={m.id} member={m} serial={idx + 1} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

function ExChairRow({ member: m, serial }: { member: FacultyMember; serial: number }) {
  const href   = profileHref(m);
  const period = formatServicePeriod(m.chairmanFrom, m.chairmanTo);

  return (
    <Link href={href} className="group flex items-baseline gap-4 py-3 px-1 hover:bg-slate-50 transition-colors rounded">
      <span className="shrink-0 text-sm font-semibold text-slate-400 w-7 text-right">
        {serial}.
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
          {m.title ? `${m.title} ` : ''}{m.name}
        </span>
        {period && (
          <span className="ml-3 text-xs text-slate-500">
            Service Period: {period}
          </span>
        )}
      </div>
    </Link>
  );
}
