/**
 * /api/public/[...path]
 *
 * Server-side proxy for PUBLIC (unauthenticated) backend endpoints.
 * Used by client components that need to call the backend but cannot
 * rely on NEXT_PUBLIC_API_URL being available at runtime in production.
 *
 * Examples:
 *   GET /api/public/settings      → backend /api/settings
 *   GET /api/public/hero-slides   → backend /api/hero-slides
 *   GET /api/public/faculty       → backend /api/faculty
 */
import { NextRequest, NextResponse } from 'next/server';

const BACKEND =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000/api';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const backendPath = path.join('/');

  // Forward query string
  const search = req.nextUrl.search;
  const url    = `${BACKEND}/${backendPath}${search}`;

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next:    { revalidate: 60 },   // cache 60 s
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data ?? {}, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Backend unreachable' },
      { status: 503 },
    );
  }
}
