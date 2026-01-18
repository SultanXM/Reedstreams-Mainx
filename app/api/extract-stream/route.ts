import { NextResponse } from 'next/server';

/**
 * Stream URL Extractor
 * 
 * Takes an embed/iframe URL, fetches the HTML, and attempts to find 
 * the hidden .m3u8 stream URL using regex patterns.
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const embedUrl = searchParams.get('url');

    if (!embedUrl) {
        return NextResponse.json({ success: false, error: 'Missing URL' }, { status: 400, headers: corsHeaders });
    }

    try {
        console.log(`[Extractor] Fetching: ${embedUrl}`);

        const response = await fetch(embedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
                'Referer': new URL(embedUrl).origin,
            }
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: `Upstream ${response.status}` }, { status: response.status, headers: corsHeaders });
        }

        const html = await response.text();

        // Patterns to find m3u8
        const patterns = [
            /source\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i,
            /file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i,
            /src\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i,
            /["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i
        ];

        let extractedUrl: string | null = null;
        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                extractedUrl = match[1];
                break;
            }
        }

        if (extractedUrl) {
            // Found it! Return it wrapped in our proxy
            // We use the absolute URL of our own server for the proxy
            const ourOrigin = new URL(request.url).origin;
            const proxiedUrl = `${ourOrigin}/api/proxy/manifest?url=${encodeURIComponent(extractedUrl)}`;

            return NextResponse.json({
                success: true,
                originalUrl: extractedUrl,
                streamUrl: proxiedUrl
            }, { headers: corsHeaders });
        }

        return NextResponse.json({ success: false, error: 'No m3u8 found' }, { headers: corsHeaders });

    } catch (error) {
        console.error('[Extractor Error]', error);
        return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500, headers: corsHeaders });
    }
}
