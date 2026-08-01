import { NextResponse, type NextRequest } from 'next/server';

// ─── Protected admin path prefix ─────────────────────────────────────────────
const ADMIN_PREFIX  = '/admin';
const LOGIN_PATH    = '/admin/login';
const DASHBOARD     = '/admin/dashboard';
const ACCESS_COOKIE = 'cse_access';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin/* routes
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  const hasToken = request.cookies.has(ACCESS_COOKIE);

  // ── Already on login page ──────────────────────────────────────────────────
  if (pathname === LOGIN_PATH) {
    // If already authenticated, skip login and go to dashboard
    if (hasToken) {
      return NextResponse.redirect(new URL(DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // ── Any other /admin/* route ───────────────────────────────────────────────
  if (!hasToken) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    // Preserve the original URL so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all /admin routes except static files and API routes
  matcher: ['/admin/:path*'],
};
