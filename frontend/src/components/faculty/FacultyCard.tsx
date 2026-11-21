/**
 * Clean academic faculty card — BUET-style.
 * Photo → designation (small, plain) → name → email
 * No colour accents, no pills, no decorative bars.
 */
import Link from 'next/link';
import {
  getInitials,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

interface Props {
  member: FacultyMember;
  index: number;
}

export default function FacultyCard({ member, index }: Props) {
  const initials   = getInitials(member.name);
  const href       = profileHref(member);
  const showEmail  = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));

  return (
    <Link href={href} className="group block">
      <article className="text-center border border-slate-200 rounded overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200 bg-white">

        {/* Photo — 3:4 portrait, full face, no crop */}
        <div
          className="relative w-full overflow-hidden bg-slate-50"
          style={{ aspectRatio: '3/4' }}
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
        </div>

        {/* Info below photo */}
        <div className="p-2 border-t border-slate-100">
          {/* Name */}
          <p className="text-[11px] font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          {/* Designation — plain small text */}
          <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{member.designation}</p>
          {/* Email */}
          {showEmail && (
            <p className="text-[9px] text-slate-400 truncate mt-1">{member.email}</p>
          )}
        </div>

      </article>
    </Link>
  );
}
