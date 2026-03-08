// app/page.tsx
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
      // Vercel will refresh this data every 60 seconds in the background
      next: { revalidate: 60 },
      // Add timeout to prevent build hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    if (!res.ok) return { categories: [] };
    
    const data = await res.json();
    return transformPPVData(data);
  } catch (error) {
    // Return empty data during build or if API is unavailable
    console.log('PPV API fetch failed, returning empty:', error);
    return { categories: [] };
  }
}

export default async function Home() {
  // Fetch data BEFORE the page is sent to the user
  const initialData = await getInitialMatches();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Snowfall System (CSS handles the animation, no need for mounted check here) */}
      <div className="snow-wrapper">
         <div className="snow-layer layer-1"></div>
         <div className="snow-layer layer-2"></div>
         <div className="snow-layer layer-3"></div>
      </div>
       
      <div className="relative z-10">
        <Header />
        {/* Pass the server-fetched data into your component */}
        <SportsGrid initialData={initialData} />
      </div>
    </main>
  )
}
