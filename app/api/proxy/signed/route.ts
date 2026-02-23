import { NextRequest, NextResponse } from 'next/server';
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
    if (targetUrl.startsWith('/api/v1/')) {
      targetUrl = `${REED_API_BASE}${targetUrl}`;
    }

    console.log('[SIGNED PROXY] Fetching:', targetUrl.substring(0, 150));

    // Fetch from edge API
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

    const contentType = response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl';
    
    // For M3U8 manifests, rewrite relative URLs to absolute edge URLs
    if (contentType.includes('mpegurl') || contentType.includes('m3u8')) {
      const manifestText = await response.text();
      const baseUrl = new URL(targetUrl);
      
      // Extract the base path for the stream (everything before the last /)
      const streamBaseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
      
      const rewrittenManifest = manifestText.split('\n').map(line => {
        const trimmed = line.trim();
        
        // Skip empty lines and comments (but handle special tags)
        if (!trimmed) return line;
        
        // Handle KEY URI attributes - make them absolute edge URLs
        if (trimmed.startsWith('#')) {
          if (trimmed.startsWith('#EXT-X-KEY')) {
            return trimmed.replace(/URI="([^"]*)"/, (match, uri) => {
              // If already absolute, keep it; otherwise make it absolute to edge
              const absoluteUri = uri.startsWith('http') ? uri : `${REED_API_BASE}${uri.startsWith('/') ? '' : '/'}${uri}`;
              return `URI="${absoluteUri}"`;
            });
          }
          return line;
        }
        
        // It's a segment/media URL - make it absolute to the edge API
        if (trimmed.startsWith('http')) {
          return trimmed; // Already absolute
        }
        
        // Relative URL - prepend the edge API base
        // The edge API returns paths like /api/v1/proxy?url=... for segments
        if (trimmed.startsWith('/')) {
          return `${REED_API_BASE}${trimmed}`;
        }
        
        // Relative path without leading slash - use stream base URL
        return `${streamBaseUrl}${trimmed}`;
      }).join('\n');

      console.log(`[SIGNED PROXY] Rewrote manifest with edge URLs`);

      return new NextResponse(rewrittenManifest, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'no-cache',
          ...corsHeaders
        }
      });
    }

    // For non-manifest content (segments, keys), just proxy through with CORS
    const body = await response.arrayBuffer();
    
    console.log(`[SIGNED PROXY] Proxying segment: ${contentType}, ${body.byteLength} bytes`);

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
