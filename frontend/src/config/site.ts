// ─── Runtime config ──────────────────────────────────────────────────────────
// All environment variables are accessed through this single config object.
// Never access process.env directly outside this file.

export const siteConfig = {
  // Public URL of this Next.js app
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // NestJS backend base URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",

  // Used for internal Next.js API routes (server-side only)
  internalApiSecret: process.env.API_SECRET ?? "",

  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
