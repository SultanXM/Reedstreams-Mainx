import { NextResponse } from 'next/server';

const REED_API_BASE = 'https://api.reedstreams.live/api/v1';

export async function GET() {
  try {
    const res = await fetch(`${REED_API_BASE}/streams`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching reedstreams games:", error);
    return NextResponse.json({ categories: [] });
  }
}
