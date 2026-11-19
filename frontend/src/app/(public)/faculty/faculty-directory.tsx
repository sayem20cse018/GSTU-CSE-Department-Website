'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getBadgeStyle,
  getInitials,
  isOnLeave,
  groupByDesignation,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

interface Props {
  members: FacultyMember[];
}

export default function FacultyDirectory({ members }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const haystack = [
        m.name,
        m.title ?? '',
        m.designation,
        m.email ?? '',
        m.officeRoom ?? '',
        m.shortBio ?? '',
        ...m.researchInterests,
        ...m.courses,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, members]);

  const groups = useMemo(() => groupByDesignation(filtered), [filtered]);

  return (
    <>
      {/* Search + count */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, designation, research area…"
            aria-label="Search faculty"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 transition"
          />
        </div>
        <span className="text-sm font-medium text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'member' : 'members'}
        </span>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3" aria-hidden="true">
            🔍
          </span>
          <p className="text-slate-500 font-medium">
            No faculty members match &ldquo;{query}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map(({ designation, members: list }) => (
            <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
              <div className="flex items-center gap-3 mb-6">
                <h2
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  {designation}
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {list.length}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {list.map((member, i) => (
                  <FacultyCard key={member.id} member={member} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const badge = getBadgeStyle(member.designation);
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const onLeave = isOnLeave(member);
  const showEmail =
    member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <article className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Photo — contained (full photo, no aggressive crop) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt={member.name}
            className="absolute inset-0 h-full w-full object-contain object-top"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
          >
            <span className="text-5xl font-black text-white select-none">
              {initials}
            </span>
          </div>
        )}
        {onLeave && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/90 text-white shadow">
            On Leave
          </span>
        )}
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: 'linear-gradient(90deg,#166534,#1a7a3c)' }}
          aria-hidden="true"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span
          className="inline-block self-start text-[10px] font-bold px-2 py-0.5 rounded-md"
          style={{ background: badge.bg, color: badge.text }}
        >
          {member.designation}
        </span>

        <h3 className="mt-2 font-bold text-slate-900 group-hover:text-green-700 transition leading-tight">
          <Link href={href} className="hover:underline">
            {member.title ? `${member.title} ` : ''}
            {member.name}
          </Link>
        </h3>

        {member.shortBio && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{member.shortBio}</p>
        )}

        {member.researchInterests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.researchInterests.slice(0, 3).map((r) => (
              <span key={r} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {r}
              </span>
            ))}
          </div>
        )}

        {showEmail && (
          <a
            href={`mailto:${member.email}`}
            className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-700 transition truncate"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{member.email}</span>
          </a>
        )}

        <Link
          href={href}
          className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:text-green-900 transition group/link"
        >
          View Profile
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
