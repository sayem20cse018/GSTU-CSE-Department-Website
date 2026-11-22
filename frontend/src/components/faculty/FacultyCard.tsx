'use client';
/**
 * GSTU CSE — Faculty Profile Card
 * 'use client' needed for hover state management
 *
 * Photo area  : green gradient bg
 *               dots corners (zIndex 0 — behind photo)
 *               white inner ring (zIndex 0 — behind photo)
 *               curved side accents (zIndex 0 — behind photo)
 *               PHOTO (zIndex 10 — face 100% clean)
 * Info area   : white bg, no divider line
 *               person icon + bold name (1 line)
 *               graduation icon + designation
 *               email icon + email (clickable mailto)
 */
import { useState } from 'react';
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
  const [hovered, setHovered] = useState(false);
  const initials    = getInitials(member.name);
  const href        = profileHref(member);
  const showEmail   = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));
  const displayName = `${member.title ? member.title + ' ' : ''}${member.name}`;

  return (
    <Link
      href={href}
      aria-label={`View profile of ${member.name}`}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.09)',
        border: '1.5px solid #e2e8f0',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}>

        {/* ── PHOTO AREA ── */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(160deg,#16a34a 0%,#4ade80 65%,#86efac 100%)',
          aspectRatio: '1 / 1.05',
          overflow: 'hidden',
        }}>

          {/* dots top-left — zIndex 0, behind photo */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: 0,
            width: '44px', height: '44px', zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.65) 1.2px, transparent 1.2px)',
            backgroundSize: '7px 7px',
          }} />

          {/* dots bottom-right — zIndex 0 */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '44px', height: '44px', zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.65) 1.2px, transparent 1.2px)',
            backgroundSize: '7px 7px',
          }} />

          {/* left curved accent — zIndex 0 */}
          <div aria-hidden="true" style={{
            position: 'absolute', left: '-14px', top: '50%',
            transform: 'translateY(-50%)',
            width: '28px', height: '80px',
            background: 'rgba(21,128,61,0.55)',
            borderRadius: '0 40px 40px 0',
            zIndex: 0,
          }} />

          {/* right curved accent — zIndex 0 */}
          <div aria-hidden="true" style={{
            position: 'absolute', right: '-14px', top: '50%',
            transform: 'translateY(-50%)',
            width: '28px', height: '80px',
            background: 'rgba(21,128,61,0.55)',
            borderRadius: '40px 0 0 40px',
            zIndex: 0,
          }} />

          {/* white inner ring — zIndex 0 */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '10px',
            borderRadius: '14px',
            border: '3px solid rgba(255,255,255,0.7)',
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          {/* PHOTO — zIndex 10, face clean */}
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                zIndex: 10, display: 'block',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.4s ease',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
            }}>
              <span style={{ fontSize: '2.6rem', fontWeight: 900, color: 'white', userSelect: 'none' }}>
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

        {/* ── INFO AREA ── white, clean, no divider */}
        <div style={{
          padding: '10px 12px 12px',
          background: 'white',
          borderTop: '1.5px solid #dcfce7',
        }}>

          {/* 👤 Name — bold, 1 line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" style={{ flexShrink: 0 }}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <span style={{
              fontSize: '0.75rem', fontWeight: 800,
              color: hovered ? '#15803d' : '#14532d',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              flex: 1, minWidth: 0,
              transition: 'color 0.2s',
            }}>
              {displayName}
            </span>
          </div>

          {/* 🎓 Designation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: showEmail ? '5px' : 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" style={{ flexShrink: 0 }}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <span style={{
              fontSize: '0.69rem', fontWeight: 500, color: '#4b5563',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              flex: 1, minWidth: 0,
            }}>
              {roleLabel ? `${roleLabel} · ${member.designation}` : member.designation}
            </span>
          </div>

          {/* ✉ Email — clickable mailto */}
          {showEmail && (
            <a
              href={`mailto:${member.email}`}
              onClick={e => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span style={{
                fontSize: '0.65rem', color: '#6b7280',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                flex: 1, minWidth: 0,
              }}>
                {member.email}
              </span>
            </a>
          )}

        </div>
      </article>
    </Link>
  );
}
