import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400, headers: corsHeaders });
  }

  try {
    // Decode the target URL (might be base64 encoded)
    let decodedUrl: string;
    try {
      decodedUrl = Buffer.from(targetUrl, 'base64').toString('utf-8');
      // Validate it's a URL
      new URL(decodedUrl);
    } catch {
      // Not base64, use as-is
      decodedUrl = targetUrl;
    }

    console.log('[STREAM PROXY] Fetching:', decodedUrl.substring(0, 80) + '...');

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://modistreams.org/',
      },
    });

    if (!response.ok) {
      console.error(`[STREAM PROXY] Upstream error: ${response.status}`);
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status, headers: corsHeaders }
      );
    }

    const body = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl';

    console.log(`[STREAM PROXY] Success: ${contentType}, ${body.byteLength} bytes`);

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[STREAM PROXY] Error:', error);
    return NextResponse.json(
      { error: 'Proxy error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
