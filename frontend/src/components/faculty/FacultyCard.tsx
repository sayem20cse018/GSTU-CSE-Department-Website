/**
 * GSTU CSE — Faculty Profile Card
 * Design: Exact recreation of reference image
 *
 * Structure (bottom → top):
 *   [1] Bright green outer card  (#22c55e)
 *   [2] Dark green offset rect   (behind photo, shifted right+down)
 *   [3] White border frame       (around photo)
 *   [4] Portrait photo
 *   [5] Top-right white shape    (overflows corner)
 *   [6] Bottom-left white shape  (overflows corner)
 *   [7] Name / designation below
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
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>

      {/*
        ┌─────────────────────────────────────┐
        │  Outer wrapper — adds padding so    │
        │  overflowing corner shapes don't    │
        │  get cut off by parent overflow     │
        └─────────────────────────────────────┘
      */}
      <div style={{ padding: '8px', margin: '-8px' }}>

        {/* GREEN CARD */}
        <article
          style={{
            position: 'relative',
            background: '#22c55e',
            borderRadius: '20px',
            padding: '20px 20px 18px 20px',
            overflow: 'visible',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          className="group-hover:-translate-y-1.5 group-hover:shadow-2xl"
        >

          {/* ── TOP-RIGHT white quarter-circle shape ───────────────── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '72px',
              height: '72px',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            {/* solid white filled shape */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '56px',
              height: '56px',
              background: 'white',
              borderRadius: '0 20px 0 100%',
            }} />
            {/* outer curved stroke line */}
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none"
              style={{ position: 'absolute', top: 0, right: 0 }}>
              <path d="M72 4 C72 4 68 68 4 72"
                stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M72 18 C65 65 8 68 4 60"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
            </svg>
          </div>

          {/* ── BOTTOM-LEFT white quarter-circle shape ──────────────── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '52px',   /* sits above name text */
              left: '-6px',
              width: '72px',
              height: '72px',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '56px',
              height: '56px',
              background: 'white',
              borderRadius: '0 100% 0 20px',
            }} />
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none"
              style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <path d="M4 68 C4 68 8 4 68 0"
                stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M4 54 C11 7 64 4 68 12"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
            </svg>
          </div>

          {/* ── DARK GREEN OFFSET rect (behind white frame) ─────────── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              right: '12px',
              bottom: '56px',
              background: '#15803d',
              borderRadius: '14px',
              zIndex: 1,
            }}
          />

          {/* ── WHITE FRAME + PHOTO ──────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              background: 'white',
              borderRadius: '14px',
              padding: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                position: 'relative',
                background: '#d1fae5',
              }}
            >
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    transition: 'transform 0.5s ease',
                  }}
                  className="group-hover:scale-105"
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                    userSelect: 'none',
                  }}
                >
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>
                    {initials}
                  </span>
                </div>
              )}

              {/* optional status badge */}
              {badge && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '4px 0',
                  textAlign: 'center',
                  fontSize: '9px',
                  fontWeight: 900,
                  color: 'white',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: (badgeColor ?? '#d97706') + 'ee',
                }}>
                  {badge}
                </div>
              )}
            </div>
          </div>

          {/* ── NAME / DESIGNATION / BUTTON ──────────────────────────── */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '14px',
              textAlign: 'center',
            }}
          >
            <h3
              className="line-clamp-2 group-hover:text-green-100"
              style={{
                color: 'white',
                fontSize: '0.82rem',
                fontWeight: 700,
                lineHeight: 1.35,
                transition: 'color 0.2s',
              }}
            >
              {member.title ? `${member.title} ` : ''}{member.name}
            </h3>

            <p style={{
              color: '#bbf7d0',
              fontSize: '0.69rem',
              fontWeight: 600,
              marginTop: '3px',
              lineHeight: 1.3,
            }}>
              {member.designation}
            </p>

            {roleLabel && (
              <p style={{ color: '#86efac', fontSize: '0.65rem', marginTop: '2px' }}>
                {roleLabel}
              </p>
            )}

            {/* View Profile pill */}
            <div
              className="group-hover:bg-white group-hover:text-green-700"
              style={{
                marginTop: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'white',
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.45)',
                transition: 'background 0.2s, color 0.2s',
                cursor: 'pointer',
              }}
            >
              View Profile
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

        </article>
      </div>
    </Link>
  );
}
