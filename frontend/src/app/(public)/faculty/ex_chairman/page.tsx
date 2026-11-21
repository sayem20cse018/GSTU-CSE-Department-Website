import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord,
  formatServicePeriod,
  profileHref,
  getInitials,
  getBadgeStyle,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Ex Chairman — GSTU CSE',
  description: 'Current and former chairmen of the Department of CSE, GSTU.',
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-5 rounded-full shrink-0" style={{ background: '#166534' }} aria-hidden="true" />
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
      </div>
      <div className="h-px w-full bg-slate-100" />
    </div>
  );
}

export default async function ExChairmanPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-5xl">
          <PageHeader />
          <FacultyLoadError title="Couldn't load chairman records" />
        </div>
      </main>
    );
  }

  const all = result.members.filter(
    m => isValidFacultyRecord(m) && (m.staffType === 'chairman' || m.staffType === 'dean'),
  );

  // Running chairman — currently serving
  const running = all.filter(
    m => m.isCurrentChairman || m.leadershipRole === 'running_chairman',
  );

  // Former chairmen — sorted by most-recent first
  const former = all
    .filter(m => !m.isCurrentChairman && m.leadershipRole !== 'running_chairman')
    .sort((a, b) => {
      const ay = a.chairmanFrom ? new Date(a.chairmanFrom).getFullYear() : 0;
      const by = b.chairmanFrom ? new Date(b.chairmanFrom).getFullYear() : 0;
      return by - ay;
    });

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-5xl">
        <PageHeader />

        <div className="space-y-12">
          {/* Running Chairman */}
          <section>
            <SectionHeading label="Running Chairman" />
            {running.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">No current chairman assigned. Set one from the admin panel.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {running.map((m, i) => (
                  <FacultyCard key={m.id} member={m} index={i} ribbon="Current" ribbonColor="#166534" />
                ))}
              </div>
            )}
          </section>

          {/* Former Chairmen */}
          <section>
            <SectionHeading label="Former Chairmen" />
            {former.length === 0 ? (
              <p className="text-slate-400 text-sm py-6">No former chairman records found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {former.map((m, i) => (
                  <FormerChairmanCard key={m.id} member={m} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* Link to Heads page */}
          <div className="pt-2">
            <Link href="/faculty/heads"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition group">
              View Honorable Heads of the Department
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Former chairman card — horizontal layout with service period */
function FormerChairmanCard({ member: m, index }: { member: FacultyMember; index: number }) {
  const initials  = getInitials(m.name);
  const href      = profileHref(m);
  const badge     = getBadgeStyle(m.designation);
  const period    = formatServicePeriod(m.chairmanFrom, m.chairmanTo);
  const showEmail = m.email && m.email.includes('@') && !/^faculty-\d+@/i.test(m.email);

  return (
    <Link href={href} className="group block">
      <article className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-green-300 hover:shadow-lg transition-all duration-300">
        <div className="w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.photo} alt={m.name} className="w-full h-full object-contain object-top"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-white text-xl select-none"
              style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug">
            {m.title ? `${m.title} ` : ''}{m.name}
          </p>
          <span className="mt-1.5 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: badge.bg, color: badge.text }}>
            {m.designation}
          </span>
          {period && (
            <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {period}
            </p>
          )}
          {showEmail && <p className="text-[9px] text-slate-400 truncate mt-0.5">{m.email}</p>}
        </div>
      </article>
    </Link>
  );
}

function PageHeader() {
  return (
    <div className="mb-10 pb-5 border-b border-slate-100">
      <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
        <Link href="/" className="hover:text-green-700 transition">Home</Link>
        <span>/</span>
        <Link href="/faculty" className="hover:text-green-700 transition">Faculty</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Ex Chairman</span>
      </nav>
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ex Chairman</h1>
      <p className="text-sm text-slate-500 mt-1">
        Department of Computer Science &amp; Engineering, GSTU
      </p>
    </div>
  );
}
