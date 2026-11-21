/**
 * Shared faculty profile card — used on all public Faculty & Staff listing pages.
 * Server-safe (no 'use client'). Pure presentational component.
 */
import Link from 'next/link';
import {
  getBadgeStyle,
  getInitials,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

// Accent top-line colour per designation — reflects academic seniority visually
const DESIG_ACCENT: Record<string, string> = {
  'Professor':           '#1d4ed8',
  'Associate Professor': '#6d28d9',
  'Assistant Professor': '#166534',
  'Senior Lecturer':     '#0f766e',
  'Lecturer':            '#b45309',
  'Adjunct Faculty':     '#475569',
};

interface FacultyCardProps {
  member: FacultyMember;
  index: number;
  /** Optional ribbon text shown in top-left of photo (e.g. "Dean", "On Leave") */
  ribbon?: string;
  /** Ribbon background colour */
  ribbonColor?: string;
}

export default function FacultyCard({ member, index, ribbon, ribbonColor = '#d97706' }: FacultyCardProps) {
  const initials    = getInitials(member.name);
  const href        = profileHref(member);
  const badge       = getBadgeStyle(member.designation);
  const accentColor = DESIG_ACCENT[member.designation] ?? '#166534';
  const showEmail   = member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);
  const interests   = (member.researchInterests ?? []).slice(0, 2);

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-transparent">
        {/* Coloured top accent line — changes per designation */}
        <div className="h-1 w-full shrink-0" style={{ background: accentColor }} />

        {/* Photo — 3:4 portrait, full face, no cropping */}
        <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: '3/4' }}>
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              <span className="text-4xl font-black text-white/90" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
                {initials}
              </span>
            </div>
          )}

          {/* Ribbon — top-left badge (e.g. Dean, On Leave) */}
          {ribbon && (
            <span
              className="absolute top-2 left-2 text-[9px] font-black text-white px-2 py-0.5 rounded-full z-10 shadow-sm"
              style={{ background: ribbonColor }}
            >
              {ribbon}
            </span>
          )}

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Info panel */}
        <div className="p-3.5 flex flex-col gap-1.5 flex-1">
          {/* Designation pill */}
          <span
            className="self-start text-[9px] font-extrabold px-2.5 py-0.5 rounded-full leading-none uppercase tracking-wider whitespace-nowrap"
            style={{ background: accentColor, color: '#fff' }}
          >
            {member.designation}
          </span>

          {/* Name */}
          <h3 className="text-[11px] font-extrabold text-slate-900 group-hover:text-green-700 transition-colors duration-200 leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </h3>

          {/* Research interests */}
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {interests.map(r => (
                <span key={r} className="text-[8px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 leading-none truncate max-w-full">
                  {r}
                </span>
              ))}
            </div>
          )}

          {/* Email */}
          {showEmail && (
            <p className="text-[8px] text-slate-400 truncate leading-none mt-auto pt-1">{member.email}</p>
          )}
        </div>

        {/* Hover CTA bar */}
        <div
          className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: accentColor }}
          aria-hidden="true"
        >
          View Profile
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
