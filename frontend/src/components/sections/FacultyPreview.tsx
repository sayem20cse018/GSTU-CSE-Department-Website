import Link from 'next/link';
import { fetchFacultyList } from '@/lib/faculty/data';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import {
  isValidFacultyRecord,
  isDirectoryFaculty,
  getBadgeStyle,
  getInitials,
  sortBySeniority,
  profileHref,
  AVATAR_GRADIENTS,
  type FacultyMember,
} from '@/lib/faculty/shared';

export default async function FacultyPreview() {
  const result = await fetchFacultyList(3600); // ISR: refresh hourly on the homepage

  const preview = result.ok
    ? sortBySeniority(
        result.members.filter(
          (f) =>
            isValidFacultyRecord(f) &&
            isDirectoryFaculty(f) &&
            f.isActive !== false,
        ),
      ).slice(0, 4)
    : [];

  return (
    <section className="section-py bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}
          >
            Faculty Members
          </h2>
          <div
            className="flex-1 h-[2px]"
            style={{ background: '#1a7a3c' }}
            aria-hidden="true"
          />
        </div>

        {!result.ok ? (
          <FacultyLoadError
            compact
            title="Couldn't load faculty"
            message="We had trouble reaching the server. Please try again in a moment."
          />
        ) : preview.length === 0 ? (
          <p className="text-center text-slate-400 py-8">
            Faculty profiles will appear here once added.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {preview.map((member, i) => (
                <FacultyCard key={member.id} member={member} index={i} />
              ))}
            </div>

            {/* View All Faculty — centered below cards */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/faculty"
                className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #166534, #15803d)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View All Faculty Members
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  const badge = getBadgeStyle(member.designation);
  const initials = getInitials(member.name);
  const href = profileHref(member);
  const showEmail =
    member.email && member.email.includes('@') && !/^faculty-\d+@/i.test(member.email);

  return (
    <article className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Photo — contained (no aggressive cropping) on a neutral frame */}
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
        {/* seniority accent strip */}
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: 'linear-gradient(90deg,#166534,#1a7a3c)' }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition leading-tight text-base">
          <Link href={href} className="hover:underline">
            {member.title ? `${member.title} ` : ''}
            {member.name}
          </Link>
        </h3>

        <span
          className="inline-block self-start text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-2"
          style={{ background: badge.bg, color: badge.text }}
        >
          {member.designation}
        </span>

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
          className="mt-auto pt-4 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}
        >
          View Profile
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
