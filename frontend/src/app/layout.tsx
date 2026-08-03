import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'Dept. of CSE — GSTU',
    template: '%s — GSTU CSE',
  },
  description: 'Official website of the Department of Computer Science & Engineering, Gopalganj Science & Technology University.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased"
        style={{ fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
