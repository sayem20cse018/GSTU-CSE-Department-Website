/**
 * GET /api/analytics/stats?start=<ms>&end=<ms>
 *
 * Server-side proxy to the Umami API.
 * Credentials never reach the browser.
 *
 * Required env vars (Vercel / .env.local):
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID  — Umami website UUID
 *   NEXT_PUBLIC_UMAMI_URL         — Umami instance base URL (no trailing slash)
 *   NEXT_PUBLIC_UMAMI_USERNAME    — Umami admin username
 *   NEXT_PUBLIC_UMAMI_PASSWORD    — Umami admin password
 *
 * Returns the Umami /api/websites/:id/stats response wrapped in { data }.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const baseUrl   = process.env.NEXT_PUBLIC_UMAMI_URL;
  const username  = process.env.NEXT_PUBLIC_UMAMI_USERNAME;
  const password  = process.env.NEXT_PUBLIC_UMAMI_PASSWORD;

  if (!websiteId || !baseUrl || !username || !password) {
    return NextResponse.json({ error: 'Analytics not configured' }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const startAt = searchParams.get('start') ?? String(Date.now() - 7 * 86_400_000);
  const endAt   = searchParams.get('end')   ?? String(Date.now());

  try {
    // 1. Obtain Umami auth token
    const authRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!authRes.ok) {
      return NextResponse.json({ error: 'Umami auth failed' }, { status: 502 });
    }
    const { token } = await authRes.json() as { token: string };

    // 2. Fetch website stats
    const statsRes = await fetch(
      `${baseUrl}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!statsRes.ok) {
      return NextResponse.json({ error: 'Umami stats request failed' }, { status: 502 });
    }
    const data = await statsRes.json();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Analytics request failed' }, { status: 503 });
  }
}
