import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord, formatServicePeriod,
  getInitials, getBadgeStyle, profileHref,
  AVATAR_GRADIENTS, type FacultyMember,
} from '@/lib/faculty/shared';

export const metadata: Metadata = { title: 'Ex Chairman — GSTU CSE' };

function SectionHead({ label, accent = '#166534' }: { label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 rounded-full shrink-0" style={{ background: accent }} />
      <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

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

  // ── ONLY staffType=chairman — Dean is separate ───────────────────────────
  const chairmen = result.members.filter(
    m => isValidFacultyRecord(m) && m.staffType === 'chairman',
  );

  // Running = isCurrentChairman OR leadershipRole=running_chairman
  const running = chairmen.filter(
    m => m.isCurrentChairman || m.leadershipRole === 'running_chairman',
  );

  // Former = all others, sorted by chairmanFrom ascending (oldest first → serial 1,2,3…)
  const former = chairmen
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getTime() : 999999999999;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getTime() : 999999999999;
      return ay - by;
    });

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-5xl">
        <div className="space-y-14">

          {/* ── Current Head of Department ─────────────────────── */}
          {running.length > 0 && (
            <section>
              <SectionHead label="Head of the Department" accent="#166534" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {running.map((m, i) => (
                  <FacultyCard key={m.id} member={m} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── Former Chairmen — numbered horizontal cards ───── */}
          <section>
            <SectionHead label="Former Chairmen" accent="#475569" />
            {former.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">
                No former chairman records found. Add them from the admin panel under
                <strong className="text-slate-600"> Chairman / Head</strong> tab → Leadership Role:
                <em className="text-slate-600"> Former Chairman</em>.
              </p>
            ) : (
              <div className="space-y-3">
                {former.map((m, idx) => (
                  <FormerChairCard key={m.id} member={m} serial={idx + 1} index={idx} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

/**
 * Horizontal card — BUET ex_heads style but more visual:
 * Serial | Photo | Name + Designation + "Former Chairman" badge | Service Period
 */
function FormerChairCard({
  member: m, serial, index,
}: { member: FacultyMember; serial: number; index: number }) {
  const initials  = getInitials(m.name);
  const href      = profileHref(m);
  const badge     = getBadgeStyle(m.designation);
  const period    = formatServicePeriod(m.chairmanFrom, m.chairmanTo);
  const showEmail = !!(m.email?.includes('@') && !/^faculty-\d+@/i.test(m.email ?? ''));

  return (
    <Link href={href} className="group block">
      <article className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-green-300 hover:shadow-md transition-all duration-200">

        {/* Serial number */}
        <span className="shrink-0 w-7 text-sm font-bold text-slate-400 text-right">{serial}.</span>

        {/* Photo */}
        <div className="relative shrink-0 w-14 h-16 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo} alt={m.name}
              className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center select-none font-black text-white text-lg"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-1">
            {m.title ? `${m.title} ` : ''}{m.name}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: badge.bg, color: badge.text }}>
              {m.designation}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Former Chairman
            </span>
          </div>
          {showEmail && (
            <p className="text-[9px] text-slate-400 mt-0.5 truncate">{m.email}</p>
          )}
        </div>

        {/* Service period */}
        {period && (
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Service Period</p>
            <p className="text-xs font-bold text-slate-700">{period}</p>
          </div>
        )}

      </article>
    </Link>
  );
}
