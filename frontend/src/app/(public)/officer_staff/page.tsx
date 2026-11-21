import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  getInitials, getBadgeStyle, profileHref,
  sortBySeniority, isValidFacultyRecord,
  AVATAR_GRADIENTS, type FacultyMember,
} from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Officers & Staff — GSTU CSE',
  description: 'Officers and staff of the Department of CSE, GSTU.',
};

export default async function OfficerStaffPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-7xl">
          <FacultyLoadError title="Couldn't load staff records" />
        </div>
      </main>
    );
  }

  const officers = sortBySeniority(
    result.members.filter(m => isValidFacultyRecord(m) && m.staffType === 'officer' && m.isActive !== false),
  );
  const staff = sortBySeniority(
    result.members.filter(m => isValidFacultyRecord(m) && m.staffType === 'staff' && m.isActive !== false),
  );
  const total = officers.length + staff.length;

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">

        {total === 0 ? (
          <div className="text-center py-24 text-slate-400 font-medium">No staff or officer records found.</div>
        ) : (
          <div className="space-y-14">
            {officers.length > 0 && (
              <section>
                <SectionHeading label="Officers" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 border border-slate-200 rounded-lg overflow-hidden">
                  {officers.map((m, i) => <StaffRow key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}
            {staff.length > 0 && (
              <section>
                <SectionHeading label="Staff" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 border border-slate-200 rounded-lg overflow-hidden">
                  {staff.map((m, i) => <StaffRow key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide pb-2 border-b-2 border-green-600 inline-block">
        {label}
      </h2>
    </div>
  );
}

/** BUET-style: photo + name + designation + phone in a horizontal row */
function StaffRow({ member: m, index }: { member: FacultyMember; index: number }) {
  const initials  = getInitials(m.name);
  const href      = profileHref(m);
  const badge     = getBadgeStyle(m.designation);
  const showPhone = !!m.phone;
  const showEmail = !!(m.email?.includes('@') && !/^faculty-\d+@/i.test(m.email ?? ''));

  return (
    <Link href={href} className="group flex items-center gap-4 p-4 bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      {/* Square photo */}
      <div className="w-14 h-14 shrink-0 overflow-hidden bg-slate-100 border border-slate-200 rounded"
        style={{ borderRadius: '4px' }}>
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={m.name} className="w-full h-full object-contain object-top"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-white text-lg select-none"
            style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
          {m.title ? `${m.title} ` : ''}{m.name}
        </p>
        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1"
          style={{ background: badge.bg, color: badge.text }}>
          {m.designation}
        </span>
        {showPhone && (
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            {m.phone}
          </p>
        )}
        {showEmail && !showPhone && (
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{m.email}</p>
        )}
      </div>
    </Link>
  );
}
