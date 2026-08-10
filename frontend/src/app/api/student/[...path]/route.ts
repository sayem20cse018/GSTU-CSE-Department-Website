/**
 * /api/student/[...path]
 *
 * Proxy for all student auth endpoints:
 *   POST /api/student/login     → backend /api/students/login
 *   POST /api/student/register  → backend /api/students/register
 *   GET  /api/student/me        → backend /api/students/me  (reads cookie)
 *   POST /api/student/logout    → backend /api/students/logout
 *   POST /api/student/heartbeat → backend /api/students/heartbeat
 *
 * The session cookie `cse_student` is set by the backend and forwarded
 * back to the browser as a Set-Cookie header.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000/api';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const backendUrl = `${BACKEND}/students/${path.join('/')}`;

  // Forward existing student cookie to backend so it can validate the session
  const cookieStore  = await cookies();
  const sessionToken = cookieStore.get('cse_student')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (sessionToken) {
    headers['Cookie'] = `cse_student=${sessionToken}`;
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
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.json().catch(() => ({}));
  const res  = NextResponse.json(data, { status: backendRes.status });

  // Forward Set-Cookie headers from backend (session cookie) to browser
  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}

export const GET    = handler;
export const POST   = handler;
export const PATCH  = handler;
export const DELETE = handler;
export const PUT    = handler;
