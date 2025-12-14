import { NextResponse } from 'next/server'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

interface RouteParams {
  params: Promise<{ source: string; id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { source, id } = await params
    
    // LOGGING START
    console.log(`[STREAM API] Request received for Source: ${source}, ID: ${id}`);
    const targetUrl = `${STREAMED_API_BASE}/stream/${source}/${id}`;
    console.log(`[STREAM API] Fetching upstream: ${targetUrl}`);
    // LOGGING END

    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://streamed.pk/'
      },
      next: { revalidate: 0 } // No cache for debugging
    })
    
    if (!res.ok) {
      console.error(`[STREAM API] Upstream Error: ${res.status} ${res.statusText}`);
      return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: res.status })
    }
    
    const streams = await res.json()
    console.log(`[STREAM API] Success! Found ${Array.isArray(streams) ? streams.length : 0} streams.`);
    
    return NextResponse.json(streams)
  } catch (error) {
    console.error('[STREAM API] CRITICAL FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}