/**
 * GET /api/download?url=<encoded>&name=<filename>
 *
 * Proxies file download so cross-origin Cloudinary files trigger a real
 * browser "Save As" dialog instead of opening in a new tab.
 * The `download` attribute on <a> only works for same-origin URLs in most browsers.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const fileUrl  = req.nextUrl.searchParams.get('url');
  const fileName = req.nextUrl.searchParams.get('name') ?? 'download';

  if (!fileUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Validate URL is parseable
  let parsed: URL;
  try { parsed = new URL(fileUrl); }
  catch { return new NextResponse('Invalid URL', { status: 400 }); }

  // Only allow http/https
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return new NextResponse('Only HTTP/HTTPS URLs allowed', { status: 400 });
  }

  try {
    const res = await fetch(fileUrl, {
      headers: { 'User-Agent': 'GSTU-CSE-Website/1.0' },
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      return new NextResponse('File not found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
    const blob = await res.arrayBuffer();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type':        contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control':       'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Download failed', { status: 502 });
  }
}
