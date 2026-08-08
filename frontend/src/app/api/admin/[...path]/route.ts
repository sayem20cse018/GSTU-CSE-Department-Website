/**
 * /api/admin/[...path]
 *
 * Generic proxy for ALL admin CRUD operations.
 * Reads the httpOnly access cookie (server-side) and forwards it
 * as a Bearer token to the NestJS backend.
 *
 * Usage from client:
 *   fetch('/api/admin/faculty', { method:'POST', body:JSON.stringify(data) })
 *   fetch('/api/admin/notices/123', { method:'PATCH', body:... })
 *   fetch('/api/admin/faculty/123', { method:'DELETE' })
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// BACKEND_URL is server-only — works correctly in serverless API routes at runtime.
const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const backendPath = path.join('/');
  const backendUrl  = `${BACKEND}/${backendPath}`;

  // Read access token from httpOnly cookie (server-side only)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('cse_access')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 },
    );
  }

  // Build forwarded request headers
  const forwardHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization:  `Bearer ${accessToken}`,
  };

  // Forward the request to backend
  try {
    const backendReq: RequestInit = {
      method:  req.method,
      headers: forwardHeaders,
    };

    // Forward body for POST / PATCH / PUT
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      const text = await req.text();
      if (text) backendReq.body = text;
    }

    // Timeout: 28s (Vercel function max is 30s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28000);
    backendReq.signal = controller.signal as AbortSignal;

    let backendRes: Response;
    try {
      backendRes = await fetch(backendUrl, backendReq);
    } finally {
      clearTimeout(timeout);
    }

    // 204 No Content (DELETE success)
    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data ?? {}, { status: backendRes.status });

  } catch (err) {
    console.error('[/api/admin proxy]', err);
    return NextResponse.json(
      { success: false, message: 'Backend unreachable' },
      { status: 503 },
    );
  }
}

export const GET    = handler;
export const POST   = handler;
export const PATCH  = handler;
export const DELETE = handler;
export const PUT    = handler;
