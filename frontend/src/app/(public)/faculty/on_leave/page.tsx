import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  getInitials,
  getBadgeStyle,
  profileHref,
  groupByDesignation,
  sortBySeniority,
  isValidFacultyRecord,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Faculty on Leave — GSTU CSE',
  description: 'Faculty members of the Department of Computer Science and Engineering, GSTU who are currently on leave.',
};

export default async function FacultyOnLeavePage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <>
        <SectionHero
          tag="Faculty"
          title="Faculty on Leave"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Faculty & Staff', href: '/faculty' },
            { label: 'Faculty on Leave' },
          ]}
        />
        <main className="bg-white section-py">
          <div className="container-custom max-w-4xl">
            <FacultyLoadError title="Couldn't load faculty records" />
          </div>
        </main>
      </>
    );
  }

  const members = result.members.filter(
    (m) =>
      isValidFacultyRecord(m) &&
      m.staffType === 'faculty' &&
      m.employmentStatus === 'on_leave',
  );

  const groups = groupByDesignation(sortBySeniority(members));

  return (
    <>
      <SectionHero
        tag="Faculty"
        title="Faculty on Leave"
        description="Faculty members of the Department of CSE, GSTU who are currently on approved leave."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Faculty & Staff', href: '/faculty' },
          { label: 'Faculty on Leave' },
        ]}
      />

      <main className="bg-white section-py">
        <div className="container-custom max-w-7xl">
          {members.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-3" aria-hidden="true">✈️</span>
              <p className="text-slate-500 font-medium">No faculty members are currently on leave.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map(({ designation, members: list }) => (
                <section
                  key={designation}
                  id={designation.replace(/\s+/g, '-').toLowerCase()}
                >
                  <SectionHeading label={designation} count={list.length} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
                    {list.map((m, i) => (
                      <FacultyCard key={m.id} member={m} index={i} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
          {label}
        </h2>
        {count !== undefined && (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="mt-1.5 h-0.5 w-full" style={{ background: '#c0392b' }} />
    </div>
  );
}

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <Link href={href} className="group block">
      <article className="flex flex-col items-center text-center">
        <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-green-400 group-hover:shadow-md transition-all">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-contain object-top"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="mt-2 w-full px-0.5">
          <p className="text-xs font-bold text-slate-900 group-hover:text-green-700 transition leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <span
            className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-sm leading-none"
            style={{ background: badge.bg, color: badge.text }}
          >
            {member.designation}
          </span>
        </div>
      </article>
    </Link>
  );
}
