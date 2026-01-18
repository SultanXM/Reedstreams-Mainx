import { NextResponse } from 'next/server';

/**
 * HLS Segment Proxy
 * 
 * Proxies media segments (.ts, .m4s) and keys to ensure CORS compliance.
 */

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
    const segmentUrl = searchParams.get('url');

    if (!segmentUrl) {
        return new NextResponse('Missing URL', { status: 400, headers: corsHeaders });
    }

    try {
        const response = await fetch(segmentUrl, {
            headers: {
                // Mimic a browser request
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                'Accept': '*/*',
            },
        });

        if (!response.ok) {
            return new NextResponse(`Upstream Error: ${response.status}`, { status: response.status, headers: corsHeaders });
        }

        const buffer = await response.arrayBuffer();

        // Pass through Content-Type or default to typical TS
        const contentType = response.headers.get('Content-Type') || 'video/mp2t';

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
                ...corsHeaders
            }
        });

    } catch (error) {
        console.error('[Segment Proxy Error]', error);
        return new NextResponse('Proxy Error', { status: 500, headers: corsHeaders });
    }
}
