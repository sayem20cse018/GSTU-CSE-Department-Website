/**
 * Thin fetch wrapper for admin CRUD operations.
 *
 * All requests go through the Next.js /api/admin/[...path] proxy route,
 * which reads the httpOnly access cookie server-side and forwards it as
 * a Bearer token to the NestJS backend.
 *
 * This avoids cross-origin cookie issues in production (Vercel ↔ Render).
 */

// Always use the internal Next.js proxy — never call the backend directly
// from the browser in production.
const BASE = '/api/admin';

export async function adminGet<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!r.ok) {
    const json = await r.json().catch(() => ({})) as { message?: string };
    throw new Error(json.message ?? `Request failed: ${r.status}`);
  }
  const json = await r.json() as { data: T; success?: boolean };
  return (json as { data: T }).data;
}

export async function adminPost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await r.json() as { data: T; message?: string };
  if (!r.ok) throw new Error(json.message ?? `Request failed: ${r.status}`);
  return json.data;
}

export async function adminPatch<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await r.json() as { data: T; message?: string };
  if (!r.ok) throw new Error(json.message ?? `Request failed: ${r.status}`);
  return json.data;
}

export async function adminDelete(path: string): Promise<void> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!r.ok) {
    const json = await r.json().catch(() => ({})) as { message?: string };
    throw new Error(json.message ?? `Delete failed: ${r.status}`);
  }
}
