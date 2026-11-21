/**
 * GSTU CSE — Faculty Profile Card
 *
 * Clean, compact, professional academic card.
 * Photo fills the entire top area (object-cover, object-top — face always visible).
 * Four L-bracket corner accents on the photo frame.
 * Info panel: Name → Designation → Email.
 * Responsive, entire card is clickable.
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
  roleLabel?: string;
}

export default function FacultyCard({
  member, index, badge, badgeColor = '#d97706', roleLabel,
}: Props) {
  const initials  = getInitials(member.name);
  const href      = profileHref(member);
  const accent    = DESIG_COLOR[member.designation] ?? '#166534';
  const showEmail = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:-translate-y-0.5">

        {/* Photo frame with corner brackets */}
        <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: '3/4' }}>

          {/* Photo — covers full area, face visible at top */}
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              <span className="text-4xl font-black text-white/90">{initials}</span>
            </div>
          )}

          {/* L-bracket corners — 4 sides */}
          <span className="absolute top-1.5 left-1.5 pointer-events-none z-10" style={{ color: accent }} aria-hidden="true"><Bracket r={0} /></span>
          <span className="absolute top-1.5 right-1.5 pointer-events-none z-10" style={{ color: accent }} aria-hidden="true"><Bracket r={90} /></span>
          <span className="absolute bottom-1.5 left-1.5 pointer-events-none z-10" style={{ color: accent }} aria-hidden="true"><Bracket r={270} /></span>
          <span className="absolute bottom-1.5 right-1.5 pointer-events-none z-10" style={{ color: accent }} aria-hidden="true"><Bracket r={180} /></span>

          {/* Optional badge (On Leave, etc.) */}
          {badge && (
            <div className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-black text-white tracking-widest uppercase z-20"
              style={{ background: badgeColor + 'ee' }}>
              {badge}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="p-2.5">
          <p className="text-[11px] font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-wide mt-0.5 leading-none" style={{ color: accent }}>
            {member.designation}
          </p>
          {roleLabel && (
            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{roleLabel}</p>
          )}
          {showEmail && (
            <p className="text-[8px] text-slate-400 truncate mt-1">{member.email}</p>
          )}
        </div>

      </article>
    </Link>
  );
}

function Bracket({ r }: { r: number }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transform: `rotate(${r}deg)`, display: 'block' }}>
      <path d="M1 6 L1 1 L6 1" stroke="currentColor" strokeWidth="2"
        strokeLinecap="square" fill="none" opacity="0.9" />
    </svg>
  );
}
