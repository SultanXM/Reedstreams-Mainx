import { NextResponse } from 'next/server';

/**
 * HLS Manifest Proxy for iOS Compatibility
 * 
 * iOS (Safari) enforces strict CORS and SSL policies for HLS streams.
 * This proxy fetches the .m3u8 manifest from external servers and serves
 * it with proper CORS headers and correct Content-Type.
 * 
 * Usage: /api/proxy/manifest?url=https://example.com/stream.m3u8
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manifestUrl = searchParams.get('url');

  if (!manifestUrl) {
    return new NextResponse('Missing manifest URL', { status: 400 });
  }

  // Validate URL is for m3u8
  if (!manifestUrl.includes('.m3u8')) {
    return new NextResponse('Invalid manifest URL', { status: 400 });
  }

  try {
    console.log(`[MANIFEST PROXY] Fetching: ${manifestUrl}`);
    
    const response = await fetch(manifestUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': new URL(manifestUrl).origin + '/',
        'Origin': new URL(manifestUrl).origin,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[MANIFEST PROXY] Error: ${response.status} ${response.statusText}`);
      return new NextResponse(`Upstream error: ${response.status}`, { 
        status: response.status,
        headers: getCorsHeaders()
      });
    }

    let manifestContent = await response.text();
    
    // Rewrite relative URLs in manifest to absolute URLs
    const baseUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf('/') + 1);
    manifestContent = rewriteManifestUrls(manifestContent, baseUrl);
    
    console.log(`[MANIFEST PROXY] Success - Content length: ${manifestContent.length}`);

    // Determine correct Content-Type for HLS
    const contentType = manifestUrl.includes('.m3u8') 
      ? 'application/vnd.apple.mpegurl' 
      : 'application/octet-stream';

    return new NextResponse(manifestContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...getCorsHeaders()
      }
    });

  } catch (error) {
    console.error('[MANIFEST PROXY] Critical error:', error);
    return new NextResponse('Proxy error', { 
      status: 500,
      headers: getCorsHeaders()
    });
  }
}

/**
 * Handle OPTIONS preflight requests for CORS
 */
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders()
  });
}

/**
 * Generate CORS headers required for iOS HLS playback
 */
function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Rewrite relative URLs in the manifest to absolute URLs
 * This ensures that segment URLs are also accessible
 */
function rewriteManifestUrls(content: string, baseUrl: string): string {
  // Rewrite relative segment/playlist references to absolute
  const lines = content.split('\n');
  const rewrittenLines = lines.map(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comment lines (starting with #)
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      // But handle #EXT-X-MAP and #EXT-X-KEY URIs
      if (trimmedLine.includes('URI="')) {
        return rewriteUriAttribute(trimmedLine, baseUrl);
      }
      return line;
    }
    
    // If line is a relative URL (not starting with http), make it absolute
    if (!trimmedLine.startsWith('http://') && !trimmedLine.startsWith('https://')) {
      // Handle relative paths
      if (trimmedLine.startsWith('/')) {
        // Absolute path from origin
        const urlObj = new URL(baseUrl);
        return urlObj.origin + trimmedLine;
      } else {
        // Relative to current path
        return baseUrl + trimmedLine;
      }
    }
    
    return line;
  });
  
  return rewrittenLines.join('\n');
}

/**
 * Rewrite URI attributes in HLS tags like #EXT-X-MAP and #EXT-X-KEY
 */
function rewriteUriAttribute(line: string, baseUrl: string): string {
  return line.replace(/URI="([^"]+)"/, (match, uri) => {
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return match; // Already absolute
    }
    if (uri.startsWith('/')) {
      const urlObj = new URL(baseUrl);
      return `URI="${urlObj.origin}${uri}"`;
    }
    return `URI="${baseUrl}${uri}"`;
  });
}
