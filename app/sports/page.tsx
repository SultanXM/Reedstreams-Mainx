import Header from '@/components/layout/header'
import SportsGrid from '@/components/sports/Sportsgrid'
import { PPV_STREAMS_URL } from '@/config/api'

// This function runs on the Server
async function getInitialMatches() {
  try {
    const res = await fetch(PPV_STREAMS_URL, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return { categories: [] };
    return res.json();
  } catch (error) {
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
