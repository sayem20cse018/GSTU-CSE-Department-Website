import Link from 'next/link';
import { fetchFacultyList } from '@/lib/faculty/data';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import FacultyCard from '@/components/faculty/FacultyCard';
import {
  isValidFacultyRecord,
  sortBySeniority,
  type FacultyMember,
} from '@/lib/faculty/shared';

export default async function FacultyPreview() {
  const result = await fetchFacultyList(3600); // ISR: refresh hourly on the homepage

  const preview = result.ok
    ? sortBySeniority(
        result.members.filter(
          (f) =>
            isValidFacultyRecord(f) &&
            f.staffType === 'faculty' &&          // exclude dean & chairman
            f.employmentStatus !== 'on_leave' &&  // exclude on-leave
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {preview.map((member, i) => (
                <FacultyCard key={member.id} member={member} index={i} />
              ))}
            </div>

            {/* View All Faculty */}
            <div className="mt-12 flex justify-center">
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
