"use client"

import { useState } from "react"
import MatchInfo from "@/components/match/match-info"
import MatchPlayer from "@/components/match/match-player"

interface Match {
  id: string
  title: string
  date: string
  competition?: string
  teams?: {
    home?: { name: string; badge?: string }
    away?: { name: string; badge?: string }
  }
  sources?: Array<{ source: string; id: string }>
}

export default function MatchPage({ params }: { params: { id: string } }) {
  const [matchData, setMatchData] = useState<Match | null>(null)

  return (
    <div className="match-page-container">
      <MatchInfo match={matchData} />
      <MatchPlayer matchId={params.id} onMatchDataLoaded={setMatchData} />
      {/* You can add other components like chat or related matches here */}
    </div>
  )
}