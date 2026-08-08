// Force fresh render on every request — no stale logo/hero/images
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from 'next';
import HeroSlider               from '@/components/sections/HeroSlider';
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

export default function HomePage() {
  return (
    <>
      <HeroSlider />
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
    </>
  );
}
