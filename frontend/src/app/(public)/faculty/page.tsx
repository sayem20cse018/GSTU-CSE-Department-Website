import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import FacultyDirectory from './faculty-directory';
import { fetchFacultyList } from '@/lib/faculty/data';
import {
  isValidFacultyRecord,
  isDirectoryFaculty,
  sortBySeniority,
} from '@/lib/faculty/shared';

export const metadata: Metadata = {
  title: 'Faculty Members — GSTU CSE',
  description:
    'Meet the faculty of the Department of Computer Science & Engineering at GSTU — professors, associate professors, assistant professors and lecturers.',
};

export default async function FacultyPage() {
  const raw = await fetchFacultyList(false);
  const members = sortBySeniority(
    raw.filter(
      (f) =>
        isValidFacultyRecord(f) &&
        isDirectoryFaculty(f) &&
        f.isActive !== false,
    ),
  );

  return (
    <>
      <SectionHero
        tag="Our People"
        title="Faculty Members"
        description="Meet our team of experienced educators and researchers dedicated to excellence in computing education and scholarship."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Faculty' }]}
      />
      <main className="bg-white section-py">
        <div className="container-custom">
          {members.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3" aria-hidden="true">
                👨‍🏫
              </span>
              <p className="text-slate-500 font-medium">
                No faculty profiles available yet.
              </p>
            </div>
          ) : (
            <FacultyDirectory members={members} />
          )}
        </div>
      </main>
    </>
  );
}
