'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getBadgeStyle,
  getInitials,
  isOnLeave,
  groupByDesignation,
  sortBySeniority,
  formatServicePeriod,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

interface Props {
  all: FacultyMember[];
  /** Which tab to show on first render */
  defaultTab?: Tab;
}

type Tab = 'active' | 'on_leave' | 'chairman' | 'staff';

const TAB_CONFIG: { key: Tab; label: string; href: string }[] = [
  { key: 'active',   label: 'Active Faculty',  href: '/faculty' },
  { key: 'on_leave', label: 'On Leave',         href: '/faculty/on_leave' },
  { key: 'chairman', label: 'Ex Chairman',      href: '/faculty/ex_chairman' },
  { key: 'staff',    label: 'Staff & Officers', href: '/officer_staff' },
];

export default function FacultyDirectory({ all, defaultTab = 'active' }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [query, setQuery] = useState('');

  // ── Partition ────────────────────────────────────────────────────────────
  const activeFaculty = useMemo(
    () => all.filter(m => m.staffType === 'faculty' && !isOnLeave(m) && m.isActive !== false),
    [all],
  );
  const onLeaveFaculty = useMemo(
    () => all.filter(m => m.staffType === 'faculty' && isOnLeave(m)),
    [all],
  );
  const chairmanList = useMemo(
    () => all.filter(m => m.staffType === 'chairman' || m.staffType === 'dean'),
    [all],
  );
  const staffList = useMemo(
    () => all.filter(m => m.staffType === 'staff' || m.staffType === 'officer'),
    [all],
  );

  const counts: Record<Tab, number> = useMemo(() => ({
    active:   activeFaculty.length,
    on_leave: onLeaveFaculty.length,
    chairman: chairmanList.length,
    staff:    staffList.length,
  }), [activeFaculty, onLeaveFaculty, chairmanList, staffList]);

  // ── Search (applies to faculty tabs only) ────────────────────────────────
  const baseList = useMemo(() => {
    if (tab === 'active')   return activeFaculty;
    if (tab === 'on_leave') return onLeaveFaculty;
    return [];
  }, [tab, activeFaculty, onLeaveFaculty]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return baseList;
    return baseList.filter(m =>
      [m.name, m.title ?? '', m.designation, m.email ?? '',
       m.officeRoom ?? '', m.shortBio ?? '',
       ...m.researchInterests, ...m.courses]
        .join(' ').toLowerCase().includes(q),
    );
  }, [baseList, query]);

  const groups = useMemo(
    () => groupByDesignation(sortBySeniority(filtered)),
    [filtered],
  );

  return (
    <div>
      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0 mb-8 border-b-2 border-slate-100">
        {TAB_CONFIG.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => { setTab(t.key); setQuery(''); }}
              className="relative px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-0.5 whitespace-nowrap"
              style={active
                ? { borderBottomColor: '#166534', color: '#166534', background: 'transparent' }
                : { borderBottomColor: 'transparent', color: '#64748b' }
              }
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span
                  className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={active
                    ? { background: '#166534', color: '#fff' }
                    : { background: '#e2e8f0', color: '#64748b' }
                  }
                >
                  {counts[t.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active Faculty ───────────────────────────────────────────── */}
      {tab === 'active' && (
        <FacultyTabContent
          members={activeFaculty}
          filtered={filtered}
          groups={groups}
          query={query}
          onQuery={setQuery}
          emptyIcon="👨‍🏫"
          emptyText="No active faculty members found."
          noMatchText="No active faculty match"
        />
      )}

      {/* ── On Leave ─────────────────────────────────────────────────── */}
      {tab === 'on_leave' && (
        <FacultyTabContent
          members={onLeaveFaculty}
          filtered={filtered}
          groups={groups}
          query={query}
          onQuery={setQuery}
          emptyIcon="✈️"
          emptyText="No faculty members are currently on leave."
          noMatchText="No on-leave faculty match"
        />
      )}

      {/* ── Chairman ─────────────────────────────────────────────────── */}
      {tab === 'chairman' && (
        <ChairmanSection members={chairmanList} />
      )}

      {/* ── Staff & Officers ─────────────────────────────────────────── */}
      {tab === 'staff' && (
        <StaffSection members={staffList} />
      )}
    </div>
  );
}

// ─── Shared faculty grid tab (Active / On Leave) ──────────────────────────────

interface FacultyTabContentProps {
  members: FacultyMember[];
  filtered: FacultyMember[];
  groups: { designation: string; members: FacultyMember[] }[];
  query: string;
  onQuery: (q: string) => void;
  emptyIcon: string;
  emptyText: string;
  noMatchText: string;
}

function FacultyTabContent({
  filtered, groups, query, onQuery,
  emptyIcon, emptyText, noMatchText,
}: FacultyTabContentProps) {
  return (
    <>
      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => onQuery(e.target.value)}
          placeholder="Search by name, designation, research area…"
          aria-label="Search faculty"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
        />
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4" aria-hidden="true">{query ? '🔍' : emptyIcon}</span>
          <p className="text-slate-500 font-medium">
            {query ? `${noMatchText} "${query}".` : emptyText}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ designation, members: list }) => (
            <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
              <SectionHeading label={designation} count={list.length} />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
                {list.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Chairman section ─────────────────────────────────────────────────────────

function ChairmanSection({ members }: { members: FacultyMember[] }) {
  const running = members.filter(
    m => m.isCurrentChairman || m.leadershipRole === 'running_chairman',
  );
  const former = members
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 0;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 0;
      return by - ay;
    });

  return (
    <div className="space-y-10">
      <section>
        <SectionHeading label="Running Chairman" />
        {running.length === 0 ? (
          <p className="text-slate-400 text-sm py-6">
            No current chairman assigned. Set one from the admin panel.
          </p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {running.map((m, i) => <ChairmanCard key={m.id} member={m} index={i} isCurrent />)}
          </div>
        )}
      </section>

      {former.length > 0 && (
        <section>
          <SectionHeading label="Former Chairmen" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {former.map((m, i) => <ChairmanCard key={m.id} member={m} index={i} isCurrent={false} />)}
          </div>
        </section>
      )}

      <div className="pt-2">
        <Link
          href="/faculty/heads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition group"
        >
          View Honorable Heads of the Department
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ─── Staff & Officers section ─────────────────────────────────────────────────

function StaffSection({ members }: { members: FacultyMember[] }) {
  const staff   = sortBySeniority(members.filter(m => m.staffType === 'staff'));
  const officer = sortBySeniority(members.filter(m => m.staffType === 'officer'));

  if (members.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl block mb-4" aria-hidden="true">🏢</span>
        <p className="text-slate-500 font-medium">No staff or officer records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {staff.length > 0 && (
        <section>
          <SectionHeading label="Staff" count={staff.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
            {staff.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
          </div>
        </section>
      )}
      {officer.length > 0 && (
        <section>
          <SectionHeading label="Officers" count={officer.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7">
            {officer.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Shared heading ───────────────────────────────────────────────────────────

function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
        {count !== undefined && (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="mt-2 h-px w-full bg-slate-200" />
    </div>
  );
}

// ─── Faculty grid card — premium academic design ──────────────────────────────

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const onLeave = isOnLeave(member);
  const showEmail =
    member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <Link href={href} className="group block" aria-label={`${member.name} — ${member.designation}`}>
      <article className="flex flex-col">
        {/* Photo container — 4:5 portrait ratio */}
        <div className="relative w-full overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-green-500 group-hover:shadow-lg transition-all duration-300"
          style={{ aspectRatio: '4/5', borderRadius: '6px' }}>
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
            >
              <span className="text-3xl font-black text-white/90 tracking-tight">{initials}</span>
            </div>
          )}

          {/* On leave ribbon */}
          {onLeave && (
            <div className="absolute top-0 right-0 overflow-hidden" style={{ width: 56, height: 56 }}>
              <div className="absolute text-[8px] font-black text-white text-center leading-tight py-0.5 px-0 w-20 -right-4 top-3 rotate-45"
                style={{ background: '#d97706' }}>
                ON LEAVE
              </div>
            </div>
          )}

          {/* Bottom gradient for readability */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"/>
        </div>

        {/* Info below photo */}
        <div className="mt-2.5 px-0.5">
          <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-green-700 transition-colors duration-200 leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </h3>
          <span
            className="mt-1.5 inline-block text-[9px] font-bold px-2 py-0.5 rounded leading-none"
            style={{ background: badge.bg, color: badge.text }}
          >
            {member.designation}
          </span>
          {showEmail && (
            <p className="mt-1 text-[9px] text-slate-400 truncate">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Chairman card ────────────────────────────────────────────────────────────

function ChairmanCard({
  member, index, isCurrent,
}: { member: FacultyMember; index: number; isCurrent: boolean }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const period = formatServicePeriod(member.chairmanFrom, isCurrent ? null : member.chairmanTo);
  const showEmail =
    member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <Link href={href} className="group block">
      <article className={`flex gap-4 rounded-xl p-4 border transition-all hover:shadow-md
        ${isCurrent ? 'border-green-200 bg-green-50/40' : 'border-slate-200 bg-white'}`}>
        <div className={`shrink-0 overflow-hidden rounded-lg bg-slate-100
          ${isCurrent ? 'w-20 h-20' : 'w-14 h-14'}`}>
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo} alt={member.name}
              className="w-full h-full object-contain object-top"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-white select-none text-xl"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {isCurrent && (
            <div className="flex items-center gap-1 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
              <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Current</span>
            </div>
          )}
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition leading-snug">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <span className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: badge.bg, color: badge.text }}>
            {member.designation}
          </span>
          {period && (
            <p className="text-[10px] text-slate-500 mt-1">Service: {period}</p>
          )}
          {showEmail && (
            <p className="text-[9px] text-slate-400 truncate mt-0.5">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
