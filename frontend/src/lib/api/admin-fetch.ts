/**
 * Thin fetch wrapper for admin CRUD operations.
 * Reads the access token from the browser cookie and
 * attaches it as a Bearer header automatically.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function getToken(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/cse_access=([^;]+)/)?.[1] ?? '';
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminGet<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    headers: authHeaders(),
    credentials: 'include',
  });
  const json = await r.json() as { data: T; success?: boolean; message?: string };
  if (!r.ok) throw new Error((json as { message?: string }).message ?? `Request failed: ${r.status}`);
  return (json as { data: T }).data;
}

export async function adminPost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
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
    headers: authHeaders(),
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
    headers: authHeaders(),
    credentials: 'include',
  });
  if (!r.ok) {
    const json = await r.json().catch(() => ({})) as { message?: string };
    throw new Error(json.message ?? `Delete failed: ${r.status}`);
  }
}
