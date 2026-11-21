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
  description: 'Chairmen of the Department of Computer Science & Engineering, GSTU.',
};

export default async function ExChairmanPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-4xl">
          <FacultyLoadError title="Couldn't load chairman records" />
        </div>
      </main>
    );
  }

  const all = result.members.filter(
    m => isValidFacultyRecord(m) && (m.staffType === 'chairman' || m.staffType === 'dean'),
  );

  const running = all.filter(
    m => m.isCurrentChairman || m.leadershipRole === 'running_chairman',
  );

  // Former: sort ascending (oldest first) — like BUET ex_heads numbering
  const former = all
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 9999;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 9999;
      return ay - by; // oldest first → numbered 1, 2, 3…
    });

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-3xl">

        {/* Running Chairman — card style */}
        {running.length > 0 && (
          <section className="mb-14">
            <SectionHeading label="Head of the Department" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {running.map((m, i) => (
                <FacultyCard key={m.id} member={m} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Former Chairmen — BUET-style numbered list */}
        <section>
          <SectionHeading label="Honorable Ex Chairman" />
          {former.length === 0 ? (
            <p className="text-slate-400 text-sm py-6">No former chairman records found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {former.map((m, idx) => (
                <ExChairmanRow key={m.id} member={m} serial={idx + 1} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

/** BUET-style: "1. Prof. Name — Service Period: Jan 2020 to Jan 2022" */
function ExChairmanRow({ member: m, serial }: { member: FacultyMember; serial: number }) {
  const href   = profileHref(m);
  const period = formatServicePeriod(m.chairmanFrom, m.chairmanTo);

  return (
    <Link href={href} className="group flex items-baseline gap-4 py-3.5 hover:bg-slate-50 transition-colors px-1 rounded">
      {/* Serial number */}
      <span className="shrink-0 text-sm font-bold text-slate-400 w-7 text-right leading-none">
        {serial}.
      </span>

      {/* Name + service */}
      <div className="min-w-0">
        <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
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

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide pb-2 border-b-2 border-green-600 inline-block">
        {label}
      </h2>
    </div>
  );
}
