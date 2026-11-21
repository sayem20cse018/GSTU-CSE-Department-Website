/**
 * Shared faculty profile card — used on Active Faculty, On Leave, and Staff pages.
 * Clean academic design: square photo, designation pill, name, email.
 * No extra decorations. Server-safe (no 'use client').
 */
import Link from 'next/link';
import {
  getBadgeStyle,
  getInitials,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

const DESIG_ACCENT: Record<string, string> = {
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
  ribbon?: string;
  ribbonColor?: string;
}

export default function FacultyCard({ member, index, ribbon, ribbonColor = '#d97706' }: Props) {
  const initials    = getInitials(member.name);
  const href        = profileHref(member);
  const accentColor = DESIG_ACCENT[member.designation] ?? '#166534';
  const showEmail   = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));

  return (
    <Link href={href} className="group block">
      <article className="text-center">
        {/* Square photo — 1:1 ratio, no crop */}
        <div
          className="relative w-full overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-slate-400 group-hover:shadow-md transition-all duration-200"
          style={{ aspectRatio: '1/1', borderRadius: '4px' }}
        >
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-contain object-top"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              <span className="text-3xl font-black text-white/90">{initials}</span>
            </div>
          )}

          {ribbon && (
            <span
              className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-black text-white py-0.5"
              style={{ background: ribbonColor + 'e6' }}
            >
              {ribbon}
            </span>
          )}
        </div>

        {/* Info below photo */}
        <div className="mt-2 px-0.5">
          {/* Designation */}
          <p
            className="text-[10px] font-bold leading-none mb-1"
            style={{ color: accentColor }}
          >
            {member.designation}
          </p>
          {/* Name */}
          <p className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          {/* Email */}
          {showEmail && (
            <p className="text-[9px] text-slate-400 truncate mt-0.5">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
