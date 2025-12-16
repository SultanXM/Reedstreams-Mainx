import Header from '@/components/layout/header'
import SportsGrid from '@/components/sports/Sportsgrid'

export const metadata = {
  title: 'ReedStreams - Live Sports Streaming',
  description: 'Watch live sports matches including Football, Cricket, MMA, and more.',
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* --- MILLION DOLLAR SNOWFALL SYSTEM --- */}
      <div className="snow-wrapper">
         <div className="snow-layer layer-1"></div>
         <div className="snow-layer layer-2"></div>
         <div className="snow-layer layer-3"></div>
      </div>
      
      {/* Content sits ON TOP of the snow */}
      <div className="relative z-10">
        <Header />
        <SportsGrid />
      </div>

    </main>
  )
}
