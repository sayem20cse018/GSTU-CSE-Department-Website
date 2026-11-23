'use client';
import { useState } from 'react';
import Link from 'next/link';
import { getInitials, profileHref, AVATAR_GRADIENTS, type FacultyMember } from '@/lib/faculty/shared';

interface Props {
  member: FacultyMember;
  index: number;
  badge?: string;
  badgeColor?: string;
  roleLabel?: string;
}

export default function FacultyCard({ member, index, badge, badgeColor, roleLabel }: Props) {
  const [hov, setHov] = useState(false);
  const initials    = getInitials(member.name);
  const href        = profileHref(member);
  const showEmail   = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));
  const displayName = `${member.title ? member.title + ' ' : ''}${member.name}`;
  const desigText   = roleLabel ? `${roleLabel} · ${member.designation}` : member.designation;

  return (
    <Link
      href={href}
      style={{ display:'block', textDecoration:'none' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`View profile of ${member.name}`}
    >
      <article style={{
        background:'#fff',
        borderRadius:'18px',
        overflow:'hidden',
        border:'1.5px solid #e2e8f0',
        boxShadow: hov ? '0 12px 36px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.08)',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition:'transform .3s ease, box-shadow .3s ease',
        display:'flex', flexDirection:'column', height:'100%',
      }}>

        {/* ════════════════════════════════════════════
            PHOTO SECTION
            Green gradient bg
            4-SIDE FRAME around the photo (all 4 sides)
            dots in 2 corners (behind photo)
            Photo face 100% clean
        ════════════════════════════════════════════ */}
        <div style={{
          position:'relative',
          background:'linear-gradient(160deg,#16a34a 0%,#4ade80 60%,#86efac 100%)',
          aspectRatio:'3/4',
          overflow:'hidden',
          flexShrink:0,
        }}>

          {/* dot pattern — top-left corner, z:1 behind photo */}
          <div aria-hidden="true" style={{
            position:'absolute', top:0, left:0,
            width:48, height:48, zIndex:1,
            backgroundImage:'radial-gradient(circle,rgba(255,255,255,.65) 1.5px,transparent 1.5px)',
            backgroundSize:'7px 7px', pointerEvents:'none',
          }}/>

          {/* dot pattern — bottom-right corner, z:1 behind photo */}
          <div aria-hidden="true" style={{
            position:'absolute', bottom:0, right:0,
            width:48, height:48, zIndex:1,
            backgroundImage:'radial-gradient(circle,rgba(255,255,255,.65) 1.5px,transparent 1.5px)',
            backgroundSize:'7px 7px', pointerEvents:'none',
          }}/>

          {/* ── 4-SIDE FRAME around photo ──
              Outer dark green border
              then white gap
              then inner lighter green border
              All z:1 → behind photo (z:10)
          */}

          {/* OUTER BORDER — dark green, all 4 sides */}
          <div aria-hidden="true" style={{
            position:'absolute', inset:8,
            borderRadius:14,
            border:'3px solid #15803d',
            zIndex:1, pointerEvents:'none',
          }}/>

          {/* WHITE GAP — creates separation between outer and inner border */}
          <div aria-hidden="true" style={{
            position:'absolute', inset:12,
            borderRadius:11,
            border:'3px solid #fff',
            zIndex:1, pointerEvents:'none',
          }}/>

          {/* INNER BORDER — lighter green, all 4 sides */}
          <div aria-hidden="true" style={{
            position:'absolute', inset:16,
            borderRadius:8,
            border:'2px solid rgba(74,222,128,0.6)',
            zIndex:1, pointerEvents:'none',
          }}/>

          {/* PHOTO — z:10, completely clean, nothing on face */}
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              style={{
                position:'absolute', inset:0,
                width:'100%', height:'100%',
                objectFit:'cover', objectPosition:'center top',
                zIndex:10, display:'block',
                transform: hov ? 'scale(1.05)' : 'scale(1)',
                transition:'transform .45s ease',
              }}
            />
          ) : (
            <div style={{
              position:'absolute', inset:0, zIndex:10,
              display:'flex', alignItems:'center', justifyContent:'center',
              background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
            }}>
              <span style={{ fontSize:'2.5rem', fontWeight:900, color:'#fff', userSelect:'none' }}>
                {initials}
              </span>
            </div>
          )}

          {badge && (
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, zIndex:20,
              padding:'3px 0', textAlign:'center',
              fontSize:'8px', fontWeight:900, color:'#fff',
              letterSpacing:'.08em', textTransform:'uppercase',
              background:(badgeColor??'#d97706')+'ee',
            }}>{badge}</div>
          )}
        </div>

        {/* ════════════════════════════════════════════
            INFO SECTION — clean white, NO design
            just name, designation, email
        ════════════════════════════════════════════ */}
        <div style={{
          padding:'11px 13px 13px',
          background:'#fff',
          borderTop:'2px solid #dcfce7',
          display:'flex', flexDirection:'column', gap:5, flex:1,
        }}>

          {/* Name — bold, 1 line */}
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" style={{ flexShrink:0 }}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <span style={{
              fontSize:'.78rem', fontWeight:800,
              color: hov ? '#15803d' : '#14532d',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              flex:1, minWidth:0, lineHeight:1.3, transition:'color .2s',
            }}>{displayName}</span>
          </div>

          {/* Designation */}
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" style={{ flexShrink:0 }}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <span style={{
              fontSize:'.70rem', fontWeight:500, color:'#4b5563',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              flex:1, minWidth:0, lineHeight:1.3,
            }}>{desigText}</span>
          </div>

          {/* Email */}
          {showEmail && (
            <a
              href={`mailto:${member.email}`}
              style={{ display:'flex', alignItems:'center', gap:7, textDecoration:'none' }}
              onClick={e => e.stopPropagation()}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="#16a34a" strokeWidth="2" style={{ flexShrink:0 }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span style={{
                fontSize:'.66rem', color:'#6b7280',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                flex:1, minWidth:0, lineHeight:1.3,
              }}>{member.email}</span>
            </a>
          )}
        </div>

      </article>
    </Link>
  );
}
