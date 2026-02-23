import { NextResponse } from 'next/server';
import { REED_API_V1 } from '@/config/api';

export async function GET() {
  try {
    const res = await fetch(`${REED_API_V1}/streams`, {
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
