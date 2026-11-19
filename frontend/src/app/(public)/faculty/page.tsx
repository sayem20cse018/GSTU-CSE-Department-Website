import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import FacultyDirectory from './faculty-directory';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import { isValidFacultyRecord } from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Faculty & Staff — GSTU CSE',
  description:
    'Meet the faculty, staff and leadership of the Department of Computer Science & Engineering at GSTU.',
};

export default async function FacultyPage() {
  const result = await fetchFacultyList(false);

  /**
   * Pass every valid record — the FacultyDirectory client component
   * partitions them into the correct tabs:
   *   Active Faculty  → staffType=faculty AND NOT on_leave AND isActive=true
   *   On Leave        → staffType=faculty AND on_leave
   *   Ex Chairman     → staffType=chairman OR dean
   *   Staff & Officers → staffType=staff OR officer
   */
  const all = result.ok
    ? result.members.filter(f => isValidFacultyRecord(f))
    : [];

  return (
    <>
      <SectionHero
        tag="Our People"
        title="Faculty &amp; Staff"
        description="Meet our educators, researchers, and administrative team dedicated to academic excellence."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Faculty & Staff' }]}
      />
      <main className="bg-white section-py">
        <div className="container-custom">
          {!result.ok ? (
            <FacultyLoadError title="Couldn't load faculty & staff" />
          ) : (
            /* defaultTab='active' means Active Faculty tab is selected on first load */
            <FacultyDirectory all={all} defaultTab="active" />
          )}
        </div>
      </main>
    </>
  );
}
