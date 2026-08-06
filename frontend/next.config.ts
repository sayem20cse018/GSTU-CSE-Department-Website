import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── API route body size limit (for image uploads via proxy) ───────────────
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },

  // ── Image optimization ────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ── Production output ─────────────────────────────────────────────────────
  // Vercel handles this automatically — no need to set output: 'export'
  // which would break dynamic routes and API routes

  // ── Environment ───────────────────────────────────────────────────────────
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  },

  // ── Performance ────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Headers for security ───────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  // ── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy URL support
      { source: '/home', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
