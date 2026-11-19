/**
 * Server-only data access for the public Faculty directory.
 *
 * Uses raw `fetch` (the shared `apiClient` does not unwrap the `{ success, data }`
 * envelope the backend returns) and React `cache` so that `generateMetadata`
 * and the page component share a single request per slug.
 */

import { cache } from 'react';
import type { FacultyMember } from './shared';

export function getApiBase(): string {
  return (
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:4000/api'
  );
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
}

/**
 * Fetch every active faculty member (with relations).
 * @param revalidate seconds for ISR; `false` always fetches fresh (no-store).
 */
export const fetchFacultyList = cache(
  async (revalidate: number | false = false): Promise<FacultyMember[]> => {
    try {
      const opts: RequestInit =
        revalidate === false
          ? { cache: 'no-store' }
          : { next: { revalidate } };
      const res = await fetch(`${getApiBase()}/faculty`, opts);
      if (!res.ok) return [];
      const json = (await res.json()) as Envelope<FacultyMember[]>;
      return Array.isArray(json.data) ? json.data : [];
    } catch {
      return [];
    }
  },
);

/**
 * Resolve a single member by slug (or id) from the list, which already includes
 * the `education`, `publications`, `awards` and `officeHours` relations.
 */
export const fetchFacultyBySlug = cache(
  async (slug: string): Promise<FacultyMember | null> => {
    const list = await fetchFacultyList(false);
    return list.find((f) => f.slug === slug || f.id === slug) ?? null;
  },
);
