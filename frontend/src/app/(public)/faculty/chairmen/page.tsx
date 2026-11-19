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
  title: 'Chairman — GSTU CSE',
  description: 'Current and former chairmen of the Department of Computer Science and Engineering, GSTU.',
};

export default async function ChairmenPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <>
        <SectionHero tag="Leadership" title="Chairman"
          breadcrumbs={[{label:'Home',href:'/'},{label:'Faculty & Staff',href:'/faculty'},{label:'Chairman'}]}/>
        <main className="bg-white section-py"><div className="container-custom max-w-4xl">
          <FacultyLoadError title="Couldn't load chairman records" />
        </div></main>
      </>
    );
  }

  const chairmen = result.members
    .filter(m => isValidFacultyRecord(m) && (m.staffType === 'chairman' || m.staffType === 'dean'));

  const running = chairmen.filter(m => m.isCurrentChairman || m.leadershipRole === 'running_chairman');
  const former  = chairmen
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 0;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 0;
      return by - ay;
    });

  return (
    <>
      <SectionHero tag="Leadership" title="Chairman"
        description="Current and former chairmen of the Department of Computer Science and Engineering, GSTU."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Faculty & Staff',href:'/faculty'},{label:'Chairman'}]}/>

      <main className="bg-white section-py">
        <div className="container-custom max-w-5xl space-y-12">

          {/* Running Chairman */}
          <section>
            <SectionHeading label="Running Chairman" />
            {running.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">
                No current chairman record. Admin can mark a chairman as &quot;Running&quot; from the admin panel.
              </p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {running.map((m, i) => <ChairmanProfileCard key={m.id} member={m} index={i} isCurrent />)}
              </div>
            )}
          </section>

          {/* Former Chairmen */}
          <section>
            <SectionHeading label="Former Chairmen" />
            {former.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">
                No former chairman records yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {former.map((m, i) => <ChairmanProfileCard key={m.id} member={m} index={i} isCurrent={false} />)}
              </div>
            )}
          </section>

          {/* Link to Heads page */}
          <div className="border-t border-slate-100 pt-6">
            <Link href="/faculty/heads"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition group">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              View Honorable Heads of the Department
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">{label}</h2>
      <div className="mt-1.5 h-0.5 w-full" style={{ background: '#c0392b' }} />
    </div>
  );
}

function ChairmanProfileCard({ member: m, index, isCurrent }:
  { member: FacultyMember; index: number; isCurrent: boolean }) {
  const initials = getInitials(m.name);
  const href = profileHref(m);
  const badge = getBadgeStyle(m.designation);
  const period = formatServicePeriod(m.chairmanFrom, isCurrent ? null : m.chairmanTo);
  const showEmail = m.email && m.email.includes('@') && !/^faculty-\d+@/i.test(m.email);

  return (
    <Link href={href} className="group block">
      <article className={`flex gap-5 p-5 rounded-2xl border transition-all hover:shadow-lg ${
        isCurrent
          ? 'border-green-200 bg-green-50/30 hover:border-green-400'
          : 'border-slate-200 bg-white hover:border-green-300'
      }`}>
        {/* Photo */}
        <div className={`shrink-0 overflow-hidden rounded-xl bg-slate-100 ${isCurrent ? 'w-28 h-28' : 'w-20 h-20'}`}>
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo} alt={m.name} className="w-full h-full object-contain object-top"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-white select-none text-3xl"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {isCurrent && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">Running Chairman</span>
            </div>
          )}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-green-700 leading-snug transition">
            {m.title ? `${m.title} ` : ''}{m.name}
          </h3>
          <span className="mt-1.5 inline-block text-[11px] font-bold px-2 py-0.5 rounded-sm"
            style={{ background: badge.bg, color: badge.text }}>
            {m.designation}
          </span>
          {period && (
            <p className="text-xs text-slate-600 mt-2">
              <span className="font-semibold">Service Period:</span> {period}
            </p>
          )}
          {showEmail && <p className="text-xs text-slate-400 truncate mt-1">{m.email}</p>}
          {m.shortBio && !isCurrent && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{m.shortBio}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
