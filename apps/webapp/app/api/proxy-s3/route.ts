import { NextResponse } from 'next/server';

/**
 * Proxies a GET request to an S3 URL
 * @param request The incoming request with a base64-encoded URL parameter
 * @returns The response from the S3 URL
 */
export async function GET() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
