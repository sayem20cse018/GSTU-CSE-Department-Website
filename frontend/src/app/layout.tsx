import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Oswald, Montserrat, Noto_Sans_Bengali } from 'next/font/google';
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

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Noto Sans Bengali — auto-applied to all Bengali text via CSS unicode-range
const notoSansBengali = Noto_Sans_Bengali({
  variable: '--font-bengali',
  subsets: ['bengali'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
    <html lang="bn" className={`${inter.variable} ${jetbrainsMono.variable} ${oswald.variable} ${montserrat.variable} ${notoSansBengali.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased"
        style={{ fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
