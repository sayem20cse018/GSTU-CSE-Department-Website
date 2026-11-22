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
  const initials  = getInitials(member.name);
  const href      = profileHref(member);
  const showEmail = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));
  const displayName = `${member.title ? member.title + ' ' : ''}${member.name}`;

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article
        className="group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.09)',
          border: '1.5px solid #e2e8f0',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
      >

        {/* ── PHOTO AREA ── green bg, dots only in corners (outside photo) ── */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(160deg,#16a34a 0%,#4ade80 70%,#86efac 100%)',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
        }}>

          {/* dot pattern — top-left corner only, small so it stays in corner */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: 0,
            width: '44px', height: '44px',
            zIndex: 3, pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '7px 7px',
          }} />

          {/* dot pattern — bottom-right corner only */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '44px', height: '44px',
            zIndex: 3, pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '7px 7px',
          }} />

          {/* PHOTO — full area, nothing on the face, zIndex=1 */}
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
                zIndex: 1,
                display: 'block',
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
                fontSize: '2.5rem', fontWeight: 900,
                color: 'white', userSelect: 'none',
              }}>{initials}</span>
            </div>
          )}

          {badge && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
              padding: '3px 0', textAlign: 'center',
              fontSize: '8px', fontWeight: 900, color: 'white',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: (badgeColor ?? '#d97706') + 'ee',
            }}>{badge}</div>
          )}
        </div>

        {/* ── INFO SECTION ── */}
        <div style={{
          padding: '10px 12px 11px',
          borderTop: '2px solid #dcfce7',
          background: 'white',
        }}>

          {/* Name — one line, bold, small font, truncate */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px' }}>
            <svg width="11" height="11" fill="#16a34a" viewBox="0 0 24 24" style={{flexShrink:0}}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <span
              className="group-hover:text-green-700"
              style={{
                fontSize: '0.72rem', fontWeight: 800, color: '#14532d',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                transition: 'color 0.2s', flex: 1, minWidth: 0,
              }}
            >{displayName}</span>
          </div>

          {/* thin divider */}
          <div style={{
            height: '1px', marginBottom: '5px',
            background: 'linear-gradient(90deg,#16a34a,#4ade80,#16a34a)',
          }} />

          {/* Designation — one line */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom: showEmail ? '4px' : 0 }}>
            <svg width="11" height="11" fill="#16a34a" viewBox="0 0 24 24" style={{flexShrink:0}}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <span style={{
              fontSize: '0.67rem', fontWeight: 600, color: '#374151',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              flex: 1, minWidth: 0,
            }}>
              {roleLabel ? `${roleLabel} · ${member.designation}` : member.designation}
            </span>
          </div>

          {/* Email — one line */}
          {showEmail && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <svg width="11" height="11" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span style={{
                fontSize: '0.63rem', color: '#6b7280',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                flex: 1, minWidth: 0,
              }}>{member.email}</span>
            </div>
          )}

        </div>
      </article>
    </Link>
  );
}
