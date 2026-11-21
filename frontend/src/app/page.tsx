import { Suspense } from 'react';
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

// ISR: regenerate at most every 60 seconds.
// This keeps the homepage fast (served from cache) while still picking up
// new hero slides, news, notices within a minute.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Department of Computer Science & Engineering — GSTU',
  description: 'Official website of the Department of Computer Science & Engineering, Gopalganj Science & Technology University.',
};

async function fetchHeroSlides(): Promise<ApiSlide[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/hero-slides?isActive=true`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return [];
    const d = await r.json() as { data?: ApiSlide[] };
    return Array.isArray(d.data) ? d.data.filter(s => s.isActive) : [];
  } catch { return []; }
}

/** Thin skeleton shown while a section is loading */
function SectionSkeleton() {
  return (
    <div className="section-py">
      <div className="container-custom">
        <div className="h-6 w-48 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const heroSlides = await fetchHeroSlides();

  return (
    <>
      <SiteHeader />
      <Navbar />
      <main>
        {/* Hero is above the fold — render immediately, no Suspense */}
        <HeroSlider initialSlides={heroSlides} />

        {/* Sections stream in as they resolve, so the page starts painting fast */}
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ChairmanMessage />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AcademicProgramsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <NoticesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <NewsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AchievementsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <UpcomingEventsSection />
        </Suspense>

        {/* Client-side sections — no Suspense needed, they mount immediately */}
        <ClubsSection />

        <Suspense fallback={<SectionSkeleton />}>
          <FacultyPreview />
        </Suspense>

        <DepartmentStats />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
