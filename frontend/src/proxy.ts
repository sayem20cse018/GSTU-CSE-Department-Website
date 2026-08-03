import { NextResponse, type NextRequest } from 'next/server';

const LOGIN_PATH    = '/admin/login';
const DASHBOARD     = '/admin/dashboard';
const ACCESS_COOKIE = 'cse_access';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin/* routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const hasToken = request.cookies.has(ACCESS_COOKIE);

  // ── Login page ─────────────────────────────────────────────────────────────
  // pathname.startsWith handles /admin/login?callbackUrl=... as well
  if (pathname === LOGIN_PATH) {
    if (hasToken) {
      // Already logged in → skip login page
      return NextResponse.redirect(new URL(DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // ── Every other /admin/* route ─────────────────────────────────────────────
  if (!hasToken) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
