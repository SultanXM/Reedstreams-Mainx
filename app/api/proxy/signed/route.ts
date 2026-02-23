import { NextRequest, NextResponse } from 'next-server';
import { REED_API_BASE } from '@/config/api';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const signedUrl = searchParams.get('url');
  
  if (!signedUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400, headers: corsHeaders });
  }

  try {
    // Decode the full signed URL if base64 encoded
    let targetUrl: string;
    try {
      targetUrl = Buffer.from(signedUrl, 'base64').toString('utf-8');
    } catch {
      targetUrl = signedUrl;
    }

    // If it's a relative /api/v1/proxy path, convert to external URL
    // The upstream API returns URLs like /api/v1/proxy?url=...
    if (targetUrl.startsWith('/api/v1/')) {
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
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status, headers: corsHeaders }
      );
    }

    // Get the content type
    const contentType = response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl';
    
    // For M3U8 manifests, we need to rewrite URLs to go through our proxy
    if (contentType.includes('mpegurl') || contentType.includes('m3u8')) {
      const manifestText = await response.text();
      
      // Rewrite segment URLs in the manifest to go through our segment proxy
      const baseUrl = new URL(targetUrl);
      const rewrittenManifest = manifestText.split('\n').map(line => {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) {
          // Handle KEY URI attributes
          if (trimmed.startsWith('#EXT-X-KEY')) {
            return trimmed.replace(/URI="([^"]*)"/, (match, uri) => {
              const absoluteUri = uri.startsWith('http') ? uri : new URL(uri, baseUrl).toString();
              const encodedUri = Buffer.from(absoluteUri).toString('base64');
              return `URI="/api/proxy/segment?url=${encodeURIComponent(encodedUri)}"`;
            });
          }
          return line;
        }
        
        // It's a segment URL - convert to absolute and wrap in our proxy
        const absoluteUrl = trimmed.startsWith('http') 
          ? trimmed 
          : new URL(trimmed, baseUrl).toString();
        const encodedUrl = Buffer.from(absoluteUrl).toString('base64');
        return `/api/proxy/segment?url=${encodeURIComponent(encodedUrl)}`;
      }).join('\n');

      console.log(`[SIGNED PROXY] Rewrote M3U8 manifest`);

      return new NextResponse(rewrittenManifest, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });
    }

    // For non-manifest content, just proxy through
    const body = await response.arrayBuffer();
    
    console.log(`[SIGNED PROXY] Success: ${contentType}, ${body.byteLength} bytes`);

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('[SIGNED PROXY] Error:', error);
    return NextResponse.json(
      { error: 'Proxy error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
