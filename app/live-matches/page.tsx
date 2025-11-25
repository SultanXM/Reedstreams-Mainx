import { Suspense } from 'react'
import LiveMatchesHero from '@/components/live-matches/hero'
import MatchesList from '@/components/live-matches/matches-list'
import Footer from '@/components/layout/footer'

export const metadata = {
  title: 'Live Matches - ReedStreams',
  description: 'Watch live sports matches streaming now',
}

export default function LiveMatchesPage() {
  return (
    <>
      <LiveMatchesHero />
      <section className="matches-section">
        <div className="lm-creative-title">
          <h2>Live Now</h2>
          <p className="subtitle">Real-time matches streaming live across all sports</p>
        </div>
        <Suspense fallback={<div className="loading-message">Loading matches...</div>}>
          <MatchesList />
        </Suspense>
      </section>
      <Footer />
    </>
  )
}
