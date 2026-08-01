import { type NextRequest, type NextResponse } from 'next/server';

// ─── Cookie names ─────────────────────────────────────────────────────────────
export const ACCESS_COOKIE  = 'cse_access';
export const REFRESH_COOKIE = 'cse_refresh';

const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Set auth cookies on the response ────────────────────────────────────────
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,   // access token TTL in seconds
): void {
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: expiresIn,
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// ─── Clear auth cookies ───────────────────────────────────────────────────────
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
}

// ─── Read access token from request cookies ───────────────────────────────────
export function getAccessToken(request: NextRequest): string | undefined {
  return request.cookies.get(ACCESS_COOKIE)?.value;
}

export function getRefreshToken(request: NextRequest): string | undefined {
  return request.cookies.get(REFRESH_COOKIE)?.value;
}
