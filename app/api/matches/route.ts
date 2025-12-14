import { NextResponse } from 'next/server';

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api';

export async function GET() {
  try {
    const res = await fetch(`${STREAMED_API_BASE}/matches`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const matches = Array.isArray(data) ? data : [];

    // SANITIZE: Force all IDs to be Strings
    const sanitizedMatches = matches.map((m: any) => ({
      ...m,
      id: String(m.id), // FORCE STRING ID
      date: m.date || new Date().toISOString()
    }));

    return NextResponse.json(sanitizedMatches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json([]);
  }
}