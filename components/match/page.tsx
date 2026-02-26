"use client"

import MatchInfo from "@/components/match/match-info"
import MatchPlayer from "@/components/match/match-player"

export default function MatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="match-page-container">
      <MatchInfo matchId={params.id} />
      <MatchPlayer matchId={params.id} />
    </div>
  )
}
