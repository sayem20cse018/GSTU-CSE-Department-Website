import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery Album — GSTU CSE',
  description: 'Photo album from the Department of Computer Science & Engineering, GSTU.',
};

export default function GallerySlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
