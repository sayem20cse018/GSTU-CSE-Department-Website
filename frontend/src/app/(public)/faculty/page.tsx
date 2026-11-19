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

  // All valid, active records — the directory component handles its own partitioning
  const all = result.ok
    ? result.members.filter(f => isValidFacultyRecord(f) && f.isActive !== false)
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
            <FacultyDirectory all={all} />
          )}
        </div>
      </main>
    </>
  );
}
