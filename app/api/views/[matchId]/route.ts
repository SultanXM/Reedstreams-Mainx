import { NextRequest, NextResponse } from 'next/server';

// Rust backend URL
const RUST_BACKEND_URL = process.env.RUST_BACKEND_URL || 'https://reedstreams-edge-v2.fly.dev';

interface RouteParams {
  params: Promise<{ matchId: string }>
}

/**
 * POST /api/views/{matchId}
 * Proxy to Rust backend view counter
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { matchId } = await params;
    
    // Forward to Rust backend
    const res = await fetch(`${RUST_BACKEND_URL}/api/v1/views/${matchId}`, {
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
    // Return 0 views on error so UI doesn't break
    const { matchId } = await params;
    return NextResponse.json({ 
      views: 0,
      isNewViewer: false,
      matchId
    });
  }
}
