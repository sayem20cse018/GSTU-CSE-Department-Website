'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  all: FacultyMember[]; // every valid, active record for this dept
}

type Tab = 'active' | 'on_leave' | 'chairman' | 'staff';

const TAB_CONFIG: { key: Tab; label: string }[] = [
  { key: 'active',   label: 'Active Faculty' },
  { key: 'on_leave', label: 'On Leave' },
  { key: 'chairman', label: 'Chairman' },
  { key: 'staff',    label: 'Staff & Officers' },
];

export default function FacultyDirectory({ all }: Props) {
  const [tab, setTab] = useState<Tab>('active');
  const [query, setQuery] = useState('');

  // ── Partition ────────────────────────────────────────────────────────────
  const activeFaculty = useMemo(() =>
    all.filter(m => m.staffType === 'faculty' && !isOnLeave(m)), [all]);

  const onLeaveFaculty = useMemo(() =>
    all.filter(m => m.staffType === 'faculty' && isOnLeave(m)), [all]);

  const chairmanList = useMemo(() =>
    all.filter(m => m.staffType === 'chairman' || m.staffType === 'dean'), [all]);

  const staffList = useMemo(() =>
    all.filter(m => m.staffType === 'staff' || m.staffType === 'officer'), [all]);

  const counts: Record<Tab, number> = useMemo(() => ({
    active:   activeFaculty.length,
    on_leave: onLeaveFaculty.length,
    chairman: chairmanList.length,
    staff:    staffList.length,
  }), [activeFaculty, onLeaveFaculty, chairmanList, staffList]);

  // ── Search (applies to faculty tabs; chairman/staff have their own layout) ─
  const baseList = useMemo(() => {
    if (tab === 'active')   return activeFaculty;
    if (tab === 'on_leave') return onLeaveFaculty;
    return [];
  }, [tab, activeFaculty, onLeaveFaculty]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return baseList;
    return baseList.filter(m => [
      m.name, m.title ?? '', m.designation, m.email ?? '',
      m.officeRoom ?? '', m.shortBio ?? '',
      ...m.researchInterests, ...m.courses,
    ].join(' ').toLowerCase().includes(q));
  }, [baseList, query]);

  const groups = useMemo(() =>
    groupByDesignation(sortBySeniority(filtered)), [filtered]);

  return (
    <div>
      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 mb-8 border-b border-slate-200 pb-0">
        {TAB_CONFIG.map(t => (
          <button key={t.key} type="button" onClick={() => { setTab(t.key); setQuery(''); }}
            className="relative px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px"
            style={tab === t.key
              ? { borderBottomColor: '#166534', color: '#166534' }
              : { borderBottomColor: 'transparent', color: '#64748b' }}>
            {t.label}
            {counts[t.key] > 0 && (
              <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={tab === t.key
                  ? { background: '#166534', color: '#fff' }
                  : { background: '#e2e8f0', color: '#64748b' }}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Active Faculty / On Leave — search + grouped grid ───────── */}
      {(tab === 'active' || tab === 'on_leave') && (
        <>
          <div className="relative max-w-md mb-8">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, designation, research area…"
              aria-label="Search faculty"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 transition"/>
          </div>

          {groups.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3" aria-hidden="true">
                {tab === 'on_leave' ? '✈️' : '🔍'}
              </span>
              <p className="text-slate-500 font-medium">
                {query
                  ? `No faculty match "${query}".`
                  : tab === 'on_leave'
                  ? 'No faculty members are currently on leave.'
                  : 'No active faculty members found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map(({ designation, members: list }) => (
                <section key={designation} id={designation.replace(/\s+/g, '-').toLowerCase()}>
                  <SectionHeading label={designation} count={list.length} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
                    {list.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Chairman tab ─────────────────────────────────────────────── */}
      {tab === 'chairman' && (
        <ChairmanSection members={chairmanList} />
      )}

      {/* ── Staff & Officers tab ─────────────────────────────────────── */}
      {tab === 'staff' && (
        <StaffSection members={staffList} />
      )}
    </div>
  );
}

// ─── Chairman: Running + Former sections ──────────────────────────────────────

function ChairmanSection({ members }: { members: FacultyMember[] }) {
  const running = members.filter(m => m.isCurrentChairman || m.leadershipRole === 'running_chairman');
  const former  = members
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      // Sort former by chairmanFrom descending (most recent first)
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 0;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 0;
      return by - ay;
    });

  return (
    <div className="space-y-10">
      {/* Running Chairman */}
      <section>
        <SectionHeading label="Running Chairman" />
        {running.length === 0 ? (
          <p className="text-slate-400 text-sm py-6">No current chairman record found. Admin can assign a Running Chairman from the admin panel.</p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {running.map((m, i) => (
              <ChairmanCard key={m.id} member={m} index={i} isCurrent />
            ))}
          </div>
        )}
      </section>

      {/* Former Chairmen */}
      {former.length > 0 && (
        <section>
          <SectionHeading label="Former Chairmen" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {former.map((m, i) => (
              <ChairmanCard key={m.id} member={m} index={i} isCurrent={false} />
            ))}
          </div>
        </section>
      )}

      <div className="pt-2">
        <Link href="/faculty/heads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition group">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          View Honorable Heads of the Department
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

function ChairmanCard({ member, index, isCurrent }: { member: FacultyMember; index: number; isCurrent: boolean }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const period = formatServicePeriod(member.chairmanFrom, isCurrent ? null : member.chairmanTo);
  const showEmail = member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <Link href={href} className="group block">
      <article className={`flex gap-4 bg-white border rounded-xl p-4 hover:shadow-md transition-all ${isCurrent ? 'border-green-200 shadow-sm' : 'border-slate-200'}`}>
        {/* Square photo */}
        <div className={`shrink-0 overflow-hidden bg-slate-100 ${isCurrent ? 'w-24 h-24 rounded-xl' : 'w-16 h-16 rounded-lg'}`}>
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo} alt={member.name} className="w-full h-full object-contain object-top"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {isCurrent && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
              Current Chairman
            </span>
          )}
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 leading-snug transition">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <span className="mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
            style={{ background: badge.bg, color: badge.text }}>
            {member.designation}
          </span>
          {period && (
            <p className="text-[11px] text-slate-500 mt-1">
              <span className="font-semibold">Service:</span> {period}
            </p>
          )}
          {showEmail && (
            <p className="text-[10px] text-slate-400 truncate mt-1">{member.email}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Staff & Officers section ─────────────────────────────────────────────────

function StaffSection({ members }: { members: FacultyMember[] }) {
  if (members.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-3" aria-hidden="true">🏢</span>
        <p className="text-slate-500 font-medium">No staff or officer records found.</p>
      </div>
    );
  }
  const staff   = sortBySeniority(members.filter(m => m.staffType === 'staff'));
  const officer = sortBySeniority(members.filter(m => m.staffType === 'officer'));

  return (
    <div className="space-y-10">
      {staff.length > 0 && (
        <section>
          <SectionHeading label="Staff" count={staff.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
            {staff.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
          </div>
        </section>
      )}
      {officer.length > 0 && (
        <section>
          <SectionHeading label="Officers" count={officer.length} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
            {officer.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Shared presentational components ────────────────────────────────────────

function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">{label}</h2>
        {count !== undefined && (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      <div className="mt-1.5 h-0.5 w-full" style={{ background: '#c0392b' }} />
    </div>
  );
}

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const badge = getBadgeStyle(member.designation);
  const onLeave = isOnLeave(member);
  const showEmail = member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <Link href={href} className="group block" aria-label={`${member.name} — ${member.designation}`}>
      <article className="flex flex-col items-center text-center">
        <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-slate-100 border border-slate-200 group-hover:border-green-400 group-hover:shadow-md transition-all">
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo} alt={member.name} className="absolute inset-0 w-full h-full object-contain object-top"/>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
          {onLeave && (
            <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
              style={{ background: '#d97706', color: '#fff' }}>On Leave</span>
          )}
        </div>
        <div className="mt-2 w-full px-0.5">
          <p className="text-xs font-bold text-slate-900 group-hover:text-green-700 transition leading-snug line-clamp-2">
            {member.title ? `${member.title} ` : ''}{member.name}
          </p>
          <span className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-sm leading-none"
            style={{ background: badge.bg, color: badge.text }}>
            {member.designation}
          </span>
          {showEmail && <p className="mt-1 text-[9px] text-slate-500 truncate w-full">{member.email}</p>}
        </div>
      </article>
    </Link>
  );
}
