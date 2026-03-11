import { NextResponse } from 'next/server';

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(`${STREAMED_API_BASE}/matches/live`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const matches = Array.isArray(data) ? data : [];

    // Filter out matches WITHOUT posters
    const validMatches = matches.filter((m: any) => m.poster && m.poster.length > 0);

    // SANITIZE: Force all IDs to be Strings
    const sanitizedMatches = validMatches.map((m: any) => ({
      ...m,
      id: String(m.id),
      date: m.date || new Date().toISOString()
    }));

    return NextResponse.json(sanitizedMatches);
  } catch (error) {
    return NextResponse.json([]);
  }
}
