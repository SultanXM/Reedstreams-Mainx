import { NextRequest, NextResponse } from 'next/server';

const REED_API_BASE = 'https://api.reedstreams.live';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const signedUrl = searchParams.get('url');
  
  if (!signedUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    // Decode the full signed URL if base64 encoded
    let targetUrl: string;
    try {
      targetUrl = Buffer.from(signedUrl, 'base64').toString('utf-8');
    } catch {
      targetUrl = signedUrl;
    }

    // If it's a relative path, make it absolute
    if (targetUrl.startsWith('/')) {
      targetUrl = `${REED_API_BASE}${targetUrl}`;
    }

    console.log('[SIGNED PROXY] Fetching:', targetUrl.substring(0, 150));

    // Fetch through reedstreams proxy with all original params intact
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://modistreams.org/',
      },
    });

    if (!response.ok) {
      console.error(`[SIGNED PROXY] Upstream error: ${response.status}`);
      return NextResponse.json({ error: `Upstream error: ${response.status}` }, { status: response.status });
    }

    // Get response
    const body = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl';
    
    console.log(`[SIGNED PROXY] Success: ${contentType}, ${body.byteLength} bytes`);

    // Return with CORS headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', '*');
    headers.set('Cache-Control', 'no-cache');

    return new NextResponse(body, { headers });
  } catch (error) {
    console.error('[SIGNED PROXY] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
