import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Clubs & Societies — GSTU CSE' };

export default function StudentClubsPage() {
  return (
    <>
      <SectionHero tag="Students" title="Clubs & Societies"
        description="Student-led clubs that foster creativity, leadership, and community."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Students', href: '/students' }, { label: 'Clubs' }]}/>
      <div className="bg-white section-py"><div className="container-custom">
        <p className="text-slate-500 text-center mb-8">View all active student clubs and organizations in the department.</p>
        <div className="text-center">
          <Link href="/students/clubs" className="px-6 py-3 text-sm font-bold text-white rounded-xl inline-block"
            style={{ background: '#0b3d1f' }}>Browse All Clubs →</Link>
        </div>
        <div className="mt-10 text-center">
          <Link href="/clubs" className="px-6 py-3 text-sm font-bold text-white rounded-xl inline-block transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
            View Department Clubs
          </Link>
        </div>
      </div></div>
    </>
  );
}
