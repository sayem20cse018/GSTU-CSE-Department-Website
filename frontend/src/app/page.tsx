import type { Metadata } from 'next';
import SiteHeader         from '@/components/layout/SiteHeader';
import Navbar             from '@/components/layout/Navbar';
import Footer             from '@/components/layout/Footer';
import HeroSlider         from '@/components/sections/HeroSlider';
import AboutSection       from '@/components/sections/AboutSection';
import ChairmanMessage    from '@/components/sections/ChairmanMessage';
import DepartmentStats    from '@/components/sections/DepartmentStats';
import NoticesSection     from '@/components/sections/NoticesSection';
import NewsSection        from '@/components/sections/NewsSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import ClubsSection       from '@/components/sections/ClubsSection';
import FacultyPreview     from '@/components/sections/FacultyPreview';
import ResearchHighlights from '@/components/sections/ResearchHighlights';

export const metadata: Metadata = {
  title: 'Department of Computer Science & Engineering — GSTU',
  description:
    'Official website of the Department of Computer Science & Engineering, Gopalganj Science & Technology University.',
  keywords: ['GSTU', 'CSE', 'Computer Science', 'Engineering', 'Bangladesh'],
  openGraph: {
    title: 'Dept. of CSE — GSTU',
    description: 'Advancing Computing, Shaping the Future.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      {/* ── Header & Nav ─────────────────────────────────────────────────── */}
      <SiteHeader />
      <Navbar />

      {/* ── 1. Hero Slider ───────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── 2. About Department ──────────────────────────────────────────── */}
      <AboutSection />

      {/* ── 3. Chairman's Message ────────────────────────────────────────── */}
      <ChairmanMessage />

      {/* ── 4. Department Statistics (admin-controlled) ──────────────────── */}
      <DepartmentStats />

      {/* ── 5. Latest Notices ────────────────────────────────────────────── */}
      <NoticesSection />

      {/* ── 6. Latest News ───────────────────────────────────────────────── */}
      <NewsSection />

      {/* ── 7. Recent Achievements ───────────────────────────────────────── */}
      <AchievementsSection />

      {/* ── 8. Department Clubs ──────────────────────────────────────────── */}
      <ClubsSection />

      {/* ── 9. Faculty Preview ───────────────────────────────────────────── */}
      <FacultyPreview />

      {/* ── 10. Research & Labs ──────────────────────────────────────────── */}
      <ResearchHighlights />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer />
    </>
  );
}
