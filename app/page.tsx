// app/page.tsx
import Header from '@/components/layout/header'
import SportsGrid from '@/components/sports/Sportsgrid'

// This function runs on the Server
async function getInitialMatches() {
  try {
    const res = await fetch('https://api.reedstreams.live/api/v1/streams', {
      // Vercel will refresh this data every 60 seconds in the background
      next: { revalidate: 60 }
    });
    if (!res.ok) return { categories: [] };
    return res.json();
  } catch (error) {
    console.error('Failed to fetch initial matches:', error);
    // Return empty data during build or if API is unavailable
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
