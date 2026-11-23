// No caching for public layout — always serve fresh content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import SiteHeader  from '@/components/layout/SiteHeader';
import Navbar      from '@/components/layout/Navbar';
import Footer      from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Navbar />
      <main className="flex flex-col flex-1 min-h-0">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
