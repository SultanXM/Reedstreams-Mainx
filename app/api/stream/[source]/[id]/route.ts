import { NextResponse } from 'next/server'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

interface RouteParams {
  params: Promise<{ source: string; id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { source, id } = await params
    const res = await fetch(`${STREAMED_API_BASE}/stream/${source}/${id}`, {
      next: { revalidate: 30 } // Cache for 30 seconds
    })
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    
    const streams = await res.json()
    return NextResponse.json(streams)
  } catch (error) {
    console.error('Error fetching stream:', error)
    return NextResponse.json({ error: 'Failed to fetch stream' }, { status: 500 })
  }
}
