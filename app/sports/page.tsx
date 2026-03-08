import Header from '@/components/layout/header'
import SportsGrid from '@/components/sports/Sportsgrid'

const PPV_DIRECT_API = 'https://api.ppv.to/api/streams'

// Transform PPV.to format to match existing format
function transformPPVData(data: any) {
  if (!data.success || !data.streams) {
    return { categories: [] };
  }

  const categories = data.streams.map((cat: any) => ({
    category: cat.category,
    games: cat.streams.map((stream: any) => ({
      id: stream.id,
      name: stream.name,
      poster: stream.poster,
      start_time: stream.starts_at,
      end_time: stream.ends_at,
      video_link: stream.uri_name,
      category: cat.category,
      cache_time: data.timestamp,
    })),
  }));

  return { categories };
}

// This function runs on the Server
async function getInitialMatches() {
  try {
    const res = await fetch(PPV_DIRECT_API, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    if (!res.ok) return { categories: [] };
    
    const data = await res.json();
    return transformPPVData(data);
  } catch (error) {
    console.log('PPV API fetch failed:', error);
    return { categories: [] };
  }
}

export const metadata = {
  title: 'ReedStreams - Live Sports Streaming',
  description: 'Watch live sports matches including Football, Cricket, MMA, and more.',
}

export default async function Home() {
  const initialData = await getInitialMatches();

  return (
    <main className="min-h-screen bg-[#0f1115]">
      <Header />
      <SportsGrid initialData={initialData} />
    </main>
  )
}
