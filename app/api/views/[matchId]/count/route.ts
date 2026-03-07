import { NextResponse } from 'next/server';

// Load balancer URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-reedstreams-clean.fly.dev';

interface RouteParams {
  params: Promise<{ matchId: string }>
}

/**
 * GET /api/views/{matchId}/count
 * Get current view count for a match
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { matchId } = await params;
    
    // Forward to backend
    const res = await fetch(`${API_BASE_URL}/api/v1/views/${matchId}/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    const { matchId } = await params;
    return NextResponse.json({ 
      views: 0,
      matchId
    });
  }
}
