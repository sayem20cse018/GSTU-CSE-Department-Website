/**
 * GSTU CSE — Faculty Profile Card
 *
 * WHITE card, rounded corners
 * Photo area: green gradient bg
 *   - dot pattern corners  → zIndex 0 (behind photo)
 *   - white inner ring     → zIndex 0 (behind photo)
 *   - curved side accents  → zIndex 0 (behind photo)
 *   - PHOTO                → zIndex 10 (on top of everything)
 * Info area: white bg, icon + text rows
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
      <article
        className="group-hover:-translate-y-1 group-hover:shadow-2xl"
        style={{
          background: 'white',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
          border: '1.5px solid #e2e8f0',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >

        {/* ╔══════════════════════════════════════╗
            ║  PHOTO SECTION                       ║
            ║  Green gradient background           ║
            ║  All decorations are BEHIND photo    ║
            ╚══════════════════════════════════════╝ */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(160deg,#16a34a 0%,#4ade80 65%,#86efac 100%)',
          aspectRatio: '1 / 1.05',
          overflow: 'hidden',
        }}>

          {/* dot pattern — top-left, zIndex:0 → behind photo */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: 0,
            width: '48px', height: '48px',
            zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1.5px, transparent 1.5px)',
            backgroundSize: '8px 8px',
          }} />

          {/* dot pattern — bottom-right, zIndex:0 → behind photo */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '48px', height: '48px',
            zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1.5px, transparent 1.5px)',
            backgroundSize: '8px 8px',
          }} />

          {/* left curved accent, zIndex:0 → behind photo */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: '-16px', top: '50%',
            transform: 'translateY(-50%)',
            width: '32px', height: '90px',
            background: 'rgba(21,128,61,0.5)',
            borderRadius: '0 50px 50px 0',
            zIndex: 0,
          }} />

          {/* right curved accent, zIndex:0 → behind photo */}
          <div aria-hidden="true" style={{
            position: 'absolute', right: '-16px', top: '50%',
            transform: 'translateY(-50%)',
            width: '32px', height: '90px',
            background: 'rgba(21,128,61,0.5)',
            borderRadius: '50px 0 0 50px',
            zIndex: 0,
          }} />

          {/* white inner frame ring, zIndex:0 → behind photo */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '10px',
            borderRadius: '16px',
            border: '3px solid rgba(255,255,255,0.65)',
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          {/* ── PHOTO — zIndex:10, on top of EVERYTHING ── */}
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                zIndex: 10,
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              className="group-hover:scale-105"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
              zIndex: 10,
            }}>
              <span style={{
                fontSize: '2.8rem', fontWeight: 900,
                color: 'white', userSelect: 'none',
              }}>{initials}</span>
            </div>
          )}

          {badge && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              zIndex: 20,
              padding: '4px 0', textAlign: 'center',
              fontSize: '8px', fontWeight: 900, color: 'white',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: (badgeColor ?? '#d97706') + 'ee',
            }}>{badge}</div>
          )}
        </div>

        {/* ╔══════════════════════════════════════╗
            ║  INFO SECTION — white background     ║
            ╚══════════════════════════════════════╝ */}
        <div style={{
          padding: '11px 13px 13px',
          borderTop: '2px solid #dcfce7',
        }}>

          {/* Name row — bold, single line, truncate */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            marginBottom: '6px',
          }}>
            <svg width="12" height="12" fill="#16a34a" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <span
              className="group-hover:text-green-700"
              style={{
                fontSize: '0.75rem', fontWeight: 800, color: '#14532d',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                flex: 1, minWidth: 0,
                transition: 'color 0.2s',
              }}
            >{displayName}</span>
          </div>

          {/* green divider */}
          <div style={{
            height: '1.5px', marginBottom: '6px',
            background: 'linear-gradient(90deg, #16a34a, #4ade80, #16a34a)',
            borderRadius: '2px',
          }} />

          {/* Designation row — single line */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            marginBottom: showEmail ? '5px' : 0,
          }}>
            <svg width="12" height="12" fill="#16a34a" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <span style={{
              fontSize: '0.69rem', fontWeight: 600, color: '#374151',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              flex: 1, minWidth: 0,
            }}>
              {roleLabel ? `${roleLabel} · ${member.designation}` : member.designation}
            </span>
          </div>

          {/* Email row — single line, clickable */}
          {showEmail && (
            <a
              href={`mailto:${member.email}`}
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                textDecoration: 'none',
              }}
            >
              <svg width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2"
                viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span style={{
                fontSize: '0.65rem', color: '#16a34a',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                flex: 1, minWidth: 0,
                textDecoration: 'underline',
                textDecorationColor: 'transparent',
                transition: 'text-decoration-color 0.2s',
              }}
                className="hover:underline"
              >{member.email}</span>
            </a>
          )}

        </div>
      </article>
    </Link>
  );
}
