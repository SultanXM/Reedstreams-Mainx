import { Suspense } from 'react'
import MatchPlayer from '@/components/match/match-player'
import MatchInfo from '@/components/match/match-info'
import Footer from '@/components/layout/footer'

export const metadata = {
  title: 'Live Match - ReedStreams',
  description: 'Watch live sports match',
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MatchPage({ params, searchParams }: PageProps) {
  const { id } = await params
  
  return (
    <>
      <div className="broadcast-container">
        <Suspense fallback={<div className="loading-message">Loading stream...</div>}>
          <MatchPlayer matchId={id} />
        </Suspense>
        <Suspense fallback={<div className="loading-message">Loading match info...</div>}>
          <MatchInfo matchId={id} />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
