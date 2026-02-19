import { NextResponse } from 'next/server';

const REED_API_BASE = 'https://api.reedstreams.live';
const REED_API_V1 = `${REED_API_BASE}/api/v1`;

interface RouteParams {
  params: Promise<{ id: string }>
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    console.log(`[REED STREAM] Fetching signed URL for game ${id}`);

    // Get the signed URL from reedstreams API
    const signedUrlRes = await fetch(`${REED_API_V1}/streams/ppvsu/${id}/signed-url`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!signedUrlRes.ok) {
      console.error(`[REED STREAM] Error: ${signedUrlRes.status}`);
      return NextResponse.json({ error: `Failed: ${signedUrlRes.status}` }, { status: 500, headers: corsHeaders });
    }

    const signedData = await signedUrlRes.json();
    
    if (!signedData.signed_url) {
      return NextResponse.json({ error: 'No stream URL' }, { status: 404, headers: corsHeaders });
    }

    // Build the full signed URL
    const fullSignedUrl = signedData.signed_url.startsWith('http') 
      ? signedData.signed_url 
      : `${REED_API_BASE}${signedData.signed_url}`;

    // Base64 encode it for our proxy
    const encodedUrl = Buffer.from(fullSignedUrl).toString('base64');
    
    // Create our proxy URL that keeps the signature intact
    const proxyUrl = `/api/proxy/signed?url=${encodeURIComponent(encodedUrl)}`;

    console.log(`[REED STREAM] Proxy URL: ${proxyUrl.substring(0, 100)}...`);

    const streams = [{
      embedUrl: proxyUrl,
      streamNo: 1,
      language: "English",
      hd: true,
      sourceIdentifier: "REEDSTREAMS",
    }];

    return NextResponse.json(streams, { headers: corsHeaders });
  } catch (error) {
    console.error('[REED STREAM] Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500, headers: corsHeaders });
  }
}
