import { NextResponse } from 'next/server'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

export async function GET() {
  try {
    const res = await fetch(`${STREAMED_API_BASE}/matches`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const matches = await res.json()
    return NextResponse.json(Array.isArray(matches) ? matches : [])
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json([])
  }
}
