/**
 * GSTU CSE — Premium Faculty Profile Card
 *
 * Photo frame: 4 decorative green corner brackets around the portrait.
 * A subtle dark-green geometric shape sits behind the photo as a backdrop.
 * No clip-path that would crop faces. Pure CSS + absolute positioning.
 *
 * Layout below photo: name → designation → email (all only if present).
 * Entire card is clickable. Smooth hover lift.
 */
import Link from 'next/link';
import {
  getInitials,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

// Designation → accent colour used for corner brackets and designation text
const DESIG_COLOR: Record<string, string> = {
  'Professor':           '#1d4ed8',
  'Associate Professor': '#6d28d9',
  'Assistant Professor': '#166534',
  'Senior Lecturer':     '#0f766e',
  'Lecturer':            '#b45309',
  'Adjunct Faculty':     '#475569',
  'Head of Department':  '#166534',
  'Dean':                '#166534',
};

interface Props {
  member: FacultyMember;
  index: number;
  badge?: string;        // e.g. "On Leave", "Head", "Dean"
  badgeColor?: string;
}

export default function FacultyCard({ member, index, badge, badgeColor = '#d97706' }: Props) {
  const initials   = getInitials(member.name);
  const href       = profileHref(member);
  const accent     = DESIG_COLOR[member.designation] ?? '#166534';
  const showEmail  = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));
  const showInterests = (member.researchInterests ?? []).length > 0;

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article
        className="relative bg-white rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >

        {/* ── Photo section ─────────────────────────────────────── */}
        <div className="relative p-3 pb-0">
          {/* Dark green geometric backdrop — shifted down-right */}
          <div
            className="absolute rounded-lg"
            style={{
              top: 14, left: 14, right: 6, bottom: 6,
              background: 'linear-gradient(145deg, #0b3d1f 0%, #1a7a3c 100%)',
              opacity: 0.18,
              borderRadius: '10px',
            }}
            aria-hidden="true"
          />

          {/* Photo container */}
          <div
            className="relative z-10 overflow-hidden bg-slate-100"
            style={{
              aspectRatio: '3/4',
              borderRadius: '8px',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
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
                <span className="text-3xl font-black text-white/90">{initials}</span>
              </div>
            )}

            {/* Badge (On Leave / Dean / etc.) */}
            {badge && (
              <div
                className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-black text-white tracking-wider uppercase z-20"
                style={{ background: badgeColor + 'ee' }}
              >
                {badge}
              </div>
            )}
          </div>

          {/* ── Corner brackets (4 sides of the photo frame) ─── */}
          {/* Top-left */}
          <span className="absolute top-3 left-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
            <CornerBracket rotate={0} />
          </span>
          {/* Top-right */}
          <span className="absolute top-3 right-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
            <CornerBracket rotate={90} />
          </span>
          {/* Bottom-left */}
          <span className="absolute bottom-0 left-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
            <CornerBracket rotate={270} />
          </span>
          {/* Bottom-right */}
          <span className="absolute bottom-0 right-3 z-20 pointer-events-none" style={{ color: accent }} aria-hidden="true">
            <CornerBracket rotate={180} />
          </span>
        </div>

        {/* ── Info below photo ──────────────────────────────────── */}
        <div className="px-3 pt-2.5 pb-3">

          {/* Designation */}
          <p
            className="text-[10px] font-bold uppercase tracking-wider leading-none mb-1.5"
            style={{ color: accent }}
          >
            {member.designation}
          </p>

          {/* Name */}
          <p className="text-[12px] font-extrabold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2 mb-1">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>

          {/* Research interests — first one only, truncated */}
          {showInterests && (
            <p className="text-[9px] text-slate-400 truncate mb-1.5 leading-none">
              {member.researchInterests[0]}
            </p>
          )}

          {/* Email */}
          {showEmail && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-2.5 h-2.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-[9px] text-slate-400 truncate">{member.email}</p>
            </div>
          )}

        </div>

        {/* ── Hover bottom bar ──────────────────────────────────── */}
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ background: `linear-gradient(90deg, ${accent}, #1a7a3c)` }}
          aria-hidden="true"
        />

      </article>
    </Link>
  );
}

/** L-shaped corner bracket SVG — rotated to each corner position */
function CornerBracket({ rotate }: { rotate: number }) {
  return (
    <svg
      width="14" height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}
    >
      <path
        d="M1 7 L1 1 L7 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}
