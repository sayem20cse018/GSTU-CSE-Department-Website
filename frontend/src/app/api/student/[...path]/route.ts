/**
 * /api/student/[...path]
 *
 * Proxy for student auth endpoints.
 * For login/register: stores session token in a Next.js httpOnly cookie
 * so it works correctly in production (Vercel → Render cross-origin).
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000/api';

const STUDENT_COOKIE = 'cse_student';
const IS_PROD = process.env.NODE_ENV === 'production';

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   IS_PROD,
  sameSite: 'lax' as const,
  path:     '/',
  maxAge:   7 * 24 * 60 * 60, // 7 days in seconds
} as const;

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const action   = path[path.length - 1]; // login | register | logout | me | heartbeat
  const backendUrl = `${BACKEND}/students/${path.join('/')}`;

  // Forward existing student cookie to backend for session validation
  const cookieStore   = await cookies();
  const sessionToken  = cookieStore.get(STUDENT_COOKIE)?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  // Send cookie to backend so it can read req.cookies.cse_student
  if (sessionToken) {
    headers['Cookie'] = `${STUDENT_COOKIE}=${sessionToken}`;
  }

  const init: RequestInit = { method: req.method, headers };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const text = await req.text();
    if (text) init.body = text;
  }

  let backendRes: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28_000);
    try {
      backendRes = await fetch(backendUrl, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return NextResponse.json({ message: 'Backend unreachable' }, { status: 503 });
  }

  if (backendRes.status === 204) {
    // logout or heartbeat
    const res = new NextResponse(null, { status: 204 });
    if (action === 'logout') {
      res.cookies.delete(STUDENT_COOKIE);
    }
    return res;
  }

  const data = await backendRes.json().catch(() => ({})) as Record<string, unknown>;
  const res  = NextResponse.json(data, { status: backendRes.status });

  if (!backendRes.ok) return res;

  // For login/register — extract token from backend response and set our own cookie
  if (action === 'login' || action === 'register') {
    // Backend returns { student: {...}, token: "..." } via ResponseInterceptor → { data: { student, token } }
    // But students controller returns directly without going through ResponseInterceptor for these
    // Check both wrapped and unwrapped formats
    const inner = (data.data ?? data) as Record<string, unknown>;
    const token = (inner.token ?? data.token) as string | undefined;

    if (token) {
      res.cookies.set(STUDENT_COOKIE, token, COOKIE_OPTS);
    }
  }

  return res;
}

export const GET    = handler;
export const POST   = handler;
export const PATCH  = handler;
export const DELETE = handler;
export const PUT    = handler;
