import { NextResponse } from 'next/server'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

export async function GET() {
  try {
    const res = await fetch(`${STREAMED_API_BASE}/sports`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const sports = await res.json()
    return NextResponse.json(Array.isArray(sports) ? sports : [])
  } catch (error) {
    console.error("Error fetching sports:", error)
    return NextResponse.json([])
  }
}