/**
 * POST /api/auth/refresh
 *
 * Uses the httpOnly refresh cookie to obtain a new access token from
 * the NestJS backend and updates the access cookie silently.
 */
import { NextRequest, NextResponse } from 'next/server';
import { REFRESH_COOKIE, setAuthCookies } from '@/lib/auth/cookies';

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: 'No refresh token' },
      { status: 401 },
    );
  }

  try {
    const backendRes = await fetch(`${BACKEND}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await backendRes.json() as {
      success: boolean;
      data?: { accessToken: string; expiresIn: number };
      message?: string;
    };

    if (!backendRes.ok || !data.success || !data.data) {
      return NextResponse.json(
        { success: false, message: data.message ?? 'Refresh failed' },
        { status: 401 },
      );
    }

    const { accessToken, expiresIn } = data.data;
    const response = NextResponse.json({ success: true }, { status: 200 });
    // Update access cookie; keep existing refresh cookie
    setAuthCookies(response, accessToken, refreshToken, expiresIn);
    return response;

  } catch (err) {
    console.error('[/api/auth/refresh]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
