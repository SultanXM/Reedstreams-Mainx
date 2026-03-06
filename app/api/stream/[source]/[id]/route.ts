import { NextResponse } from 'next/server'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

// CORS headers for iOS compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

interface RouteParams {
  params: Promise<{ source: string; id: string }>
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { source, id } = await params

    // LOGGING START
    const targetUrl = `${STREAMED_API_BASE}/stream/${source}/${id}`;
    // LOGGING END

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://streamed.pk/'
      },
      next: { revalidate: 0 } // No cache for debugging
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status, headers: corsHeaders })
    }

    const streams = await res.json()

    return NextResponse.json(streams, { headers: corsHeaders })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders })
  }
}