import Header from '@/components/layout/header' // Import the Header
import SportsGrid from '@/components/sports/Sportsgrid'

export const metadata = {
  title: 'ReedStreams - Live Sports Streaming',
  description: 'Watch live sports matches including Football, Cricket, MMA, and more.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1115]">
      {/* 1. The Top Navigation Bar */}
      <Header />
      
      {/* 2. The Main Content (Hero + Grid) */}
      <SportsGrid />
    </main>
  )
}