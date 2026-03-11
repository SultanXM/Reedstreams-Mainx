import Header from '@/components/layout/header'
import SportsGrid from '@/components/sports/Sportsgrid'

export const metadata = {
  title: 'ReedStreams - Live Sports Streaming',
  description: 'Watch live sports matches including Football, Cricket, MMA, and more.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1115]">
      <Header />
      <SportsGrid />
    </main>
  )
}
