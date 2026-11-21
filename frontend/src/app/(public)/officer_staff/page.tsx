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
};

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-5 pb-1.5 border-b-2 border-slate-800">
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{label}</h2>
    </div>
  );
}

export default async function OfficerStaffPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-5xl">
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

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-5xl">

        {officers.length === 0 && staff.length === 0 ? (
          <p className="text-slate-400 text-center py-24">No staff or officer records found.</p>
        ) : (
          <div className="space-y-12">

            {officers.length > 0 && (
              <section>
                <SectionLabel label="Officers" />
                {/* BUET-style: photo + name + designation + phone in table-like rows */}
                <div className="border border-slate-200 rounded divide-y divide-slate-100 overflow-hidden">
                  {officers.map((m, i) => <PersonRow key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

            {staff.length > 0 && (
              <section>
                <SectionLabel label="Staff" />
                <div className="border border-slate-200 rounded divide-y divide-slate-100 overflow-hidden">
                  {staff.map((m, i) => <PersonRow key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </main>
  );
}

function PersonRow({ member: m, index }: { member: FacultyMember; index: number }) {
  const initials  = getInitials(m.name);
  const href      = profileHref(m);
  const badge     = getBadgeStyle(m.designation);
  const showPhone = !!m.phone;
  const showEmail = !!(m.email?.includes('@') && !/^faculty-\d+@/i.test(m.email ?? ''));

  return (
    <Link href={href} className="group flex items-center gap-4 p-3.5 bg-white hover:bg-slate-50 transition-colors">
      {/* Photo */}
      <div className="w-12 h-12 shrink-0 overflow-hidden bg-slate-100 border border-slate-200"
        style={{ borderRadius: '3px' }}>
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={m.name} className="w-full h-full object-contain object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-white text-base select-none"
            style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
            {initials}
          </div>
        )}
      </div>

      {/* Name + designation */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 group-hover:text-green-700 transition-colors leading-snug">
          {m.title ? `${m.title} ` : ''}{m.name}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">{m.designation}</p>
      </div>

      {/* Phone / email */}
      <div className="shrink-0 text-right hidden sm:block">
        {showPhone && (
          <p className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            {m.phone}
          </p>
        )}
        {showEmail && (
          <p className="text-[10px] text-slate-400 mt-0.5">{m.email}</p>
        )}
      </div>
    </Link>
  );
}
