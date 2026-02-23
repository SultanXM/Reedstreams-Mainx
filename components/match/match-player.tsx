"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { Clock, AlertCircle, Loader2 } from "lucide-react"
import { API_BASE_URL } from "@/config/api"
// API_BASE_URL kept for potential future use
import ReedVideoJS from "./ReedVideoJS"

const formatTime = (ms: number) => {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms / 60000) % 60)
  const s = Math.floor((ms / 1000) % 60)
  return `${h}h ${m}m ${s}s`
}

export default function MatchPlayer({ matchId }: { matchId: string }) {
  useUniversalAdBlocker()

  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playerState, setPlayerState] = useState<'countdown' | 'initial' | 'ready'>('initial')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  const hasFetched = useRef(false)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  // 1. Load Start Time
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("currentMatch")
      if (cached) {
        const data = JSON.parse(cached)
        if (String(data.id) === String(matchId)) {
          const timeValue = data.date || data.start_time
          if (timeValue) {
            const timeMs = typeof timeValue === 'number'
              ? timeValue * 1000
              : new Date(timeValue).getTime()
            setStartTime(timeMs)
          }
        }
      }
    } catch (e) {
      console.error("Cache error", e)
    }
  }, [matchId])

  // 2. Countdown
  useEffect(() => {
    if (!startTime) return
    const timer = setInterval(() => {
      const diff = startTime - Date.now()
      if (diff > 0) {
        setTimeRemaining(diff)
        setPlayerState('countdown')
      } else {
        setTimeRemaining(0)
        if (playerState === 'countdown') {
          setPlayerState('initial')
          hasFetched.current = false
        }
        clearInterval(timer)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [startTime, playerState])

  // 3. Fetch stream
  useEffect(() => {
    if (playerState === 'countdown' || hasFetched.current) return

    let isMounted = true
    async function fetchStream() {
      try {
        setLoading(true)
        hasFetched.current = true

        // Use our local API endpoint
        const res = await fetch(`/api/reedstreams/stream/${matchId}`, {
          cache: 'no-store',
        })

        if (!res.ok) throw new Error("Uplink Refused")

        const streams = await res.json()
        
        // The API returns an array of stream objects
        if (isMounted && Array.isArray(streams) && streams.length > 0 && streams[0].embedUrl) {
          setStreamUrl(streams[0].embedUrl)
        } else if (isMounted && streams.embedUrl) {
          // Handle single object response
          setStreamUrl(streams.embedUrl)
        } else {
          throw new Error("No stream URL in response")
        }
      } catch (e) {
        if (isMounted) {
          setError("Stream currently offline.")
          hasFetched.current = false
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchStream()
    return () => { isMounted = false }
  }, [matchId, playerState])

  // Ghost audio fix – force mute when hidden
  useEffect(() => {
    if (playerState !== 'initial' || !playerContainerRef.current) return

    const forceMute = setInterval(() => {
      const video = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null
      if (video && !video.muted) {
        video.muted = true
      }
    }, 100)

    return () => clearInterval(forceMute)
  }, [playerState])

  const handlePlayClick = () => {
    setPlayerState('ready')
    const video = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null
    if (video) {
      video.muted = false
      video.volume = 1
    }
  }

  const countdownDisplay = useMemo(() => formatTime(timeRemaining), [timeRemaining])

  // ────────────────────────────────────────────────
  //               INLINE STYLES
  // ────────────────────────────────────────────────

  const wrapperStyle = {
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
    color: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative' as const,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '1px solid #1a1a1a',
  }

  const stateContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050505',
    position: 'absolute' as const,
    top: 0,
    left: 0,
  }

  const playOverlayStyle = {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  }

  const playCircleStyle = {
    width: 80,
    height: 80,
    background: 'rgba(0,0,0,0.6)',
    border: '2px solid #fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    backdropFilter: 'blur(4px)',
  }

  const playTriangleStyle = {
    width: 0,
    height: 0,
    borderLeft: '24px solid white',
    borderTop: '14px solid transparent',
    borderBottom: '14px solid transparent',
    marginLeft: 8,
    transition: 'border-left-color 0.2s ease-in-out',
  }

  const videoStageStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  const hiddenStyle = { opacity: 0, pointerEvents: 'none' as const }
  const visibleStyle = { opacity: 1, pointerEvents: 'auto' as const }

  const countdownStyle = {
    fontSize: 42,
    fontWeight: 900,
    color: '#8db902',
    fontFamily: "'Courier New', monospace",
    marginTop: 10,
  }

  const retryBtnStyle = {
    marginTop: 20,
    background: '#8db902',
    color: '#000',
    padding: '10px 20px',
    fontWeight: 900,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    transition: 'background 0.2s',
  }

  // ────────────────────────────────────────────────
  //                   RENDER
  // ────────────────────────────────────────────────

  if (playerState === 'countdown') {
    return (
      <div style={wrapperStyle}>
        <div style={stateContainerStyle}>
          <Clock size={48} color="#8db902" style={{ animation: 'pulse 2s infinite' }} />
          <h2 style={{ marginTop: 20, letterSpacing: '2px', fontWeight: 900, color: '#fff' }}>
            EVENT STARTING SOON
          </h2>
          <div style={countdownStyle}>{countdownDisplay}</div>
        </div>
      </div>
    )
  }

  if (loading && !streamUrl) {
    return (
      <div style={wrapperStyle}>
        <div style={stateContainerStyle}>
          <Loader2 className="animate-spin" size={40} color="#8db902" />
          <span style={{ marginTop: 15, fontWeight: 'bold', fontSize: 12, letterSpacing: '1px', color: '#fff' }}>
            ESTABLISHING SATELLITE LINK...
          </span>
        </div>
      </div>
    )
  }

  if (error && !streamUrl) {
    return (
      <div style={wrapperStyle}>
        <div style={stateContainerStyle}>
          <AlertCircle color="#ef4444" size={48} />
          <span style={{ marginTop: 15, fontWeight: 'bold', color: '#fff' }}>{error}</span>
          <button
            onClick={() => window.location.reload()}
            style={{ ...retryBtnStyle, ':hover': { background: '#9edc00' } }}
          >
            REBOOT SYSTEM
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapperStyle} ref={playerContainerRef}>

      {playerState === 'initial' && (
        <div
          onClick={handlePlayClick}
          style={playOverlayStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.2)'
            const circle = e.currentTarget.querySelector<HTMLDivElement>('[data-circle]')
            if (circle) {
              circle.style.borderColor = '#8db902'
              circle.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.4)'
            const circle = e.currentTarget.querySelector<HTMLDivElement>('[data-circle]')
            if (circle) {
              circle.style.borderColor = '#fff'
              circle.style.transform = 'scale(1)'
            }
          }}
        >
          <div data-circle style={playCircleStyle}>
            <div style={playTriangleStyle} />
          </div>
        </div>
      )}

      {streamUrl && (
        <div
          style={{
            ...videoStageStyle,
            ...(playerState === 'ready' ? visibleStyle : hiddenStyle),
          }}
        >
          <ReedVideoJS src={streamUrl} />
        </div>
      )}

      {/* Keyframes can't be inline — you can keep minimal global style for animations or use a tiny <style> tag */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 50% { opacity: 0.4; } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}