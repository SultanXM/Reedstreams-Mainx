import { NextRequest, NextResponse } from 'next/server';

// Load balancer URL - uses round-robin across 3 API servers
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-reedstreams-lb.fly.dev';

interface RouteParams {
  params: Promise<{ matchId: string }>
}

/**
 * POST /api/views/{matchId}
 * Add a viewer to a match
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { matchId } = await params;
    
    // Forward to backend
    const res = await fetch(`${API_BASE_URL}/api/v1/views/${matchId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'unknown',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 'unknown',
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
      isNewViewer: false,
      matchId
    });
  }
}
