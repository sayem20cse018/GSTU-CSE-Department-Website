/**
 * GSTU CSE — Premium Faculty Profile Card
 *
 * Layout: photo (with corner brackets + green backdrop) → name → designation → email
 * No clip-path, no face cropping. object-contain, object-top.
 * Corner brackets use the designation accent colour.
 */
import Link from 'next/link';
import {
  getInitials,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

const DESIG_COLOR: Record<string, string> = {
  'Professor':           '#1d4ed8',
  'Associate Professor': '#6d28d9',
  'Assistant Professor': '#166534',
  'Senior Lecturer':     '#0f766e',
  'Lecturer':            '#b45309',
  'Adjunct Faculty':     '#475569',
};

interface Props {
  member: FacultyMember;
  index: number;
  badge?: string;
  badgeColor?: string;
  /** Extra role label shown below designation, e.g. "Dean", "Head of Dept." */
  roleLabel?: string;
}

export default function FacultyCard({ member, index, badge, badgeColor = '#d97706', roleLabel }: Props) {
  const initials   = getInitials(member.name);
  const href       = profileHref(member);
  const accent     = DESIG_COLOR[member.designation] ?? '#166534';
  const showEmail  = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article
        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' }}
      >

        {/* ── Photo section ─────────────────────────────────────── */}
        <div className="relative p-3 pb-1">
          {/* Green geometric backdrop — offset behind photo */}
          <div
            className="absolute rounded-xl"
            style={{
              top: 16, left: 16, right: 7, bottom: 7,
              background: 'linear-gradient(145deg,#064e1f 0%,#1a7a3c 100%)',
              opacity: 0.14,
            }}
            aria-hidden="true"
          />

          {/* Photo */}
          <div
            className="relative z-10 overflow-hidden bg-slate-100 mx-auto"
            style={{
              aspectRatio: '3/4',
              borderRadius: '10px',
              border: '2.5px solid #fff',
              boxShadow: '0 3px 14px rgba(0,0,0,0.13)',
            }}
          >
            {member.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center select-none"
                style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
              >
                <span className="text-4xl font-black text-white/90">{initials}</span>
              </div>
            )}

            {/* Status badge at bottom of photo */}
            {badge && (
              <div
                className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-black text-white tracking-widest uppercase z-20"
                style={{ background: badgeColor + 'ee' }}
              >
                {badge}
              </div>
            )}
          </div>

          {/* Corner brackets — 4 sides */}
          <CornerSet accent={accent} />
        </div>

        {/* ── Info ──────────────────────────────────────────────── */}
        <div className="px-3 pt-2 pb-3 text-center">

          {/* Name — prominent, first */}
          <p className="text-[12px] font-extrabold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>

          {/* Designation */}
          <p
            className="text-[9px] font-bold uppercase tracking-wider mt-1 leading-none"
            style={{ color: accent }}
          >
            {member.designation}
          </p>

          {/* Optional role label (Dean / Head of Dept.) */}
          {roleLabel && (
            <p className="text-[9px] font-semibold mt-0.5 leading-none text-slate-500">
              {roleLabel}
            </p>
          )}

          {/* Email */}
          {showEmail && (
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <svg className="w-2.5 h-2.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-[8.5px] text-slate-400 truncate max-w-full">{member.email}</p>
            </div>
          )}

        </div>

        {/* Hover green bottom sweep */}
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ background: `linear-gradient(90deg,${accent},#1a7a3c)` }}
          aria-hidden="true"
        />

      </article>
    </Link>
  );
}

/** Four L-shaped corner brackets around the photo */
function CornerSet({ accent }: { accent: string }) {
  return (
    <>
      <span className="absolute top-3 left-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
        <CB r={0} />
      </span>
      <span className="absolute top-3 right-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
        <CB r={90} />
      </span>
      <span className="absolute bottom-1 left-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
        <CB r={270} />
      </span>
      <span className="absolute bottom-1 right-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
        <CB r={180} />
      </span>
    </>
  );
}

function CB({ r }: { r: number }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: `rotate(${r}deg)`, display: 'block' }}>
      <path d="M1 7 L1 1 L7 1" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="square" fill="none" opacity="0.9" />
    </svg>
  );
}
