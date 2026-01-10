import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) return new NextResponse('Missing URL', { status: 400 });

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://streamed.pk/'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch source');
    const html = await res.text();

    // 1. HUNT FOR THE M3U8 LINK
    // We look for patterns like: source: "http...m3u8" or file: "http...m3u8"
    const regex = /(?:source|file)\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/;
    const match = html.match(regex);

    if (match && match[1]) {
        console.log("EXTRACTED CLEAN STREAM:", match[1]);
        return NextResponse.json({ success: true, url: match[1] });
    }

    // 2. Fallback: If we can't find it, we tell frontend to use iframe
    return NextResponse.json({ success: false });

  } catch (error) {
    return NextResponse.json({ success: false });
  }
}