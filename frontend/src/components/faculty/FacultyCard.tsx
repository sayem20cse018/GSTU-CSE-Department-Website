/**
 * GSTU CSE — Faculty Profile Card
 *
 * Reference design recreation:
 *  - Bright green card background
 *  - Dark green offset rect BEHIND the white frame (not on photo)
 *  - White border frame around the photo
 *  - Portrait photo — clean, nothing on top of the face
 *  - Top-right white shape decorates the CARD CORNER (outside photo)
 *  - Bottom-left white shape decorates the CARD CORNER (outside photo)
 *  - Name + designation below
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
        Outer wrapper with extra padding so the overflowing
        corner decorations are never clipped by parent containers.
      */}
      <div style={{ padding: '10px', margin: '-10px' }}>

        <article
          className="group-hover:-translate-y-1.5 group-hover:shadow-2xl"
          style={{
            position: 'relative',
            background: '#22c55e',
            borderRadius: '20px',
            padding: '18px 18px 16px 18px',
            overflow: 'visible',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
        >

          {/* ═══════════════════════════════════════════════════════
              TOP-RIGHT CORNER white shape
              Lives in the card corner — nowhere near the photo face
          ═══════════════════════════════════════════════════════ */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '70px',
              height: '70px',
              zIndex: 30,
              pointerEvents: 'none',
            }}
          >
            {/* solid white filled quarter-circle */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '54px',
              height: '54px',
              background: 'white',
              borderRadius: '0 20px 0 100%',
              opacity: 0.95,
            }} />
            {/* outer arc lines */}
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none"
              style={{ position: 'absolute', top: 0, right: 0 }}>
              <path d="M70 5 C70 5 65 65 5 70"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M70 20 C60 62 8 65 4 58"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
            </svg>
          </div>

          {/* ═══════════════════════════════════════════════════════
              BOTTOM-LEFT CORNER white shape
              Lives in the card corner — nowhere near the photo face
          ═══════════════════════════════════════════════════════ */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '48px',  /* stays below the photo, in the name area corner */
              left: '-8px',
              width: '70px',
              height: '70px',
              zIndex: 30,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '54px',
              height: '54px',
              background: 'white',
              borderRadius: '0 100% 0 20px',
              opacity: 0.95,
            }} />
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none"
              style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <path d="M4 65 C4 65 9 5 65 0"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M4 50 C12 8 62 5 66 12"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
            </svg>
          </div>

          {/* ═══════════════════════════════════════════════════════
              DARK GREEN OFFSET RECT — behind the white frame
              Shifted right + down to create depth effect
              zIndex=1 so it stays BELOW the photo frame
          ═══════════════════════════════════════════════════════ */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '26px',
              left: '26px',
              right: '10px',
              bottom: '54px',
              background: '#15803d',
              borderRadius: '12px',
              zIndex: 1,
            }}
          />

          {/* ═══════════════════════════════════════════════════════
              WHITE FRAME + PHOTO
              zIndex=5 — above the dark offset rect
              Photo face is completely clean — no shapes on top
          ═══════════════════════════════════════════════════════ */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              background: 'white',
              borderRadius: '12px',
              padding: '5px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            }}
          >
            <div
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: '3 / 3.6',   /* slightly shorter than 3/4 */
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
                    display: 'block',
                  }}
                  className="group-hover:scale-105"
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', userSelect: 'none' }}>
                    {initials}
                  </span>
                </div>
              )}

              {/* status badge — only at very bottom edge, not on face */}
              {badge && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '4px 0', textAlign: 'center',
                  fontSize: '8px', fontWeight: 900, color: 'white',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: (badgeColor ?? '#d97706') + 'ee',
                }}>{badge}</div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              NAME / DESIGNATION / BUTTON
          ═══════════════════════════════════════════════════════ */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            marginTop: '12px',
            textAlign: 'center',
          }}>
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
              fontSize: '0.68rem',
              fontWeight: 600,
              marginTop: '3px',
              lineHeight: 1.3,
            }}>
              {member.designation}
            </p>

            {roleLabel && (
              <p style={{ color: '#86efac', fontSize: '0.63rem', marginTop: '2px' }}>
                {roleLabel}
              </p>
            )}

            <div
              className="group-hover:bg-white group-hover:text-green-700"
              style={{
                marginTop: '9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '0.67rem',
                fontWeight: 700,
                color: 'white',
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                transition: 'background 0.2s, color 0.2s',
                cursor: 'pointer',
              }}
            >
              View Profile
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

        </article>
      </div>
    </Link>
  );
}
