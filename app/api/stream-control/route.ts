import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  
  if (!client.isOpen) await client.connect();
  const override = await client.get(`match:${matchId}:override`);
  
  return NextResponse.json({ source: override || 'AUTO' });
}

export async function POST(request: Request) {
  const { matchId, source, secret } = await request.json();

  if (secret !== "reedsmoney19k") return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!client.isOpen) await client.connect();
  
  if (source === 'AUTO') {
    await client.del(`match:${matchId}:override`);
  } else {
    await client.set(`match:${matchId}:override`, source, { EX: 86400 });
  }
  
  return NextResponse.json({ success: true });
}