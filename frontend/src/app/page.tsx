// Force fresh render on every request — no stale logo/hero/images
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from 'next';
import SiteHeader               from '@/components/layout/SiteHeader';
import Navbar                   from '@/components/layout/Navbar';
import Footer                   from '@/components/layout/Footer';
import ScrollToTop              from '@/components/ui/ScrollToTop';
import HeroSlider, { type ApiSlide } from '@/components/sections/HeroSlider';
import AboutSection             from '@/components/sections/AboutSection';
import ChairmanMessage          from '@/components/sections/ChairmanMessage';
import AcademicProgramsSection  from '@/components/sections/AcademicProgramsSection';
import NoticesSection           from '@/components/sections/NoticesSection';
import NewsSection              from '@/components/sections/NewsSection';
import AchievementsSection      from '@/components/sections/AchievementsSection';
import UpcomingEventsSection    from '@/components/sections/UpcomingEventsSection';
import ClubsSection             from '@/components/sections/ClubsSection';
import FacultyPreview           from '@/components/sections/FacultyPreview';
import DepartmentStats          from '@/components/sections/DepartmentStats';

export const metadata: Metadata = {
  title: 'Department of Computer Science & Engineering — GSTU',
  description: 'Official website of the Department of Computer Science & Engineering, Gopalganj Science & Technology University.',
};

// Fetch hero slides server-side so the first frame renders with real images — no flash
async function fetchHeroSlides(): Promise<ApiSlide[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/hero-slides?isActive=true`, { cache: 'no-store' });
    if (!r.ok) return [];
    const d = await r.json() as { data?: ApiSlide[] };
    return Array.isArray(d.data) ? d.data.filter(s => s.isActive) : [];
  } catch { return []; }
}

export default async function HomePage() {
  const heroSlides = await fetchHeroSlides();

  return (
    <>
      <SiteHeader />
      <Navbar />
      <main>
        <HeroSlider initialSlides={heroSlides} />
        <AboutSection />
        <ChairmanMessage />
        <AcademicProgramsSection />
        <NoticesSection />
        <NewsSection />
        <AchievementsSection />
        <UpcomingEventsSection />
        <ClubsSection />
        <FacultyPreview />
        <DepartmentStats />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
