import { NextResponse } from 'next/server';
import { fetchMatches } from '@/lib/data';

/**
 * Handles GET requests to /api/matches.
 * Fetches match data from the external streamed.pk API.
 */
export async function GET() {
    const data = await fetchMatches();
    return NextResponse.json(data);
}
