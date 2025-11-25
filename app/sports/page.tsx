import { Suspense } from 'react'
import SportsHero from '@/components/sports/sports-hero'
import SportsGrid from '@/components/sports/sports-grid'
import Footer from '@/components/layout/footer'

export const metadata = {
  title: 'All Sports - ReedStreams',
  description: 'Choose your favorite sport and dive into live matches, upcoming games, and premium streaming experience',
}

export default function SportsPage() {
  return (
    <>
      <SportsHero />
      <section className="sports-section">
        <div className="gradient-accent accent-1"></div>
        <div className="gradient-accent accent-2"></div>
        <Suspense fallback={<div className="loading-message">Loading sports...</div>}>
          <SportsGrid />
        </Suspense>
      </section>
      <Footer />
    </>
  )
}
