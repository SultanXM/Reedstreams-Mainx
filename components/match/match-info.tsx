"use client"

import { useEffect, useState } from "react"

interface Match {
  id: string
  title: string
  date: string
  competition?: string
  stadium?: string
  teams?: {
    home?: { name: string; badge?: string }
    away?: { name: string; badge?: string }
  }
}

export default function MatchInfo({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatchData() {
      try {
        // Try sessionStorage first for faster load
        const storedMatch = sessionStorage.getItem("currentMatch")
        if (storedMatch) {
          setMatch(JSON.parse(storedMatch))
          setLoading(false)
          return
        }

        // Fetch from API if not in sessionStorage
        const res = await fetch("/api/matches")
        if (!res.ok) throw new Error("Failed to fetch matches")

        const matches = await res.json()
        const matchData = matches.find((m: Match) => m.id === matchId)

        if (matchData) {
          setMatch(matchData)
          sessionStorage.setItem("currentMatch", JSON.stringify(matchData))
        }
      } catch (err) {
        // console.error("Error fetching match info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [matchId])

  if (loading || !match) {
    return <div className="loading-message">Loading match info...</div>
  }

  const matchDate = new Date(match.date)
  const dateStr = matchDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="match-info">
      <div className="match-title" id="match-title">
        {match.title || `${match.teams?.home?.name || "Home"} vs ${match.teams?.away?.name || "Away"}`}
      </div>

      <div className="teams-display">
        <div className="team">
          {match.teams?.home?.badge ? (
            <div className="team-logo" id="team1-logo">
              <img
                src={`${process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL}/images/badge/${match.teams.home.badge}.webp`}
                alt={match.teams.home.name}
                onError={(e) => {
                  e.currentTarget.src = "/Images/placeholder.png"
                }}
              />
            </div>
          ) : (
            <div className="team-logo" id="team1-logo">
              <span style={{ fontSize: "2rem" }}>?</span>
            </div>
          )}
          <div className="team-name" id="team1-name">
            {match.teams?.home?.name || "HOME TEAM"}
          </div>
        </div>

        <div className="vs-separator">VS</div>

        <div className="team">
          {match.teams?.away?.badge ? (
            <div className="team-logo" id="team2-logo">
              <img
                src={`${process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL}/images/badge/${match.teams.away.badge}.webp`}
                alt={match.teams.away.name}
                onError={(e) => {
                  e.currentTarget.src = "/Images/placeholder.png"
                }}
              />
            </div>
          ) : (
            <div className="team-logo" id="team2-logo">
              <span style={{ fontSize: "2rem" }}>?</span>
            </div>
          )}
          <div className="team-name" id="team2-name">
            {match.teams?.away?.name || "AWAY TEAM"}
          </div>
        </div>
      </div>

      <div className="match-time" id="match-time">
        {dateStr}
      </div>
    </div>
  )
}
