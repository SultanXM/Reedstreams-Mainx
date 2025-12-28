import { Suspense } from 'react'
import MatchesList from '@/components/live-matches/matches-list' // Ensure this path is correct!
import Header from '@/components/layout/header'

export const metadata = {
  title: 'Live Matches - ReedStreams',
  description: 'Watch live sports matches streaming now',
}

export default function LiveMatchesPage() {
  return (
    // Relative to contain content, transparent to show body bg
    <main className="min-h-screen relative bg-transparent">
      <Header />
      {/* SNOWFALL LAYERS */}
      <div className="snow-wrapper">
         <div className="snow-layer layer-1"></div>
         <div className="snow-layer layer-2"></div>
         <div className="snow-layer layer-3"></div>
      </div>
      
      <section className="matches-section">
        <Suspense fallback={<div className="lm-loading">Loading matches...</div>}>
          <MatchesList />
        </Suspense>
      </section>
      
    </main>
  )
}