/**
 * Server-only data access for the public Faculty directory.
 *
 * Uses raw `fetch` (the shared `apiClient` does not unwrap the `{ success, data }`
 * envelope the backend returns) and React `cache` so that `generateMetadata`
 * and the page component share a single request per slug.
 *
 * Every request is bounded by a timeout so a cold/unreachable backend fails fast
 * and renders a graceful fallback instead of hanging until the platform's
 * function timeout. The timeout is kept below Vercel's serverless function-timeout
 * floor so the fallback always renders first.
 */

import { cache } from 'react';
import type { FacultyMember } from './shared';

/** Abort a request after this many ms. See note above. */
export const FACULTY_FETCH_TIMEOUT_MS = 9000;

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

type FetchOpts = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

/**
 * List fetch result.
 * - `ok: true, members: []` → the directory genuinely has no faculty yet.
 * - `ok: false`            → the request failed (timeout / network / non-2xx);
 *                            must NOT be treated as an empty list.
 */
export type FacultyListResult =
  | { ok: true; members: FacultyMember[] }
  | { ok: false };

/**
 * Single-member fetch result.
 * - `ok: true, member: <obj>` → found.
 * - `ok: true, member: null`   → genuinely not found (404).
 * - `ok: false`                → request failed; do NOT 404, render a retry state.
 */
export type FacultyOneResult =
  | { ok: true; member: FacultyMember | null }
  | { ok: false };

/** fetch with an abort timeout; never throws (returns null on any failure). */
async function fetchJsonWithTimeout(
  url: string,
  revalidate: number | false,
): Promise<FacultyMember[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FACULTY_FETCH_TIMEOUT_MS);
  try {
    const opts: FetchOpts =
      revalidate === false
        ? { cache: 'no-store', signal: controller.signal }
        : { next: { revalidate }, signal: controller.signal };
    const res = await fetch(url, opts);
    if (!res.ok) return null;
    const json = (await res.json()) as Envelope<FacultyMember[]>;
    return Array.isArray(json.data) ? json.data : null;
  } catch {
    return null; // timeout, network error, or parse failure
  } finally {
    clearTimeout(timer);
  }
}

export const fetchFacultyList = cache(
  async (revalidate: number | false = false): Promise<FacultyListResult> => {
    const data = await fetchJsonWithTimeout(`${getApiBase()}/faculty`, revalidate);
    return data === null ? { ok: false } : { ok: true, members: data };
  },
);

/**
 * Resolve a single member by slug (or id) from the list, which already includes
 * the `education`, `publications`, `awards` and `officeHours` relations.
 */
export const fetchFacultyBySlug = cache(
  async (slug: string): Promise<FacultyOneResult> => {
    const data = await fetchJsonWithTimeout(`${getApiBase()}/faculty`, false);
    if (data === null) return { ok: false };
    const member = data.find((f) => f.slug === slug || f.id === slug) ?? null;
    return { ok: true, member };
  },
);
