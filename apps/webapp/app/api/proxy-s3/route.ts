import { CLT_BASE_URLS_REQUIRE_PROXY } from '@/app/[modelId]/circuit/clt/clt-utils';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxies a GET request to an S3 URL
 * @param request The incoming request with a base64-encoded URL parameter
 * @returns The response from the S3 URL
 */
export async function GET(request: NextRequest) {
  try {
    // Get the URL parameter from the request
    const urlParam = request.nextUrl.searchParams.get('url');

    if (!urlParam) {
      return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    // Decode the base64-encoded URL
    let decodedUrl;
    try {
      decodedUrl = Buffer.from(urlParam, 'base64').toString('utf-8');
    } catch (error) {
      console.log('invalid url', decodedUrl);
      return NextResponse.json({ error: 'Invalid base64-encoded URL' }, { status: 400 });
    }

    // Validate the URL
    try {
      // eslint-disable-next-line no-new
      new URL(decodedUrl);
    } catch (error) {
      console.log('invalid url', decodedUrl);
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // ensure the URL starts with one of the allowed CLT_BASE_URLS
    if (!CLT_BASE_URLS_REQUIRE_PROXY.some((baseURL) => decodedUrl.startsWith(baseURL))) {
      console.log('disallowed url', decodedUrl);
      return NextResponse.json({ error: 'Disallowed URL' }, { status: 400 });
    }

    // Fetch the content from the URL
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from URL: ${response.status} ${response.statusText}` },
        { status: response.status },
      );
    }

    // Get the content type from the response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Get the response data
    const data = await response.arrayBuffer();

    // Return the response with the same content type
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
