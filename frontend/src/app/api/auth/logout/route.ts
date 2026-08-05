/**
 * POST /api/auth/logout
 *
 * Calls the NestJS logout endpoint (records activity), then clears
 * the httpOnly auth cookies.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, clearAuthCookies } from '@/lib/auth/cookies';

const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;

  // Best-effort: notify the backend even if there's no token
  if (accessToken) {
    try {
      await fetch(`${BACKEND}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      // Ignore — we still clear cookies regardless
    }
  }

  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 },
  );
  clearAuthCookies(response);
  return response;
}
