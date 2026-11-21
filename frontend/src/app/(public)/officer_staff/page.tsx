import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  getInitials, profileHref, sortBySeniority,
  isValidFacultyRecord, AVATAR_GRADIENTS, type FacultyMember,
} from '@/lib/faculty/shared';

export const maxDuration = 25;
export const metadata: Metadata = { title: 'Officers & Staff — GSTU CSE' };

function SectionHeading({ label, count, accent = '#475569' }: { label: string; count: number; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full shrink-0" style={{ background: accent }} />
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
      <span className="text-xs text-slate-400 font-medium">({count})</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

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

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">

        {officers.length === 0 && staff.length === 0 ? (
          <p className="text-slate-400 text-center py-24">No staff or officer records found.</p>
        ) : (
          <div className="space-y-14">

            {officers.length > 0 && (
              <section>
                <SectionHeading label="Officers" count={officers.length} accent="#0f766e" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {officers.map((m, i) => <StaffCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

            {staff.length > 0 && (
              <section>
                <SectionHeading label="Staff" count={staff.length} accent="#475569" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {staff.map((m, i) => <StaffCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  );
}

function StaffCard({ member: m, index }: { member: FacultyMember; index: number }) {
  const initials   = getInitials(m.name);
  const href       = profileHref(m);
  const showEmail  = !!(m.email?.includes('@') && !/^faculty-\d+@/i.test(m.email ?? ''));
  const showPhone  = !!m.phone;
  const accent     = '#0f766e';

  return (
    <Link href={href} className="group block">
      <article
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        {/* Photo section */}
        <div className="relative p-3 pb-0">
          {/* Backdrop */}
          <div className="absolute rounded-lg"
            style={{ top: 14, left: 14, right: 6, bottom: 6, background: 'linear-gradient(145deg,#0b3d1f,#1a7a3c)', opacity: 0.14, borderRadius: '10px' }}
            aria-hidden="true" />

          {/* Photo */}
          <div className="relative z-10 overflow-hidden bg-slate-100"
            style={{ aspectRatio: '3/4', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photo} alt={m.name}
                className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.03]" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center select-none"
                style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
                <span className="text-3xl font-black text-white/90">{initials}</span>
              </div>
            )}
          </div>

          {/* Corner brackets */}
          <span className="absolute top-3 left-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true"><CornerBracket rotate={0} /></span>
          <span className="absolute top-3 right-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true"><CornerBracket rotate={90} /></span>
          <span className="absolute bottom-0 left-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true"><CornerBracket rotate={270} /></span>
          <span className="absolute bottom-0 right-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true"><CornerBracket rotate={180} /></span>
        </div>

        {/* Info */}
        <div className="px-3 pt-2.5 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider leading-none mb-1.5" style={{ color: accent }}>
            {m.designation}
          </p>
          <p className="text-[12px] font-extrabold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2 mb-1">
            {m.title ? `${m.title} ` : ''}{m.name}
          </p>
          {showPhone && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-2.5 h-2.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-[9px] text-slate-400 truncate">{m.phone}</p>
            </div>
          )}
          {showEmail && (
            <div className="flex items-center gap-1 mt-0.5">
              <svg className="w-2.5 h-2.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-[9px] text-slate-400 truncate">{m.email}</p>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ background: `linear-gradient(90deg, ${accent}, #1a7a3c)` }} aria-hidden="true" />
      </article>
    </Link>
  );
}

function CornerBracket({ rotate }: { rotate: number }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      <path d="M1 7 L1 1 L7 1" stroke="currentColor" strokeWidth="2" strokeLinecap="square" fill="none" opacity="0.85" />
    </svg>
  );
}
