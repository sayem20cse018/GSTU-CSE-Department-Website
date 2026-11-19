import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  getInitials,
  getBadgeStyle,
  profileHref,
  sortBySeniority,
  isValidFacultyRecord,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Officers & Staff — GSTU CSE',
  description:
    'Administrative officers and support staff of the Department of Computer Science and Engineering, GSTU.',
};

export default async function OfficerStaffPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <>
        <SectionHero
          tag="People"
          title="Officers & Staff"
          description="Administrative officers and support staff of the Department of CSE, GSTU."
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Officers & Staff' },
          ]}
        />
        <main className="bg-white section-py">
          <div className="container-custom max-w-4xl">
            <FacultyLoadError title="Couldn't load staff records" />
          </div>
        </main>
      </>
    );
  }

  const all = result.members.filter(
    (m) =>
      isValidFacultyRecord(m) &&
      (m.staffType === 'staff' || m.staffType === 'officer') &&
      m.isActive !== false,
  );

  const officers = sortBySeniority(all.filter((m) => m.staffType === 'officer'));
  const staff = sortBySeniority(all.filter((m) => m.staffType === 'staff'));

  return (
    <>
      <SectionHero
        tag="People"
        title="Officers & Staff"
        description="Administrative officers and support staff of the Department of CSE, GSTU."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Officers & Staff' },
        ]}
      />

      <main className="bg-white section-py">
        <div className="container-custom max-w-7xl">
          {all.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-3" aria-hidden="true">🏢</span>
              <p className="text-slate-500 font-medium">No staff or officer records found.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {officers.length > 0 && (
                <section>
                  <SectionHeading label="Officers" count={officers.length} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
                    {officers.map((m, i) => (
                      <StaffCard key={m.id} member={m} index={i} />
                    ))}
                  </div>
                </section>
              )}
              {staff.length > 0 && (
                <section>
                  <SectionHeading label="Staff" count={staff.length} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
                    {staff.map((m, i) => (
                      <StaffCard key={m.id} member={m} index={i} />
                    ))}
                  </div>
                </section>
              )}
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

function StaffCard({ member, index }: { member: FacultyMember; index: number }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const showEmail =
    member.email &&
    member.email.includes('@') &&
    !/^faculty-\d+@/i.test(member.email);

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
          {showEmail && (
            <p className="mt-1 text-[9px] text-slate-500 truncate w-full">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
