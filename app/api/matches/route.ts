import { NextResponse } from 'next/server';

const STREAMED_API_URL = 'https://streamed.pk/api/matches';

/**
 * Handles GET requests to /api/matches.
 * Fetches match data from the external streamed.pk API.
 */
export async function GET() {
  try {
    const response = await fetch(STREAMED_API_URL, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from external API: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch matches' }, { status: 500 });
  }
}
