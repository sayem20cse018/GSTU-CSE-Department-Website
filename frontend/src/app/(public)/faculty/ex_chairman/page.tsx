import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord, formatServicePeriod,
  getInitials, getBadgeStyle, profileHref,
  AVATAR_GRADIENTS, type FacultyMember,
} from '@/lib/faculty/shared';

export const metadata: Metadata = { title: 'Ex Chairman — GSTU CSE' };

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

  // ONLY former chairmen — running chairman stays on Active Faculty page
  const former = result.members
    .filter(m =>
      isValidFacultyRecord(m) &&
      m.staffType === 'chairman' &&
      !m.isCurrentChairman &&
      m.leadershipRole === 'former_chairman',
    )
    .sort((a, b) => {
      // oldest first → serial 1, 2, 3…
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getTime() : 999999999999;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getTime() : 999999999999;
      return ay - by;
    });

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-5xl">

        {/* Section heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 rounded-full shrink-0" style={{ background: '#475569' }} />
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
            Former Chairmen of the Department
          </h2>
          <div className="flex-1 h-px bg-slate-100" />
          {former.length > 0 && (
            <span className="text-xs font-semibold text-slate-400">{former.length} records</span>
          )}
        </div>

        {former.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-10 text-center">
            <p className="text-slate-500 text-sm mb-2">No former chairman records found.</p>
            <p className="text-slate-400 text-xs">
              Admin can add former chairmen from the admin panel → <strong>Chairman / Head</strong> tab → select
              <strong> Ex Chairman</strong> sub-filter → <strong>Add Ex Chairman</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {former.map((m, idx) => (
              <FormerChairCard key={m.id} member={m} serial={idx + 1} index={idx} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function FormerChairCard({
  member: m, serial, index,
}: { member: FacultyMember; serial: number; index: number }) {
  const initials  = getInitials(m.name);
  const href      = profileHref(m);
  const badge     = getBadgeStyle(m.designation);
  // Format: "Jan 2020 – Jan 2024" using actual dates
  const rawFrom   = m.chairmanFrom ? new Date(m.chairmanFrom) : null;
  const rawTo     = m.chairmanTo   ? new Date(m.chairmanTo)   : null;
  const fmtDate   = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const period    = rawFrom
    ? `${fmtDate(rawFrom)} – ${rawTo ? fmtDate(rawTo) : 'Present'}`
    : formatServicePeriod(m.chairmanFrom, m.chairmanTo);

  return (
    <Link href={href} className="group block">
      <article className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-green-300 hover:shadow-md transition-all duration-200">

        {/* Serial number */}
        <span className="shrink-0 w-8 text-sm font-bold text-slate-400 text-right leading-none">
          {serial}.
        </span>

        {/* Photo */}
        <div className="shrink-0 w-16 h-20 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo} alt={m.name}
              className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center select-none font-black text-white text-xl"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug">
            {m.title ? `${m.title} ` : ''}{m.name}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: badge.bg, color: badge.text }}>
              {m.designation}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Former Chairman
            </span>
          </div>
        </div>

        {/* Service period — right aligned */}
        {period && (
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Service Period
            </p>
            <p className="text-xs font-bold text-slate-700">{period}</p>
          </div>
        )}

        {/* Mobile: service period below */}
        {period && (
          <div className="sm:hidden w-full mt-1">
            <p className="text-[9px] text-slate-500">
              <span className="font-bold">Service Period:</span> {period}
            </p>
          </div>
        )}

      </article>
    </Link>
  );
}
