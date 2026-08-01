import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import NoticesSection from '@/components/sections/NoticesSection';
import NewsSection from '@/components/sections/NewsSection';
import FacultyPreview from '@/components/sections/FacultyPreview';
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
      <Navbar />

      {/* Offset for fixed navbar */}
      <div className="pt-0">
        <HeroSection />
        <NoticesSection />
        <NewsSection />
        <FacultyPreview />
        <ResearchHighlights />
      </div>

      <Footer />
    </>
  );
}
