/**
 * /api/admin/[...path]
 *
 * Generic proxy for ALL admin CRUD + file-upload operations.
 * Reads the httpOnly access cookie (server-side) and forwards it
 * as a Bearer token to the NestJS backend.
 *
 * Handles both JSON and multipart/form-data (file uploads).
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const backendPath = path.join('/');

  // Preserve query string
  const searchParams = req.nextUrl.searchParams.toString();
  const backendUrl = `${BACKEND}/${backendPath}${searchParams ? `?${searchParams}` : ''}`;

  // Read access token from httpOnly cookie (server-side only)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('cse_access')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 },
    );
  }

  const backendReq: RequestInit = {
    method: req.method,
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  // Forward body — detect content type to handle both JSON and FormData
  if (req.method !== 'GET' && req.method !== 'DELETE' && req.method !== 'HEAD') {
    const contentType = req.headers.get('content-type') ?? '';

    if (contentType.includes('multipart/form-data')) {
      // File upload — forward raw FormData (don't set Content-Type, let fetch set boundary)
      const formData = await req.formData();
      backendReq.body = formData;
      // Don't set Content-Type header — fetch sets it automatically with boundary
    } else {
      // JSON or other text body
      const text = await req.text();
      if (text) {
        backendReq.body = text;
        (backendReq.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }
    }
  }

  // Timeout: 28s (Vercel function max is 30s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 28_000);
  backendReq.signal = controller.signal as AbortSignal;

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, backendReq);
  } catch (err) {
    clearTimeout(timeout);
    console.error('[/api/admin proxy]', err);
    return NextResponse.json(
      { success: false, message: 'Backend unreachable' },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }

  // 204 No Content (DELETE success)
  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.json().catch(() => null);
  return NextResponse.json(data ?? {}, { status: backendRes.status });
}

export const GET    = handler;
export const POST   = handler;
export const PATCH  = handler;
export const DELETE = handler;
export const PUT    = handler;
