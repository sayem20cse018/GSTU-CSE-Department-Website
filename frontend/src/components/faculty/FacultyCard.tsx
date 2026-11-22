/**
 * GSTU CSE — Faculty Profile Card
 * Pure Server Component — hover via CSS (.fcard defined in globals.css)
 * Fixed 200px photo height → all cards same height (BUET-style uniform grid)
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
  badge?: string;
  badgeColor?: string;
  roleLabel?: string;
}

/* green person SVG */
const IconPerson = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

/* green graduation cap SVG */
const IconCap = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

/* green email SVG */
const IconEmail = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

export default function FacultyCard({ member, index, badge, badgeColor, roleLabel }: Props) {
  const initials    = getInitials(member.name);
  const href        = profileHref(member);
  const showEmail   = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));
  const displayName = `${member.title ? member.title + ' ' : ''}${member.name}`;
  const desigText   = roleLabel ? `${roleLabel} · ${member.designation}` : member.designation;

  return (
    <Link href={href} className="fcard" aria-label={`View profile of ${member.name}`}>

      {/* ── PHOTO SECTION ── fixed 200px height, all cards uniform */}
      <div className="fcard__photo">

        {/* decorations — all behind photo (z-index 0) */}
        <div className="fcard__dot-tl"  aria-hidden="true" />
        <div className="fcard__dot-br"  aria-hidden="true" />
        <div className="fcard__curve-l" aria-hidden="true" />
        <div className="fcard__curve-r" aria-hidden="true" />
        <div className="fcard__ring"    aria-hidden="true" />

        {/* photo — z-index 10, face clean */}
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={member.name}
            className="fcard__img"
          />
        ) : (
          <div
            className="fcard__avatar"
            style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
          >
            <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'white', userSelect: 'none' }}>
              {initials}
            </span>
          </div>
        )}

        {badge && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
            padding: '3px 0', textAlign: 'center',
            fontSize: '8px', fontWeight: 900, color: 'white',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: (badgeColor ?? '#d97706') + 'ee',
          }}>{badge}</div>
        )}
      </div>

      {/* ── INFO SECTION ── */}
      <div className="fcard__info">

        {/* Name */}
        <div className="fcard__row">
          {IconPerson}
          <span className="fcard__name">{displayName}</span>
        </div>

        {/* Designation */}
        <div className="fcard__row">
          {IconCap}
          <span className="fcard__desig">{desigText}</span>
        </div>

        {/* Email */}
        {showEmail && (
          <div className="fcard__row">
            {IconEmail}
            <a
              href={`mailto:${member.email}`}
              className="fcard__email"
            >
              {member.email}
            </a>
          </div>
        )}

      </div>
    </Link>
  );
}
