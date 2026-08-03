import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_PREFIX  = '/admin';
const LOGIN_PATH    = '/admin/login';
const DASHBOARD     = '/admin/dashboard';
const ACCESS_COOKIE = 'cse_access';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin/* routes
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  const hasToken = request.cookies.has(ACCESS_COOKIE);

  // ── On login page ──────────────────────────────────────────────────────────
  if (pathname === LOGIN_PATH) {
    // Already authenticated → go straight to dashboard
    if (hasToken) {
      return NextResponse.redirect(new URL(DASHBOARD, request.url));
    }
    // Not authenticated → show login, no redirect
    return NextResponse.next();
  }

  // ── Every other /admin/* page ──────────────────────────────────────────────
  if (!hasToken) {
    // Build login URL with callbackUrl so we can redirect back after login
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
