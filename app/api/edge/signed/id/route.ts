import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const res = await fetch(`https://reedstreams-edge-v1.fly.dev/api/v1/streams/ppvsu/${id}/signed-url`)
    if (!res.ok) {
      return NextResponse.json({ error: `Edge signed-url returned ${res.status}` }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Signed proxy error:', err)
    return NextResponse.json({ error: 'Failed to proxy signed URL' }, { status: 500 })
  }
}