import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  if (!matchId) return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
  
  // Gets the override from Vercel KV
  const override = await kv.get(`match:${matchId}:override`);
  return NextResponse.json({ source: override || 'AUTO' });
}

export async function POST(request: Request) {
  const { matchId, source, secret } = await request.json();
  if (secret !== "reedsmoney19k") return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  if (source === 'AUTO') {
    await kv.del(`match:${matchId}:override`);
  } else {
    await kv.set(`match:${matchId}:override`, source, { ex: 86400 });
  }
  return NextResponse.json({ success: true });
}