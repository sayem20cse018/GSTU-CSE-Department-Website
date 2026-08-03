import type { Metadata } from 'next';
import SiteHeader  from '@/components/layout/SiteHeader';
import Navbar      from '@/components/layout/Navbar';
import Footer      from '@/components/layout/Footer';
import HeroSlider  from '@/components/sections/HeroSlider';
import AboutSection from '@/components/sections/AboutSection';
import NoticesSection   from '@/components/sections/NoticesSection';
import NewsSection      from '@/components/sections/NewsSection';
import FacultyPreview   from '@/components/sections/FacultyPreview';
import ResearchHighlights from '@/components/sections/ResearchHighlights';

export const metadata: Metadata = {
  title: 'Department of Computer Science & Engineering — GSTU',
  description:
    'Official website of the Department of Computer Science & Engineering, Gopalganj Science & Technology University. Explore programs, research, faculty, and more.',
  keywords: ['GSTU', 'CSE', 'Computer Science', 'Engineering', 'Bangladesh', 'University'],
  openGraph: {
    title: 'Dept. of CSE — GSTU',
    description: 'Advancing Computing, Shaping the Future.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Top header bar */}
      <SiteHeader />

      {/* 2. Sticky nav bar */}
      <Navbar />

      {/* 3. Hero slider — flush against navbar, no gap */}
      <HeroSlider />

      {/* 4. About us */}
      <AboutSection />

      {/* 5. Notices */}
      <NoticesSection />

      {/* 6. News */}
      <NewsSection />

      {/* 7. Faculty preview */}
      <FacultyPreview />

      {/* 8. Research highlights */}
      <ResearchHighlights />

      {/* 9. Footer */}
      <Footer />
    </>
  );
}
