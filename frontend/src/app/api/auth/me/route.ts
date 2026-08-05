/**
 * GET /api/auth/me
 *
 * Reads the httpOnly access cookie and forwards it to the NestJS /auth/me
 * endpoint. Returns the admin profile to the browser.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE } from '@/lib/auth/cookies';

const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 },
    );
  }

  try {
    const backendRes = await fetch(`${BACKEND}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      // no-store: always fresh, never cached
      cache: 'no-store',
    });

    const data = await backendRes.json() as { success: boolean; data?: unknown; message?: string };

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message ?? 'Session expired' },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true, data: data.data }, { status: 200 });

  } catch (err) {
    console.error('[/api/auth/me]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
