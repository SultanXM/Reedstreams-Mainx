import { NextRequest, NextResponse } from 'next/server';

// Rust backend URL
const RUST_BACKEND_URL = process.env.RUST_BACKEND_URL || 'https://reedstreams-edge-v2.fly.dev';

/**
 * POST /api/views/batch/count
 * Get view counts for multiple matches
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { match_ids } = body;
    
    if (!match_ids || !Array.isArray(match_ids) || match_ids.length === 0) {
      return NextResponse.json({ 
        counts: [] 
      });
    }
    
    // Forward to Rust backend
    const res = await fetch(`${RUST_BACKEND_URL}/api/v1/views/batch/count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ match_ids }),
    });
    
    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[Views Batch API] Error:', error);
    // Return empty counts on error
    return NextResponse.json({ 
      counts: []
    });
  }
}
