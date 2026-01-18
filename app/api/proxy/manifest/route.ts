import { NextResponse } from 'next/server';

/**
 * HLS Manifest Proxy
 * 
 * Fetches an external .m3u8 manifest and serves it with:
 * 1. Correct CORS headers (Access-Control-Allow-Origin: *)
 * 2. Correct Content-Type (application/vnd.apple.mpegurl)
 * 3. Rewritten internal URLs to point to our segment proxy
 * 
 * This allows iOS Safari (and other players) to play streams 
 * from servers that lack proper CORS configuration.
 */

// Global CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range, Authorization',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manifestUrl = searchParams.get('url');

  if (!manifestUrl) {
    return new NextResponse('Missing URL parameter', { status: 400, headers: corsHeaders });
  }

  try {
    const response = await fetch(manifestUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Upstream Error: ${response.status}`, { status: response.status, headers: corsHeaders });
    }

    let content = await response.text();
    const baseUrl = new URL(manifestUrl);

    // Rewrite URLs
    // If they are relative, make them absolute
    // Then wrap them in our segment proxy

    // Helper to wrap a URL in our proxy
    const wrapUrl = (url: string) => {
      // Resolve relative URLs
      const absoluteUrl = new URL(url, baseUrl.toString()).toString();
      // Point to our segment proxy
      // Use existing origin
      const ourOrigin = new URL(request.url).origin;
      return `${ourOrigin}/api/proxy/segment?url=${encodeURIComponent(absoluteUrl)}`;
    };

    // Rewrite lines that are NOT comments (#) and usually end in .ts, .m4s, or .key
    // OR are sub-manifests (.m3u8)
    content = content.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        // Check for URI="..." attribute in #EXT-X-KEY
        if (trimmed.startsWith('#EXT-X-KEY')) {
          return trimmed.replace(/URI="([^"]*)"/, (match, group1) => {
            return `URI="${wrapUrl(group1)}"`;
          });
        }
        return line;
      }
      // It's a URL line
      return wrapUrl(trimmed);
    }).join('\n');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('[Manifest Proxy Error]', error);
    return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
  }
}
