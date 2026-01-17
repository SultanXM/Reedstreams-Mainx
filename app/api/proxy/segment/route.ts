import { NextResponse } from 'next/server';

/**
 * HLS Segment Proxy for iOS Compatibility
 * 
 * This proxy fetches HLS video segments (.ts, .m4s, .mp4) and
 * encryption keys (.key) with proper CORS headers for iOS.
 * 
 * Usage: /api/proxy/segment?url=https://example.com/segment.ts
 */

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const segmentUrl = searchParams.get('url');

    if (!segmentUrl) {
        return new NextResponse('Missing segment URL', { status: 400 });
    }

    try {
        console.log(`[SEGMENT PROXY] Fetching: ${segmentUrl}`);

        const response = await fetch(segmentUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': new URL(segmentUrl).origin + '/',
                'Origin': new URL(segmentUrl).origin,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`[SEGMENT PROXY] Error: ${response.status} ${response.statusText}`);
            return new NextResponse(`Upstream error: ${response.status}`, {
                status: response.status,
                headers: getCorsHeaders()
            });
        }

        const contentBuffer = await response.arrayBuffer();

        // Determine Content-Type based on file extension
        const contentType = getContentType(segmentUrl);

        console.log(`[SEGMENT PROXY] Success - Size: ${contentBuffer.byteLength}, Type: ${contentType}`);

        return new NextResponse(contentBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': contentBuffer.byteLength.toString(),
                'Cache-Control': 'max-age=31536000', // Segments can be cached
                ...getCorsHeaders()
            }
        });

    } catch (error) {
        console.error('[SEGMENT PROXY] Critical error:', error);
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
 * Determine Content-Type based on file extension
 */
function getContentType(url: string): string {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('.ts')) {
        return 'video/MP2T';
    }
    if (lowerUrl.includes('.m4s')) {
        return 'video/iso.segment';
    }
    if (lowerUrl.includes('.mp4')) {
        return 'video/mp4';
    }
    if (lowerUrl.includes('.m3u8')) {
        return 'application/vnd.apple.mpegurl';
    }
    if (lowerUrl.includes('.key')) {
        return 'application/octet-stream';
    }
    if (lowerUrl.includes('.aac')) {
        return 'audio/aac';
    }

    return 'application/octet-stream';
}
