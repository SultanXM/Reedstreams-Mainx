import { NextResponse } from 'next/server';

// PPV.to official API - guaranteed uptime
const PPV_API_URL = 'https://api.ppv.to/api/streams';

interface PPVStream {
  id: number;
  name: string;
  tag?: string;
  poster: string;
  uri_name: string;
  starts_at: number;
  ends_at: number;
  always_live: number;
  category_name: string;
  iframe?: string;
  allowpaststreams: number;
}

interface PPVCategory {
  category: string;
  id: number;
  always_live: number;
  streams: PPVStream[];
}

interface PPVResponse {
  success: boolean;
  timestamp: number;
  streams: PPVCategory[];
}

// Transform PPV.to format to match your existing format
function transformPPVData(data: PPVResponse) {
  if (!data.success || !data.streams) {
    return { categories: [] };
  }

  const categories = data.streams.map((cat: PPVCategory) => ({
    category: cat.category,
    games: cat.streams.map((stream: PPVStream) => ({
      id: stream.id,
      name: stream.name,
      poster: stream.poster,
      start_time: stream.starts_at,
      end_time: stream.ends_at,
      // Keep original PPV data for iframe option later
      video_link: stream.uri_name,
      category: cat.category,
      tag: stream.tag,
      iframe: stream.iframe,
      always_live: stream.always_live,
      cache_time: data.timestamp,
    })),
  }));

  return { categories };
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const res = await fetch(PPV_API_URL, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Cache for 30 seconds to avoid hammering their API
      next: { revalidate: 30 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`PPV.to API error: ${res.status}`);
    }

    const data: PPVResponse = await res.json();
    const transformed = transformPPVData(data);
    
    return NextResponse.json(transformed);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('PPV.to fetch timeout');
    } else {
      console.error('PPV.to fetch error:', error);
    }
    // Return empty but don't break the UI
    return NextResponse.json({ categories: [] });
  }
}
