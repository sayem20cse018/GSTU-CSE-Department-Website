import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  getInitials, getBadgeStyle, profileHref,
  formatServicePeriod, isValidFacultyRecord,
  AVATAR_GRADIENTS, type FacultyMember,
} from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Honorable Heads of the Department — GSTU CSE',
  description:
    'Former Heads of the Department of Computer Science and Engineering, GSTU — a distinguished academic legacy.',
};

export default async function HeadsPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <>
        <SectionHero tag="Leadership" title="Honorable Heads of the Department"
          breadcrumbs={[{label:'Home',href:'/'},{label:'Faculty & Staff',href:'/faculty'},{label:'Heads'}]}/>
        <main className="bg-white section-py"><div className="container-custom max-w-4xl">
          <FacultyLoadError title="Couldn't load records" />
        </div></main>
      </>
    );
  }

  // Former Heads: staffType=chairman + leadershipRole=former_head, sorted chronologically
  const heads = result.members
    .filter(m =>
      isValidFacultyRecord(m) &&
      m.leadershipRole === 'former_head',
    )
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 0;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 0;
      return by - ay; // most recent first
    });

  return (
    <>
      <SectionHero
        tag="Leadership"
        title="Honorable Heads of the Department"
        description="A distinguished record of academic leadership at the Department of Computer Science and Engineering, GSTU."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Faculty & Staff', href: '/faculty' },
          { label: 'Honorable Heads' },
        ]}
      />

      <main className="bg-white section-py">
        <div className="container-custom max-w-5xl">

          {heads.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3" aria-hidden="true">🏛️</span>
              <p className="text-slate-500 font-medium">
                No former Head of Department records have been added yet.
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Admin can assign the &ldquo;Former Head of the Department&rdquo; role from the admin panel.
              </p>
            </div>
          ) : (
            <>
              {/* BUET-style academic listing */}
              <div className="divide-y divide-slate-100">
                {heads.map((m, i) => (
                  <HeadRow key={m.id} member={m} index={i} serial={i + 1} />
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-8 text-center">
                {heads.length} former Head{heads.length !== 1 ? 's' : ''} listed · most recent first
              </p>
            </>
          )}

          <div className="border-t border-slate-100 mt-10 pt-6">
            <Link href="/faculty"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-900 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Faculty & Staff
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

function HeadRow({ member: m, index, serial }:
  { member: FacultyMember; index: number; serial: number }) {
  const initials = getInitials(m.name);
  const href = profileHref(m);
  const badge = getBadgeStyle(m.designation);
  const period = formatServicePeriod(m.chairmanFrom, m.chairmanTo);

  return (
    <Link href={href} className="group block py-6 first:pt-0">
      <article className="flex gap-5 items-start">
        {/* Serial number */}
        <span className="shrink-0 w-8 text-sm font-bold text-slate-300 text-right pt-1">
          {serial}.
        </span>

        {/* Square photo */}
        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-green-300 transition">
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo} alt={m.name} className="w-full h-full object-contain object-top"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-900 group-hover:text-green-700 transition leading-snug">
            {m.title ? `${m.title} ` : ''}{m.name}
          </h2>
          <span className="mt-1 inline-block text-[11px] font-bold px-2 py-0.5 rounded-sm"
            style={{ background: badge.bg, color: badge.text }}>
            {m.designation}
          </span>
          <p className="text-xs font-semibold text-slate-500 mt-1.5 uppercase tracking-wide">
            Former Head of the Department
          </p>
          {period && (
            <p className="text-xs text-slate-600 mt-1">
              <span className="font-semibold">Service Period:</span>{' '}
              <span className="text-green-700 font-semibold">{period}</span>
            </p>
          )}
          {m.shortBio && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 max-w-xl">{m.shortBio}</p>
          )}
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </article>
    </Link>
  );
}
