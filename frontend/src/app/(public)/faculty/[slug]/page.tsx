import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchFacultyBySlug } from '@/lib/faculty/data';
import {
  getBadgeStyle,
  getInitials,
  isOnLeave,
  formatEmploymentStatus,
  type FacultyPublication,
} from '@/lib/faculty/shared';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = await fetchFacultyBySlug(slug);
  if (!f) return { title: 'Faculty — GSTU CSE' };
  return {
    title: `${f.title ? f.title + ' ' : ''}${f.name} — GSTU CSE Faculty`,
    description: f.shortBio ?? `${f.designation}, Department of CSE, GSTU.`,
  };
}

const PUBLICATION_TYPE: Record<string, { label: string; bg: string; text: string }> = {
  journal: { label: 'Journal', bg: 'rgba(22,101,52,0.1)', text: '#166534' },
  conference: { label: 'Conference', bg: 'rgba(29,78,216,0.1)', text: '#1d4ed8' },
  book: { label: 'Book', bg: 'rgba(109,40,217,0.1)', text: '#6d28d9' },
  book_chapter: { label: 'Book Chapter', bg: 'rgba(109,40,217,0.1)', text: '#6d28d9' },
  thesis: { label: 'Thesis', bg: 'rgba(180,83,9,0.1)', text: '#b45309' },
  other: { label: 'Publication', bg: 'rgba(71,85,105,0.1)', text: '#475569' },
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = await fetchFacultyBySlug(slug);
  if (!f) notFound();

  const badge = getBadgeStyle(f.designation);
  const onLeave = isOnLeave(f);
  const bio = f.fullBio ?? f.shortBio ?? '';
  const education = [...f.education].sort((a, b) => b.year - a.year);
  const publications = [...f.publications].sort((a, b) => b.year - a.year);
  const awards = [...f.awards].sort((a, b) => b.year - a.year);
  const initials = getInitials(f.name);
  const showEmail =
    f.email && f.email.includes('@') && !/^faculty-\d+@/i.test(f.email);

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="text-white pt-28 pb-14" style={{ background: 'linear-gradient(135deg, #0b3d1f 0%, #134e2a 50%, #0a2e1a 100%)' }}>
        <div className="container-custom">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition hover:opacity-100"
            style={{ color: 'rgba(187,247,208,0.8)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Faculty
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Large photo — contained, no aggressive crop */}
            <div className="w-36 h-44 sm:w-40 sm:h-48 shrink-0 rounded-2xl overflow-hidden border-2 border-white/15 bg-white/5">
              {f.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.photo}
                  alt={f.name}
                  className="w-full h-full object-contain object-top"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#1a7a3c,#0b3d1f)' }}
                >
                  <span className="text-5xl font-black text-white select-none">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: badge.bg, color: badge.text }}
                >
                  {f.designation}
                </span>
                {onLeave && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/90 text-white">
                    On Leave
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                {f.title ? `${f.title} ` : ''}
                {f.name}
              </h1>

              {f.shortBio && (
                <p
                  className="mt-3 max-w-2xl leading-relaxed"
                  style={{ color: 'rgba(187,247,208,0.75)' }}
                >
                  {f.shortBio}
                </p>
              )}

              {/* Contact row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
                {showEmail && (
                  <a href={`mailto:${f.email}`} className="flex items-center gap-1.5 text-sm transition hover:opacity-100" style={{ color: '#bbf7d0' }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="break-all">{f.email}</span>
                  </a>
                )}
                {f.phone && (
                  <a href={`tel:${f.phone}`} className="flex items-center gap-1.5 text-sm transition hover:opacity-100" style={{ color: '#bbf7d0' }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {f.phone}
                  </a>
                )}
                {f.officeRoom && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(187,247,208,0.75)' }}>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {f.officeRoom}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {bio && (
              <Panel title="Biography">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{bio}</p>
              </Panel>
            )}

            {f.researchInterests.length > 0 && (
              <Panel title="Research Interests">
                <div className="flex flex-wrap gap-2">
                  {f.researchInterests.map((r) => (
                    <span
                      key={r}
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ background: 'rgba(22,101,52,0.08)', color: '#166534' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </Panel>
            )}

            {education.length > 0 && (
              <Panel title="Education">
                <ol className="space-y-4">
                  {education.map((e) => (
                    <li key={e.id} className="flex items-start gap-3">
                      <span
                        className="shrink-0 w-14 text-center text-xs font-bold px-2 py-1.5 rounded-lg"
                        style={{ background: 'rgba(22,101,52,0.08)', color: '#166534' }}
                      >
                        {e.year}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="font-semibold text-slate-900">{e.degree}</p>
                        <p className="text-sm text-slate-500">{e.institution}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Panel>
            )}

            {publications.length > 0 && (
              <Panel title="Publications">
                <ul className="space-y-4">
                  {publications.map((p) => (
                    <PublicationRow key={p.id} pub={p} />
                  ))}
                </ul>
              </Panel>
            )}

            {awards.length > 0 && (
              <Panel title="Awards & Honors">
                <ul className="space-y-4">
                  {awards.map((a) => (
                    <li key={a.id} className="flex items-start gap-3">
                      <span className="shrink-0 w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{a.title}</p>
                        <p className="text-sm text-slate-500">
                          {a.awardedBy} · {a.year}
                        </p>
                        {a.description && (
                          <p className="text-sm text-slate-500 mt-0.5">{a.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {f.courses.length > 0 && (
              <Panel title="Courses Teaching">
                <div className="flex flex-wrap gap-2">
                  {f.courses.map((c) => (
                    <span key={c} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </Panel>
            )}

            {/* Fallback when there is no detailed content at all */}
            {!bio &&
              f.researchInterests.length === 0 &&
              education.length === 0 &&
              publications.length === 0 &&
              awards.length === 0 &&
              f.courses.length === 0 && (
                <Panel title="Profile">
                  <p className="text-slate-500">
                    Detailed information for {f.name} will be added soon.
                  </p>
                </Panel>
              )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <Panel title="Quick Info">
              <dl className="divide-y divide-slate-100">
                <InfoRow label="Designation" value={f.designation} />
                <InfoRow label="Office" value={f.officeRoom ?? '—'} />
                <InfoRow label="Status" value={formatEmploymentStatus(f.employmentStatus)} />
                <InfoRow label="Joined" value={formatDate(f.joinedAt)} />
              </dl>
            </Panel>

            {f.officeHours.length > 0 && (
              <Panel title="Office Hours">
                <ul className="divide-y divide-slate-100">
                  {f.officeHours.map((oh) => (
                    <li key={oh.id} className="flex justify-between py-2.5 text-sm">
                      <span className="text-slate-500">{oh.day}</span>
                      <span className="text-slate-900 font-medium">
                        {oh.startTime} – {oh.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {(f.websiteUrl ||
              f.googleScholarUrl ||
              f.linkedinUrl ||
              f.researchGateUrl ||
              f.orcidId) && (
              <Panel title="Online Profiles">
                <div className="space-y-2">
                  {f.websiteUrl && (
                    <ProfileLink href={f.websiteUrl} label="Website" icon="globe" />
                  )}
                  {f.googleScholarUrl && (
                    <ProfileLink href={f.googleScholarUrl} label="Google Scholar" icon="scholar" />
                  )}
                  {f.researchGateUrl && (
                    <ProfileLink href={f.researchGateUrl} label="ResearchGate" icon="research" />
                  )}
                  {f.linkedinUrl && (
                    <ProfileLink href={f.linkedinUrl} label="LinkedIn" icon="linkedin" />
                  )}
                  {f.orcidId && (
                    <ProfileLink href={`https://orcid.org/${f.orcidId}`} label={`ORCID · ${f.orcidId}`} icon="orcid" />
                  )}
                </div>
              </Panel>
            )}

            <div className="rounded-2xl border border-green-100 p-5" style={{ background: 'rgba(22,101,52,0.04)' }}>
              <p className="text-sm text-slate-600 mb-3">Looking to connect or collaborate?</p>
              {showEmail ? (
                <a
                  href={`mailto:${f.email}`}
                  className="block text-center w-full py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}
                >
                  Send Email
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="block text-center w-full py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}
                >
                  Contact the Department
                </Link>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-900 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all faculty
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Small presentational helpers ─────────────────────────────────────────────

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-oswald)' }}>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd className="text-slate-900 font-medium text-right">{value}</dd>
    </div>
  );
}

function PublicationRow({ pub }: { pub: FacultyPublication }) {
  const type = PUBLICATION_TYPE[(pub.type ?? 'other').toLowerCase()] ?? PUBLICATION_TYPE.other;
  const link = pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
  return (
    <li className="flex items-start gap-3">
      <span
        className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-md leading-none mt-0.5"
        style={{ background: type.bg, color: type.text }}
      >
        {type.label}
      </span>
      <div className="min-w-0">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-900 hover:text-green-700 transition"
          >
            {pub.title}
          </a>
        ) : (
          <p className="font-semibold text-slate-900">{pub.title}</p>
        )}
        {pub.authors && <p className="text-sm text-slate-600">{pub.authors}</p>}
        <p className="text-sm text-slate-500">
          {pub.venue}
          {pub.venue && pub.year ? ', ' : ''}
          {pub.year}
        </p>
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-green-700 hover:text-green-900 transition mt-0.5"
          >
            DOI: {pub.doi}
          </a>
        )}
      </div>
    </li>
  );
}

function ProfileLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: 'globe' | 'scholar' | 'research' | 'linkedin' | 'orcid';
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-sm text-slate-700 hover:text-green-700 transition py-1"
    >
      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
        <LinkIcon name={icon} />
      </span>
      <span className="truncate">{label}</span>
      <svg className="w-3.5 h-3.5 ml-auto text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

function LinkIcon({ name }: { name: 'globe' | 'scholar' | 'research' | 'linkedin' | 'orcid' }) {
  const common = { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' } as const;
  switch (name) {
    case 'globe':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
        </svg>
      );
    case 'scholar':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.42A12 12 0 0112 21a12 12 0 01-6.16-10.42L12 14z" />
        </svg>
      );
    case 'research':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V8a1 1 0 00-1-1h-3a1 1 0 00-1 1v13M9 21V11a1 1 0 00-1-1H5a1 1 0 00-1 1v10M4 7l4-4 4 4" />
        </svg>
      );
    case 'orcid':
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18zM10 8v8M14 8v8M8 12h8" />
        </svg>
      );
  }
}
