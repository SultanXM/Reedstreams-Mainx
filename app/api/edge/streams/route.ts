import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://reedstreams-edge-v1.fly.dev/api/v1/streams/')
    if (!res.ok) {
      return NextResponse.json({ error: `Edge returned ${res.status}` }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Edge list proxy error:', err)
    return NextResponse.json({ error: 'Failed to proxy streams list' }, { status: 500 })
  }
}