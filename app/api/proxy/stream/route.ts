import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    // Decode base64 URL
    let decodedUrl: string;
    try {
      decodedUrl = Buffer.from(targetUrl, 'base64').toString('utf-8');
    } catch {
      decodedUrl = targetUrl;
    }

    console.log('[STREAM PROXY] Fetching:', decodedUrl.substring(0, 100) + '...');

    // Fetch with headers that mimic a real browser
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://modistreams.org',
        'Referer': 'https://modistreams.org/',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });

    if (!response.ok) {
      console.error(`[STREAM PROXY] Upstream error: ${response.status}`);
      return NextResponse.json({ error: `Stream fetch failed: ${response.status}` }, { status: response.status });
    }

    // Get the response body
    const body = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl';
    
    console.log(`[STREAM PROXY] Success, content-type: ${contentType}, size: ${body.byteLength}`);
    
    // Create response with proper headers for streaming
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', '*');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Copy important headers from upstream
    const cacheControl = response.headers.get('Cache-Control');
    if (cacheControl) headers.set('Cache-Control', cacheControl);

    return new NextResponse(body, { headers });
  } catch (error) {
    console.error('[STREAM PROXY] Error:', error);
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
