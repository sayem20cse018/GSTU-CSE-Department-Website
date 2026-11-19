'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getBadgeStyle,
  getInitials,
  isOnLeave,
  isChairman,
  isDean,
  groupByDesignation,
  sortBySeniority,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

interface Props {
  members: FacultyMember[];
}

type StatusTab = 'all' | 'active' | 'on_leave';

const TAB_LABELS: Record<StatusTab, string> = {
  all: 'All Faculty',
  active: 'Active',
  on_leave: 'On Leave',
};

export default function FacultyDirectory({ members }: Props) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<StatusTab>('all');

  // Split out special roles — shown in their own sections regardless of tab
  const dean = useMemo(() => members.filter((m) => isDean(m)), [members]);
  const chairman = useMemo(() => members.filter((m) => isChairman(m)), [members]);
  // Regular faculty (not chairman / dean)
  const regularFaculty = useMemo(
    () => members.filter((m) => !isChairman(m) && !isDean(m)),
    [members],
  );

  // Status-tab filter
  const tabFiltered = useMemo(() => {
    if (tab === 'active') return regularFaculty.filter((m) => !isOnLeave(m));
    if (tab === 'on_leave') return regularFaculty.filter((m) => isOnLeave(m));
    return regularFaculty;
  }, [regularFaculty, tab]);

  // Search filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tabFiltered;
    return tabFiltered.filter((m) => {
      const hay = [
        m.name, m.title ?? '', m.designation,
        m.email ?? '', m.officeRoom ?? '', m.shortBio ?? '',
        ...m.researchInterests, ...m.courses,
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [tabFiltered, query]);

  const groups = useMemo(() => groupByDesignation(sortBySeniority(filtered)), [filtered]);

  const counts = useMemo(() => ({
    all: regularFaculty.length,
    active: regularFaculty.filter((m) => !isOnLeave(m)).length,
    on_leave: regularFaculty.filter((m) => isOnLeave(m)).length,
  }), [regularFaculty]);

  return (
    <div>
      {/* ── Dean section ─────────────────────────────────────────────── */}
      {dean.length > 0 && (
        <div className="mb-10">
          <SectionHeading label="Dean" />
          <div className="flex flex-wrap gap-5">
            {dean.map((m, i) => (
              <HeadCard key={m.id} member={m} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Head of Department ───────────────────────────────────────── */}
      {chairman.length > 0 && (
        <div className="mb-10">
          <SectionHeading label="Head of the Department" />
          <div className="flex flex-wrap gap-5">
            {chairman.map((m, i) => (
              <HeadCard key={m.id} member={m} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs + search ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
          {(Object.keys(TAB_LABELS) as StatusTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={
                tab === t
                  ? { background: '#166534', color: '#fff' }
                  : { color: '#64748b' }
              }
            >
              {TAB_LABELS[t]}
              {counts[t] > 0 && (
                <span
                  className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={
                    tab === t
                      ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                      : { background: '#e2e8f0', color: '#64748b' }
                  }
                >
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, designation, research area…"
            aria-label="Search faculty"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 transition"
          />
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────── */}
      {groups.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3" aria-hidden="true">🔍</span>
          <p className="text-slate-500 font-medium">
            {query
              ? <>No faculty match &ldquo;{query}&rdquo;.</>
              : tab === 'on_leave'
              ? 'No faculty members are currently on leave.'
              : 'No faculty members found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ designation, members: list }) => (
            <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
              <SectionHeading label={designation} count={list.length} />
              {/* JUST CSE-style compact grid: 6 columns on wide, down to 2 on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
                {list.map((member, i) => (
                  <FacultyCard key={member.id} member={member} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section heading (JUST CSE style: bold label + red bottom border) ─────────

function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
          {label}
        </h2>
        {count !== undefined && (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="mt-1.5 h-0.5 w-full" style={{ background: '#c0392b' }} />
    </div>
  );
}

// ─── Head/Dean card: wider, with photo + contact info (like JUST CSE head) ────

function HeadCard({ member, index }: { member: FacultyMember; index: number }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const showEmail =
    member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <Link href={href} className="group block">
      <article className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all w-56">
        {/* Square photo */}
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-contain object-top"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-2xl font-black text-white select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 leading-snug transition truncate">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <span
            className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: badge.bg, color: badge.text }}
          >
            {member.designation}
          </span>
          {showEmail && (
            <p className="mt-1.5 text-[10px] text-slate-500 truncate">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Compact JUST-CSE-style faculty card ──────────────────────────────────────

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const onLeave = isOnLeave(member);
  const showEmail =
    member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <Link href={href} className="group block" aria-label={`${member.name} — ${member.designation}`}>
      <article className="flex flex-col items-center text-center">
        {/* Square photo — consistent size, no cropping */}
        <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-green-400 group-hover:shadow-md transition-all">
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-contain object-top"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              {initials}
            </div>
          )}
          {onLeave && (
            <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
              style={{ background: '#d97706', color: '#fff' }}>
              On Leave
            </span>
          )}
        </div>

        {/* Info below photo */}
        <div className="mt-2 w-full px-0.5">
          <p className="text-xs font-bold text-slate-900 group-hover:text-green-700 transition leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <span
            className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-sm leading-none"
            style={{ background: badge.bg, color: badge.text }}
          >
            {member.designation}
          </span>
          {showEmail && (
            <p className="mt-1 text-[9px] text-slate-500 truncate w-full">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
