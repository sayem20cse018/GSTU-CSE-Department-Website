import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Simple liveness probe for Vercel deployment checks.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "cse-frontend",
    timestamp: new Date().toISOString(),
  });
}
