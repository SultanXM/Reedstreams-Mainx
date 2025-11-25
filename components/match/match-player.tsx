"use client"

import { useEffect, useState } from "react"

interface Stream {
  embedUrl: string
  streamNo: number
  language: string
  hd: boolean
  sourceIdentifier: string
}

interface Match {
  id: string
  title: string
  date: string
  sources?: Array<{ source: string; id: string }>
}

export default function MatchPlayer({ matchId }: { matchId: string }) {
  const [streams, setStreams] = useState<Stream[]>([])
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [matchData, setMatchData] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatchData() {
      try {
        // Try sessionStorage first for faster load
        const storedMatch = sessionStorage.getItem("currentMatch")
        if (storedMatch) {
          const match = JSON.parse(storedMatch)
          setMatchData(match)
          loadStreams(match)
          setLoading(false)
          return
        }

        // Fetch from API if not in sessionStorage
        const res = await fetch("/api/matches")
        if (!res.ok) throw new Error("Failed to fetch matches")

        const matches = await res.json()
        const match = matches.find((m: Match) => m.id === matchId)

        if (match) {
          setMatchData(match)
          sessionStorage.setItem("currentMatch", JSON.stringify(match))
          loadStreams(match)
        } else {
          setError("Match not found")
        }
      } catch (err) {
        // console.error("Error fetching match data:", err)
        setError("Failed to load match data")
      } finally {
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [matchId])

  async function loadStreams(match: Match) {
    if (!match.sources || match.sources.length === 0) {
      setError("No match sources available for this match.")
      return
    }

    try {
      const streamPromises = match.sources.map((source) =>
        fetch(`/api/stream/${source.source}/${source.id}`)
          .then((res) => res.json())
          .catch(() => []),
      )

      const resultsArray = await Promise.all(streamPromises)
      const allStreams: Stream[] = []

      match.sources.forEach((matchSource, index) => {
        const streamsFromSource = resultsArray[index]
        if (Array.isArray(streamsFromSource)) {
          streamsFromSource.forEach((stream: any) => {
            allStreams.push({
              ...stream,
              sourceIdentifier: matchSource.source,
            })
          })
        }
      })

      if (allStreams.length === 0) {
        setError("Unable to load any stream data from all available sources.")
        return
      }

      setStreams(allStreams)
      const hdStream = allStreams.find((s) => s.hd === true)
      setSelectedStream(hdStream || allStreams[0])
    } catch (err) {
      // console.error("Error loading streams:", err)
      setError("Failed to load streams")
    }
  }

  if (loading) {
    return (
      <div className="video-section">
        <div className="loading-message">Loading stream...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="video-section">
        <div className="stream-error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="video-section">
        {selectedStream ? (
          <iframe
            className="stream-iframe video-player"
            src={selectedStream.embedUrl}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          />
        ) : (
          <div className="loading-message">Loading stream...</div>
        )}
      </div>

      {streams.length > 1 && (
        <div className="stream-selector">
          <div className="stream-selector-header">
            <i className="fas fa-tv"></i> {`Available Streams (${streams.length})`}
          </div>
          <div className="stream-options">
            {streams.map((stream, index) => (
              <button
                key={index}
                className={`stream-option ${selectedStream?.embedUrl === stream.embedUrl ? "active" : ""}`}
                onClick={() => setSelectedStream(stream)}
                title={`Source: ${stream.sourceIdentifier || "Unknown"}`}
              >
                <span className={`stream-number ${selectedStream?.embedUrl === stream.embedUrl ? "active" : ""}`}
                >
                  {stream.sourceIdentifier} #{stream.streamNo}
                </span>
                <span className="stream-lang">{stream.language}</span>
                {stream.hd ? (
                  <span className="stream-quality hd">HD</span>
                ) : (
                  <span className="stream-quality sd">SD</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
