import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search — GSTU CSE',
  description: 'Search across faculty, news, events, and notices of the Department of CSE, GSTU.',
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
