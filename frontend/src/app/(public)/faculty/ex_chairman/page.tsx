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

function SectionHeading({ label, accent = '#166534' }: { label: string; accent?: string }) {
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

  const all = result.members.filter(
    m => isValidFacultyRecord(m) && (m.staffType === 'chairman' || m.staffType === 'dean'),
  );

  const running = all.filter(m => m.isCurrentChairman || m.leadershipRole === 'running_chairman');

  const former = all
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 9999;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 9999;
      return ay - by;
    });

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-5xl">
        <div className="space-y-14">

          {/* Running Chairman */}
          {running.length > 0 && (
            <section>
              <SectionHeading label="Head of the Department" accent="#166534" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {running.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

          {/* Former Chairmen — elegant card list */}
          <section>
            <SectionHeading label="Former Chairmen" accent="#475569" />
            {former.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">No former chairman records found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {former.map((m, idx) => (
                  <FormerChairCard key={m.id} member={m} index={idx} serial={idx + 1} />
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

/** Elegant horizontal card: photo + name + designation + service period */
function FormerChairCard({ member: m, index, serial }: { member: FacultyMember; index: number; serial: number }) {
  const initials = getInitials(m.name);
  const href     = profileHref(m);
  const badge    = getBadgeStyle(m.designation);
  const period   = formatServicePeriod(m.chairmanFrom, m.chairmanTo);

  return (
    <Link href={href} className="group block">
      <article className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-200">

        {/* Serial + photo */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-slate-300 w-5 text-right shrink-0">{serial}.</span>

          {/* Photo with corner-bracket frame (mini version) */}
          <div className="relative w-16 h-20 shrink-0">
            {/* backdrop */}
            <div className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(145deg,#0b3d1f,#1a7a3c)', opacity: 0.15 }} />
            <div className="relative z-10 w-full h-full overflow-hidden rounded-md border border-slate-200"
              style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} className="w-full h-full object-contain object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center select-none font-black text-white text-xl"
                  style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
                  {initials}
                </div>
              )}
            </div>
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 z-20" style={{ color: '#166534' }} aria-hidden="true">
              <MiniBracket rotate={0} />
            </span>
            <span className="absolute top-0 right-0 z-20" style={{ color: '#166534' }} aria-hidden="true">
              <MiniBracket rotate={90} />
            </span>
            <span className="absolute bottom-0 left-0 z-20" style={{ color: '#166534' }} aria-hidden="true">
              <MiniBracket rotate={270} />
            </span>
            <span className="absolute bottom-0 right-0 z-20" style={{ color: '#166534' }} aria-hidden="true">
              <MiniBracket rotate={180} />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {m.title ? `${m.title} ` : ''}{m.name}
          </p>
          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: badge.bg, color: badge.text }}>
            {m.designation}
          </span>
          <p className="text-[11px] font-semibold mt-1.5" style={{ color: '#475569' }}>Former Chairman</p>
          {period && (
            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {period}
            </p>
          )}
        </div>

      </article>
    </Link>
  );
}

function MiniBracket({ rotate }: { rotate: number }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
      <path d="M1 5 L1 1 L5 1" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="square" fill="none" opacity="0.9" />
    </svg>
  );
}
