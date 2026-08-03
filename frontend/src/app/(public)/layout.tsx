import SiteHeader from '@/components/layout/SiteHeader';
import Navbar     from '@/components/layout/Navbar';
import Footer     from '@/components/layout/Footer';

/**
 * Shared layout for all public-facing pages under (public)/.
 * Pages that already include SiteHeader/Navbar/Footer manually
 * (notices, news, events) should be moved to use this layout instead,
 * but they remain functional either way.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Navbar />
      <main className="flex flex-col flex-1 min-h-0">{children}</main>
      <Footer />
    </>
  );
}
