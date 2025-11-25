import { Suspense } from 'react'
import Hero from '@/components/home/hero'
import LiveMatchCounts from '@/components/home/live-match-counts'
import UpcomingMatches from '@/components/home/upcoming-matches'
import FeaturedContent from '@/components/home/featured-content'
import FAQ from '@/components/home/faq'
import Footer from '@/components/layout/footer'

export const metadata = {
  title: 'ReedStreams - Your Home for Free Live Sports',
  description: 'Watch Any sport game live from anywhere! Free HD sports streaming with 14+ sports coverage available 24/7.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="loading-message">Loading live matches...</div>}>
        <LiveMatchCounts />
      </Suspense>
      <Suspense fallback={<div className="loading-message">Loading upcoming matches...</div>}>
        <UpcomingMatches />
      </Suspense>
      <FeaturedContent />
      <FAQ />
      <Footer />
    </>
  )
}
