/**
 * Site settings — fetched from the backend, falls back to constants.
 * Used by SiteHeader (server component) and Navbar.
 */
import { SITE } from '@/constants';

export interface SiteSettings {
  id?: string;
  key?: string;
  deptName: string;
  deptShortName: string;
  universityName: string;
  universityShortName: string;
  tagline: string;
  deptLogo: string;
  universityLogo: string;
  email: string;
  phone: string;
  address: string;
  moodleUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  foundedYear: number;
  footerText: string;
  // About section
  aboutIntro?: string;
  aboutVision?: string;
  aboutMission?: string;
  aboutHistory?: string;
  // Chairman
  chairmanName?: string;
  chairmanTitle?: string;
  chairmanPhoto?: string;
  chairmanEmail?: string;
  chairmanEmail2?: string;
  chairmanMessage?: string;
  // About images
  aboutImage1?: string;
  aboutImage2?: string;
  aboutImage3?: string;
  aboutImage4?: string;
  hiddenNavItems?: string[];
  // Header customisation (admin-controlled)
  headerAccentColor?: string;   // dept name color, default #1a7a3c
  showDeptPrefix?: boolean;     // show "Department of" label, default true
  headerFont?: string;          // font family for dept name
  customNavItems?: string;      // JSON string of custom nav items
  headerRightBg?: string;       // right panel background color (gradient/solid)
}

// Fallback from hardcoded constants — used when backend is unreachable
export const SETTINGS_FALLBACK: SiteSettings = {
  deptName:           SITE.name,
  deptShortName:      SITE.shortName,
  universityName:     SITE.university,
  universityShortName: SITE.universityShort,
  tagline:            SITE.tagline,
  deptLogo:           '',
  universityLogo:     '',
  email:              SITE.email,
  phone:              SITE.phone,
  address:            SITE.address,
  moodleUrl:          'https://moodle.gstu.edu.bd',
  facebookUrl:        SITE.socialLinks.facebook,
  twitterUrl:         SITE.socialLinks.twitter,
  linkedinUrl:        SITE.socialLinks.linkedin,
  youtubeUrl:         SITE.socialLinks.youtube,
  foundedYear:        SITE.founded,
  footerText:         '',
  aboutHistory:       '',
};

/** Server-side fetch — used by Server Components */
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    // BACKEND_URL is server-only (not exposed to browser) — use it for SSR
    const api = process.env.BACKEND_URL
      ?? process.env.NEXT_PUBLIC_API_URL
      ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/settings`, {
      cache: 'no-store',   // always fresh — no stale logo/name on refresh
    });
    if (!r.ok) return SETTINGS_FALLBACK;
    const d = await r.json() as { data?: SiteSettings; success?: boolean } | SiteSettings;
    const payload = 'data' in d && d.data ? d.data : d as SiteSettings;
    return { ...SETTINGS_FALLBACK, ...payload };
  } catch {
    return SETTINGS_FALLBACK;
  }
}
