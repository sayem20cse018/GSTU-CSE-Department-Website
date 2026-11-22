/**
 * GSTU CSE — Faculty Profile Card
 * Exact recreation of the new reference image:
 *
 * WHITE card, rounded corners
 * ├── TOP: green gradient photo area
 * │    ├── dot pattern top-left & bottom-right
 * │    ├── green curved side accents (left & right)
 * │    └── portrait photo — face fully clean
 * └── BOTTOM: white info section
 *      ├── 👤 Dr. Name (bold, one line)
 *      ├── 🎓 Designation / Role
 *      └── ✉  Email
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
  const initials  = getInitials(member.name);
  const href      = profileHref(member);
  const showEmail = !!(
    member.email &&
    member.email.includes('@') &&
    !/^faculty-\d+@/i.test(member.email)
  );
  const displayName = `${member.title ? member.title + ' ' : ''}${member.name}`;

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article
        className="group-hover:-translate-y-1 group-hover:shadow-2xl"
        style={{
          background: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: '1.5px solid #e2e8f0',
        }}
      >

        {/* ═══════════════════════════════════════════
            PHOTO SECTION — green gradient background
        ═══════════════════════════════════════════ */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #16a34a 0%, #4ade80 60%, #86efac 100%)',
          overflow: 'hidden',
          aspectRatio: '1 / 1.05',
        }}>

          {/* dot pattern — top left */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '8px', left: '8px',
            width: '52px', height: '52px', zIndex: 2, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1.2px, transparent 1.2px)',
            backgroundSize: '8px 8px',
          }} />

          {/* dot pattern — bottom right */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: '8px', right: '8px',
            width: '52px', height: '52px', zIndex: 2, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1.2px, transparent 1.2px)',
            backgroundSize: '8px 8px',
          }} />

          {/* left curved green accent */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: '-18px', top: '50%',
            transform: 'translateY(-50%)',
            width: '36px', height: '100px',
            background: 'rgba(21,128,61,0.55)',
            borderRadius: '0 60px 60px 0',
            zIndex: 2,
          }} />

          {/* right curved green accent */}
          <div aria-hidden="true" style={{
            position: 'absolute', right: '-18px', top: '50%',
            transform: 'translateY(-50%)',
            width: '36px', height: '100px',
            background: 'rgba(21,128,61,0.55)',
            borderRadius: '60px 0 0 60px',
            zIndex: 2,
          }} />

          {/* white inner frame around photo */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '18px',
            border: '3px solid rgba(255,255,255,0.75)',
            zIndex: 3,
            pointerEvents: 'none',
          }} />

          {/* PHOTO — fills entire area, nothing on face */}
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
                zIndex: 1,
              }}
              className="group-hover:scale-105"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
            }}>
              <span style={{
                fontSize: '3rem', fontWeight: 900,
                color: 'white', userSelect: 'none',
              }}>{initials}</span>
            </div>
          )}

          {/* optional status badge — very bottom, not on face */}
          {badge && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
              padding: '4px 0', textAlign: 'center',
              fontSize: '8px', fontWeight: 900, color: 'white',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: (badgeColor ?? '#d97706') + 'ee',
            }}>{badge}</div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            INFO SECTION — white background
        ═══════════════════════════════════════════ */}
        <div style={{
          background: 'white',
          padding: '14px 14px 14px 14px',
          borderTop: '2px solid #dcfce7',
        }}>

          {/* Name row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
            {/* person icon */}
            <span style={{ color: '#16a34a', flexShrink: 0, marginTop: '1px' }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </span>
            <h3
              className="group-hover:text-green-700"
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#14532d',
                lineHeight: 1.3,
                transition: 'color 0.2s',
                /* single line truncate */
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
              }}
            >
              {displayName}
            </h3>
          </div>

          {/* thin green divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, #16a34a, #4ade80, #16a34a)',
            marginBottom: '7px',
            borderRadius: '1px',
          }} />

          {/* Designation row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <span style={{ color: '#16a34a', flexShrink: 0 }}>
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </span>
            <p style={{
              fontSize: '0.72rem', fontWeight: 600, color: '#374151',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1, minWidth: 0,
            }}>
              {/* Show roleLabel (Chairman/Dean) if present, then designation */}
              {roleLabel ? `${roleLabel} · ${member.designation}` : member.designation}
            </p>
          </div>

          {/* Email row */}
          {showEmail && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#16a34a', flexShrink: 0 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              <p style={{
                fontSize: '0.68rem', color: '#6b7280',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                flex: 1, minWidth: 0,
              }}>
                {member.email}
              </p>
            </div>
          )}

        </div>
      </article>
    </Link>
  );
}
