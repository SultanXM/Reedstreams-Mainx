import { NextResponse } from 'next/server';

// Rust backend URL
const RUST_BACKEND_URL = process.env.RUST_BACKEND_URL || 'https://reedstreams-edge-v2.fly.dev';

interface RouteParams {
  params: Promise<{ matchId: string }>
}

/**
 * GET /api/views/{matchId}/count
 * Proxy to Rust backend to get view count
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { matchId } = await params;
    
    // Forward to Rust backend
    const res = await fetch(`${RUST_BACKEND_URL}/api/v1/views/${matchId}/count`, {
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
    console.error('[Views Count API] Error:', error);
    const { matchId } = await params;
    return NextResponse.json({ 
      views: 0,
      matchId
    });
  }
}
