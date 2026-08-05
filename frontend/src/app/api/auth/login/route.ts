/**
 * POST /api/auth/login
 *
 * Proxies login to NestJS backend, then stores tokens in httpOnly cookies
 * so the browser never touches the raw JWT strings.
 */
import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth/cookies';

// BACKEND_URL is a server-only env var — safe for server-side API routes.
// NEXT_PUBLIC_API_URL is a build-time client var and must NOT be used here.
const BACKEND = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Forward to NestJS
    const backendRes = await fetch(`${BACKEND}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    const data = await backendRes.json() as {
      success: boolean;
      data?: { accessToken: string; refreshToken: string; expiresIn: number; admin: unknown };
      message?: string;
    };

    if (!backendRes.ok || !data.success || !data.data) {
      return NextResponse.json(
        { success: false, message: data.message ?? 'Invalid credentials' },
        { status: backendRes.status },
      );
    }

    const { accessToken, refreshToken, expiresIn, admin } = data.data;

    // Return admin profile to the browser — tokens go into httpOnly cookies
    const response = NextResponse.json({ success: true, data: { admin } }, { status: 200 });
    setAuthCookies(response, accessToken, refreshToken, expiresIn);
    return response;

  } catch (err) {
    console.error('[/api/auth/login]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
