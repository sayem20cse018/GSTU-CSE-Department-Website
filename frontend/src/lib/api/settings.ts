/**
 * Site settings — fetched from the backend, falls back to constants.
 * Used by SiteHeader (server component) and Navbar.
 */
import { SITE } from '@/constants';

export interface SiteSettings {
  _id?: string;
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
};

/** Server-side fetch — used by Server Components */
export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/settings`, {
      next: { revalidate: 3600, tags: ['settings'] },
    });
    if (!r.ok) return SETTINGS_FALLBACK;
    const d = await r.json() as { data?: SiteSettings; success?: boolean } | SiteSettings;
    // Handle both wrapped { data: ... } and plain response
    const payload = 'data' in d && d.data ? d.data : d as SiteSettings;
    return { ...SETTINGS_FALLBACK, ...payload };
  } catch {
    return SETTINGS_FALLBACK;
  }
}
