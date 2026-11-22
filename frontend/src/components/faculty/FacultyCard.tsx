/**
 * GSTU CSE — Faculty Profile Card
 *
 * Design:
 *  - Bright green card background (#22c55e)
 *  - Dark green offset rect BEHIND white frame (depth effect)
 *  - White border frame around photo
 *  - Photo — 100% clean, NOTHING on top of the face
 *  - Top-right corner: white quarter-circle (card edge only, not on photo)
 *  - Bottom-left corner: white quarter-circle (card edge only, not on photo)
 *  - 1 dot only in top-left card corner (not overlapping photo)
 *  - Name / Designation / Email below — small, single line each
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

export default function FacultyCard({ member, index, badge, badgeColor, roleLabel }: Props) {
  const initials    = getInitials(member.name);
  const href        = profileHref(member);
  const showEmail   = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));
  const displayName = `${member.title ? member.title + ' ' : ''}${member.name}`;

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>

      {/* Extra padding so overflowing corner shapes aren't clipped */}
      <div style={{ padding: '8px', margin: '-8px' }}>

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

          {/* ── TOP-RIGHT: white quarter-circle on card corner ── */}
          {/* Positioned at top-right of the GREEN CARD, not on the photo */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-6px', right: '-6px',
              width: '64px', height: '64px',
              zIndex: 20, pointerEvents: 'none',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '50px', height: '50px',
              background: 'white',
              borderRadius: '0 20px 0 100%',
              opacity: 0.95,
            }} />
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"
              style={{ position: 'absolute', top: 0, right: 0 }}>
              <path d="M64 5 C63 60 5 63 3 64"
                stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"/>
            </svg>
          </div>

          {/* ── BOTTOM-LEFT: white quarter-circle on card corner ── */}
          {/* Positioned at the BOTTOM of the card, in the name section area */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-6px', left: '-6px',
              width: '64px', height: '64px',
              zIndex: 20, pointerEvents: 'none',
            }}
          >
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '50px', height: '50px',
              background: 'white',
              borderRadius: '0 100% 0 20px',
              opacity: 0.95,
            }} />
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"
              style={{ position: 'absolute', bottom: 0, left: 0 }}>
              <path d="M1 59 C2 4 59 1 61 0"
                stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"/>
            </svg>
          </div>

          {/* ── DARK GREEN OFFSET RECT — behind white frame ── */}
          {/* zIndex:1 — stays completely behind the photo frame */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '24px', left: '24px',
              right: '10px', bottom: '54px',
              background: '#15803d',
              borderRadius: '12px',
              zIndex: 1,
            }}
          />

          {/* ── WHITE FRAME + PHOTO ── */}
          {/* zIndex:5 — above offset rect, photo face is completely clean */}
          <div style={{
            position: 'relative',
            zIndex: 5,
            background: 'white',
            borderRadius: '12px',
            padding: '5px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '3 / 3.4',
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
                    transition: 'transform 0.5s ease',
                    display: 'block',
                    /* z-index intentionally NOT set — nothing sits above this */
                  }}
                  className="group-hover:scale-105"
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                }}>
                  <span style={{
                    fontSize: '2.2rem', fontWeight: 900,
                    color: 'white', userSelect: 'none',
                  }}>{initials}</span>
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
          </div>

          {/* ── NAME / DESIGNATION / EMAIL ── */}
          <div style={{
            position: 'relative', zIndex: 10,
            marginTop: '12px',
          }}>

            {/* Name — single line, bold, truncate */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <svg width="11" height="11" fill="white" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.85 }}>
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <span
                className="group-hover:text-green-100"
                style={{
                  fontSize: '0.73rem', fontWeight: 800, color: 'white',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  flex: 1, minWidth: 0,
                  transition: 'color 0.2s',
                }}
              >{displayName}</span>
            </div>

            {/* thin white divider */}
            <div style={{
              height: '1px', marginBottom: '5px',
              background: 'rgba(255,255,255,0.3)',
            }} />

            {/* Designation — single line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: showEmail ? '3px' : 0 }}>
              <svg width="11" height="11" fill="white" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.85 }}>
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              <span style={{
                fontSize: '0.67rem', fontWeight: 600, color: '#bbf7d0',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                flex: 1, minWidth: 0,
              }}>
                {roleLabel ? `${roleLabel} · ${member.designation}` : member.designation}
              </span>
            </div>

            {/* Email — single line */}
            {showEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.85 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span style={{
                  fontSize: '0.62rem', color: '#86efac',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  flex: 1, minWidth: 0,
                }}>{member.email}</span>
              </div>
            )}

          </div>

        </article>
      </div>
    </Link>
  );
}
