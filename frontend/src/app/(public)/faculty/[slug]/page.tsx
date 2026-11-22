import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchFacultyBySlug } from '@/lib/faculty/data';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import {
  getBadgeStyle,
  getInitials,
  isOnLeave,
  formatEmploymentStatus,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
  type FacultyPublication,
} from '@/lib/faculty/shared';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchFacultyBySlug(slug);
  if (!result.ok || !result.member) return { title: 'Faculty — GSTU CSE' };
  const f = result.member;
  return {
    title: `${f.title ? f.title + ' ' : ''}${f.name} — GSTU CSE Faculty`,
    description: f.shortBio ?? `${f.designation}, Department of CSE, GSTU.`,
  };
}

const PUB_TYPE: Record<string, { label: string; color: string }> = {
  journal:      { label: 'Journal',      color: '#166534' },
  conference:   { label: 'Conference',   color: '#1d4ed8' },
  book:         { label: 'Book',         color: '#6d28d9' },
  book_chapter: { label: 'Book Chapter', color: '#6d28d9' },
  thesis:       { label: 'Thesis',       color: '#b45309' },
  other:        { label: 'Publication',  color: '#475569' },
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
  const result = await fetchFacultyBySlug(slug);

  if (!result.ok) return <ProfileLoadError />;
  const f = result.member;
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
  const hasContent =
    bio || f.researchInterests.length > 0 || education.length > 0 ||
    publications.length > 0 || awards.length > 0 || f.courses.length > 0;

  return (
    <main className="bg-white min-h-screen">
      {/* Page top padding for fixed header */}
      <div className="pt-24 pb-6 border-b border-slate-200 bg-white">
        <div className="container-custom">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-700 transition mb-4"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Faculty
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left sidebar ──────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0">

            {/* ═══════════════════════════════════════════════════════
                PROFILE IMAGE CARD — reference design recreation
                - White card, rounded corners
                - Green decorative swirl shapes at top-left & bottom-right
                - Double green border ring around photo
                - Photo clean (nothing on face)
                - Name bold dark-green, one line
                - Designation, Email below — gray, clean
            ═══════════════════════════════════════════════════════ */}
            <div style={{
              position: 'relative',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              border: '1px solid #e2e8f0',
              overflow: 'visible',
              paddingBottom: '20px',
            }}>

              {/* ── top-left green swirl decoration ── */}
              <div aria-hidden="true" style={{
                position: 'absolute', top: '-2px', left: '-2px',
                width: '90px', height: '90px', zIndex: 2, pointerEvents: 'none',
              }}>
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  {/* large filled arc shape */}
                  <path d="M0 0 Q0 60 60 90 L0 90 Z"
                    fill="url(#gl1)" opacity="0.9"/>
                  {/* inner lighter arc */}
                  <path d="M0 0 Q0 40 40 68"
                    stroke="#4ade80" strokeWidth="3" fill="none" opacity="0.7"
                    strokeLinecap="round"/>
                  <path d="M0 0 Q0 25 25 48"
                    stroke="#86efac" strokeWidth="2" fill="none" opacity="0.5"
                    strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gl1" x1="0" y1="0" x2="90" y2="90">
                      <stop offset="0%" stopColor="#16a34a"/>
                      <stop offset="100%" stopColor="#4ade80"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* ── bottom-right green swirl decoration ── */}
              <div aria-hidden="true" style={{
                position: 'absolute', bottom: '64px', right: '-2px',
                width: '90px', height: '90px', zIndex: 2, pointerEvents: 'none',
              }}>
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <path d="M90 90 Q90 30 30 0 L90 0 Z"
                    fill="url(#gl2)" opacity="0.9"/>
                  <path d="M90 90 Q90 50 50 22"
                    stroke="#4ade80" strokeWidth="3" fill="none" opacity="0.7"
                    strokeLinecap="round"/>
                  <path d="M90 90 Q90 65 65 42"
                    stroke="#86efac" strokeWidth="2" fill="none" opacity="0.5"
                    strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gl2" x1="90" y1="90" x2="0" y2="0">
                      <stop offset="0%" stopColor="#16a34a"/>
                      <stop offset="100%" stopColor="#4ade80"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* ── photo area with double green border ring ── */}
              <div style={{ padding: '16px 16px 12px', position: 'relative', zIndex: 3 }}>

                {/* outer dark green ring */}
                <div style={{
                  borderRadius: '18px',
                  padding: '4px',
                  background: 'linear-gradient(135deg, #15803d, #16a34a, #4ade80, #16a34a)',
                }}>
                  {/* inner white gap */}
                  <div style={{
                    borderRadius: '15px',
                    padding: '3px',
                    background: 'white',
                  }}>
                    {/* photo */}
                    <div style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      aspectRatio: '3 / 3.6',
                      background: '#f1f5f9',
                      position: 'relative',
                    }}>
                      {f.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.photo}
                          alt={f.name}
                          style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', objectPosition: 'center top',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: AVATAR_GRADIENTS[0],
                        }}>
                          <span style={{
                            fontSize: '3.5rem', fontWeight: 900, color: 'white', userSelect: 'none',
                          }}>{initials}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Name / Designation / Email ── clean, no icons ── */}
              <div style={{
                padding: '0 16px 4px',
                textAlign: 'center',
                position: 'relative', zIndex: 3,
              }}>
                {/* Name — bold, dark green, one line */}
                <h1 style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#14532d',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                  marginBottom: '4px',
                }}>
                  {f.title ? `${f.title} ` : ''}{f.name}
                </h1>

                {/* Leadership role (Chairman/Dean) if present */}
                {(f.leadershipRole === 'running_chairman' || f.staffType === 'dean') && (
                  <p style={{
                    fontSize: '0.78rem', color: '#6b7280',
                    marginBottom: '2px', lineHeight: 1.3,
                  }}>
                    {f.staffType === 'dean' ? 'Dean' : 'Chairman'}
                  </p>
                )}

                {/* Designation */}
                <p style={{
                  fontSize: '0.78rem', color: '#6b7280',
                  marginBottom: '2px', lineHeight: 1.3,
                }}>
                  {f.designation}
                </p>

                {/* Email — one line */}
                {showEmail && (
                  <a href={`mailto:${f.email}`} style={{
                    display: 'block',
                    fontSize: '0.72rem', color: '#6b7280',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    textDecoration: 'none',
                    lineHeight: 1.4,
                  }}>
                    {f.email}
                  </a>
                )}

                {onLeave && (
                  <span style={{
                    display: 'inline-block', marginTop: '6px',
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '2px 10px', borderRadius: '999px',
                    background: '#d97706', color: 'white',
                  }}>On Leave</span>
                )}
              </div>
            </div>

            {/* ── Contact + details list (unchanged) ── */}
            <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
              {showEmail && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${f.email}`} className="break-all hover:text-green-700 transition">
                    {f.email}
                  </a>
                </li>
              )}
              {f.phone && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${f.phone}`} className="hover:text-green-700 transition">{f.phone}</a>
                </li>
              )}
              {f.websiteUrl && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                  </svg>
                  <a href={f.websiteUrl} target="_blank" rel="noopener noreferrer" className="break-all hover:text-green-700 transition">
                    {f.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </li>
              )}
              {f.googleScholarUrl && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12 12 0 0112 21a12 12 0 01-6.16-10.42L12 14z" />
                  </svg>
                  <a href={f.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">Google Scholar</a>
                </li>
              )}
              {f.researchGateUrl && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <a href={f.researchGateUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">ResearchGate</a>
                </li>
              )}
              {f.linkedinUrl && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" strokeWidth={2} />
                  </svg>
                  <a href={f.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">LinkedIn</a>
                </li>
              )}
              {f.orcidId && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8v8M14 8v8M8 12h8" />
                  </svg>
                  <a href={`https://orcid.org/${f.orcidId}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">ORCID</a>
                </li>
              )}
              {f.officeRoom && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{f.officeRoom}</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatEmploymentStatus(f.employmentStatus)}</span>
              </li>
              {f.joinedAt && (
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {formatDate(f.joinedAt)}</span>
                </li>
              )}
            </ul>

            {/* Office hours */}
            {f.officeHours.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Office Hours</p>
                <ul className="space-y-1">
                  {f.officeHours.map((oh) => (
                    <li key={oh.id} className="flex justify-between text-xs text-slate-600">
                      <span className="font-medium">{oh.day}</span>
                      <span>{oh.startTime}–{oh.endTime}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ── Right main content ────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-0">

            {bio && (
              <ContentSection title="Biography">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{bio}</p>
              </ContentSection>
            )}

            {education.length > 0 && (
              <ContentSection title="Education">
                <ul className="space-y-3">
                  {education.map((e) => (
                    <li key={e.id}>
                      <p className="text-sm font-semibold text-green-700">{e.degree}, {e.year}</p>
                      <p className="text-sm text-slate-600">{e.institution}</p>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {f.researchInterests.length > 0 && (
              <ContentSection title="Research Interest">
                <ul className="space-y-1">
                  {f.researchInterests.map((r) => (
                    <li key={r} className="text-sm text-green-700">{r}</li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {publications.length > 0 && (
              <ContentSection title="Publications">
                <ol className="space-y-5">
                  {publications.map((p, idx) => (
                    <PublicationRow key={p.id} pub={p} index={idx + 1} />
                  ))}
                </ol>
              </ContentSection>
            )}

            {awards.length > 0 && (
              <ContentSection title="Awards &amp; Honors">
                <ul className="space-y-3">
                  {awards.map((a) => (
                    <li key={a.id}>
                      <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.awardedBy} · {a.year}</p>
                      {a.description && <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>}
                    </li>
                  ))}
                </ul>
              </ContentSection>
            )}

            {f.courses.length > 0 && (
              <ContentSection title="Courses Teaching">
                <div className="flex flex-wrap gap-2">
                  {f.courses.map((c) => (
                    <span key={c} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </ContentSection>
            )}

            {!hasContent && (
              <ContentSection title="Profile">
                <p className="text-sm text-slate-500">
                  Detailed information for {f.name} will be added soon.
                </p>
              </ContentSection>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProfileLoadError() {
  return (
    <main className="bg-white min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <Link
          href="/faculty"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-700 transition mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Faculty
        </Link>
        <div className="max-w-md mx-auto">
          <FacultyLoadError
            title="Couldn't load this profile"
            message="We had trouble reaching the server. Please try again in a moment."
          />
        </div>
      </div>
    </main>
  );
}

/** JUST CSE style section heading: bold title + red underline */
function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pt-5 pb-6 border-b border-slate-100 last:border-0">
      <div className="mb-3">
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        <div className="mt-1 h-0.5 w-full" style={{ background: '#c0392b' }} />
      </div>
      {children}
    </section>
  );
}

function PublicationRow({ pub, index }: { pub: FacultyPublication; index: number }) {
  const type = PUB_TYPE[(pub.type ?? 'other').toLowerCase()] ?? PUB_TYPE.other;
  const link = pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
  return (
    <li className="flex gap-3">
      {/* Numbering */}
      <span className="shrink-0 text-sm font-bold text-slate-400 w-5 text-right mt-0.5">
        {index}.
      </span>
      <div className="min-w-0">
        {/* Authors + bold title inline — matching JUST CSE style */}
        <p className="text-sm text-slate-700 leading-snug">
          {pub.authors && <span>{pub.authors}. </span>}
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer"
              className="font-bold text-slate-900 hover:text-green-700 transition">
              {pub.title}
            </a>
          ) : (
            <strong className="font-bold text-slate-900">{pub.title}</strong>
          )}
          {pub.venue && <span className="text-slate-600">{', '}<em>{pub.venue}</em></span>}
          {pub.year && <span className="text-slate-600">{', '}{pub.year}.</span>}
        </p>
        {/* Type chip + DOI chip */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span
            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: `${type.color}18`, color: type.color }}>
            {type.label}
          </span>
          {pub.doi && (
            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 text-slate-500 hover:border-green-400 hover:text-green-700 transition">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              DOI
            </a>
          )}
          {pub.url && !pub.doi && (
            <a href={pub.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 text-slate-500 hover:border-green-400 hover:text-green-700 transition">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Link
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
