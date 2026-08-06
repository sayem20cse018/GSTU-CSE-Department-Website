/**
 * Admin CRUD wrapper — all requests go through /api/admin/[...path] proxy.
 * The proxy reads the httpOnly cookie server-side and forwards Bearer token.
 */

const BASE = '/api/admin';

/** Safe JSON parse — returns null if body is not JSON (e.g. HTML error page) */
async function safeJson(r: Response): Promise<Record<string, unknown> | null> {
  try {
    return await r.json() as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function adminGet<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  const json = await safeJson(r);
  if (!r.ok) {
    throw new Error((json?.message as string) ?? `Request failed: ${r.status}`);
  }
  return (json as { data: T }).data;
}

export async function adminPost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await safeJson(r);
  if (!r.ok) {
    throw new Error((json?.message as string) ?? `Request failed: ${r.status}`);
  }
  return (json as { data: T }).data;
}

export async function adminPatch<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await safeJson(r);
  if (!r.ok) {
    throw new Error((json?.message as string) ?? `Request failed: ${r.status}`);
  }
  return (json as { data: T }).data;
}

export async function adminDelete(path: string): Promise<void> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!r.ok) {
    const json = await safeJson(r);
    throw new Error((json?.message as string) ?? `Delete failed: ${r.status}`);
  }
}
