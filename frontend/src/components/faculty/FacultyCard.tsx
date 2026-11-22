/**
 * GSTU CSE — Faculty Profile Card
 *
 * Unique design:
 *  - Square photo (1:1), clean and compact
 *  - Layered corner brackets on all 4 sides of the photo frame
 *  - Thin accent lines top & bottom
 *  - Green gradient card bg
 *  - Name/designation below
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

export default function FacultyCard({
  member, index, badge, badgeColor, roleLabel,
}: Props) {
  const initials = getInitials(member.name);
  const href     = profileHref(member);

  return (
    <Link href={href} className="group block">

      <article style={{
        background: 'linear-gradient(160deg,#166534 0%,#14532d 100%)',
        borderRadius: '16px',
        padding: '14px 14px 16px',
        position: 'relative',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
        className="group-hover:-translate-y-1 group-hover:shadow-xl"
      >

        {/* ── top accent line ── */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%',
          height: '3px',
          background: 'linear-gradient(90deg,transparent,#4ade80,transparent)',
          borderRadius: '0 0 4px 4px',
        }} />

        {/* ── PHOTO FRAME ── */}
        <div style={{ position: 'relative' }}>

          {/* outer glow ring */}
          <div style={{
            position: 'absolute', inset: '-4px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg,#4ade80 0%,transparent 50%,#4ade80 100%)',
            opacity: 0.5,
          }} />

          {/* white frame */}
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: '12px',
            padding: '5px',
            zIndex: 2,
          }}>

            {/* photo box — square */}
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              position: 'relative',
              background: '#d1fae5',
            }}>
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center top',
                    transition: 'transform 0.4s',
                  }}
                  className="group-hover:scale-105"
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>
                    {initials}
                  </span>
                </div>
              )}
              {badge && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '3px 0', textAlign: 'center',
                  fontSize: '8px', fontWeight: 900, color: 'white',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: (badgeColor ?? '#d97706') + 'ee',
                }}>{badge}</div>
              )}
            </div>

            {/* ── 4-corner bracket accents ON THE WHITE FRAME ── */}
            {/* top-left */}
            <svg style={{ position:'absolute', top:0, left:0, zIndex:5 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 12 L2 2 L12 2" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            {/* top-right */}
            <svg style={{ position:'absolute', top:0, right:0, zIndex:5 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 12 L18 2 L8 2" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            {/* bottom-left */}
            <svg style={{ position:'absolute', bottom:0, left:0, zIndex:5 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 8 L2 18 L12 18" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            {/* bottom-right */}
            <svg style={{ position:'absolute', bottom:0, right:0, zIndex:5 }} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 8 L18 18 L8 18" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>

          </div>
        </div>

        {/* ── INFO BELOW ── */}
        <div style={{ marginTop: '12px', textAlign: 'center', position: 'relative', zIndex: 3 }}>

          {/* thin divider */}
          <div style={{
            width: '32px', height: '2px', margin: '0 auto 8px',
            background: 'linear-gradient(90deg,transparent,#4ade80,transparent)',
            borderRadius: '2px',
          }} />

          <h3
            className="line-clamp-2 group-hover:text-green-300"
            style={{ color: '#f0fdf4', fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.35, transition: 'color 0.2s' }}
          >
            {member.title ? `${member.title} ` : ''}{member.name}
          </h3>

          <p style={{ color: '#86efac', fontSize: '0.65rem', fontWeight: 600, marginTop: '3px', lineHeight: 1.3 }}>
            {member.designation}
          </p>

          {roleLabel && (
            <p style={{ color: '#4ade80', fontSize: '0.62rem', marginTop: '2px' }}>{roleLabel}</p>
          )}

          {/* view profile button */}
          <div
            className="group-hover:bg-green-400 group-hover:text-white group-hover:border-green-400"
            style={{
              marginTop: '10px',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 12px', borderRadius: '999px',
              fontSize: '0.63rem', fontWeight: 700,
              color: '#bbf7d0',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(74,222,128,0.4)',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            View Profile
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* ── bottom accent line ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: '30%', right: '30%',
          height: '2px',
          background: 'linear-gradient(90deg,transparent,#4ade80,transparent)',
          borderRadius: '2px 2px 0 0',
        }} />

      </article>
    </Link>
  );
}
