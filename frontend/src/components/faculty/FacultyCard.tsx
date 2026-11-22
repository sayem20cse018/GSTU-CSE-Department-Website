'use client';
/**
 * GSTU CSE — Faculty Profile Card
 *
 * Exact recreation of the reference image:
 *
 *  Layer stack (bottom → top):
 *  1. Bright green card background (#22c55e)
 *  2. Dark green offset shadow rectangle behind the photo (bottom-right shifted)
 *  3. White border frame around the photo
 *  4. Portrait photo fills the frame
 *  5. Top-right large white curved decorative shape (overflows card)
 *  6. Bottom-left large white curved decorative shape (overflows card)
 *  7. Bottom-right small dark green rounded rect (decorative accent)
 *  8. Name + designation below
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
  const initials  = getInitials(member.name);
  const href      = profileHref(member);
  const showEmail = !!(member.email?.includes('@') && !/^faculty-\d+@/i.test(member.email ?? ''));

  return (
    <Link href={href} className="group block" aria-label={`View profile of ${member.name}`}>
      <article
        className="relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
        style={{
          background: '#22c55e',
          borderRadius: 20,
          padding: '22px 22px 20px 22px',
          /* overflow visible so corner decorations can bleed out */
          overflow: 'visible',
        }}
      >

        {/* ═══════════════════════════════════════════════════
            LAYER 1 — Top-right white curved shape
            Large white quarter-circle that overflows the card
        ═══════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 80,
            height: 80,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {/* White rounded rectangle / quarter-circle shape */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 64,
              height: 64,
              background: 'white',
              borderRadius: '0 20px 0 100%',
              opacity: 0.92,
            }}
          />
          {/* Thin white curved line behind it */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{ position: 'absolute', top: 0, right: 0 }}
          >
            <path
              d="M80 6 Q74 74 6 80"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M80 22 Q58 74 6 64"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          </svg>
        </div>

        {/* ═══════════════════════════════════════════════════
            LAYER 2 — Bottom-left white curved shape
            Mirror of top-right
        ═══════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 44,   /* above name section */
            left: -2,
            width: 80,
            height: 80,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 64,
              height: 64,
              background: 'white',
              borderRadius: '0 100% 0 20px',
              opacity: 0.92,
            }}
          />
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{ position: 'absolute', bottom: 0, left: 0, transform: 'rotate(180deg)' }}
          >
            <path
              d="M80 6 Q74 74 6 80"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M80 22 Q58 74 6 64"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          </svg>
        </div>

        {/* ═══════════════════════════════════════════════════
            LAYER 3 — Dark green offset shadow rectangle
            Sits behind the white photo frame, shifted down+right
        ═══════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 32,       /* shifted down from photo top */
            left: 30,      /* shifted right */
            right: 14,
            bottom: 52,    /* stops above name section */
            background: '#15803d',
            borderRadius: 14,
            zIndex: 1,
          }}
        />

        {/* ═══════════════════════════════════════════════════
            LAYER 4 — White frame + Photo
        ═══════════════════════════════════════════════════ */}
        <div
          className="relative"
          style={{
            zIndex: 5,
            background: 'white',
            borderRadius: 14,
            padding: 6,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
        >
          {/* Photo */}
          <div
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              aspectRatio: '3 / 4',
              position: 'relative',
              background: '#d1d5db',
            }}
          >
            {member.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center select-none"
                style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
              >
                <span className="text-4xl font-black text-white">{initials}</span>
              </div>
            )}

            {badge && (
              <div
                className="absolute bottom-0 left-0 right-0 py-1 text-center text-[9px] font-black text-white tracking-widest uppercase"
                style={{ background: (badgeColor ?? '#d97706') + 'ee' }}
              >
                {badge}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            LAYER 5 — Bottom-right small dark green accent rect
        ═══════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 50,
            right: 6,
            width: 20,
            height: 36,
            background: '#15803d',
            borderRadius: 6,
            zIndex: 6,
            opacity: 0.85,
          }}
        />

        {/* ═══════════════════════════════════════════════════
            LAYER 6 — Name + Designation + Button
        ═══════════════════════════════════════════════════ */}
        <div
          className="relative text-center"
          style={{ zIndex: 8, marginTop: 14 }}
        >
          <h3
            className="font-bold leading-snug line-clamp-2 group-hover:text-green-100 transition-colors"
            style={{ color: '#fff', fontSize: '0.83rem' }}
          >
            {member.title ? `${member.title} ` : ''}{member.name}
          </h3>

          <p
            className="mt-0.5 font-semibold"
            style={{ color: '#bbf7d0', fontSize: '0.69rem', lineHeight: 1.3 }}
          >
            {member.designation}
          </p>

          {roleLabel && (
            <p style={{ color: '#86efac', fontSize: '0.65rem', marginTop: 2 }}>
              {roleLabel}
            </p>
          )}

          {/* View Profile pill */}
          <div
            className="mt-3 mx-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold transition-all duration-200 group-hover:bg-white group-hover:text-green-700"
            style={{
              background: 'rgba(255,255,255,0.18)',
              color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.45)',
              fontSize: '0.68rem',
            }}
          >
            View Profile
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

      </article>
    </Link>
  );
}
