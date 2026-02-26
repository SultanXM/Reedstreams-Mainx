"use client"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { Clock, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import ShakaPlayer from "./ShakaPlayer"
import { API_BASE_URL } from "@/config/api"

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
  const [retryAttempt, setRetryAttempt] = useState(0)

  const hasFetched = useRef(false)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // load match start time from cache
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
      // cache busted, whatever
    }
  }, [matchId])

  // countdown timer
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

  // fetch stream directly from edge server
  const fetchStream = useCallback(async () => {
    if (playerState === 'countdown') return
    
    setLoading(true)
    setError(null)
    
    const maxRetries = 5
    const baseDelay = 2000

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Get signed URL directly from edge server
        const signedUrlRes = await fetch(`${API_BASE_URL}/api/v1/streams/ppvsu/${matchId}/signed-url`, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          }
        })

        if (!signedUrlRes.ok) throw new Error("Stream not ready")

        const signedData = await signedUrlRes.json()
        
        if (!signedData.signed_url) {
          throw new Error("No stream URL in response")
        }

        // Build full URL
        const fullSignedUrl = signedData.signed_url.startsWith('http') 
          ? signedData.signed_url 
          : `${API_BASE_URL}${signedData.signed_url}`

        setStreamUrl(fullSignedUrl)
        setLoading(false)
        return

      } catch (e) {
        const isLastAttempt = attempt === maxRetries - 1
        
        if (isLastAttempt) {
          setError("Stream not available right now. Servers might be busy.")
          setLoading(false)
          return
        }
        
        // wait before retry with exponential backoff
        const delay = baseDelay * Math.pow(1.5, attempt)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }, [matchId, playerState])

  // trigger fetch when needed
  useEffect(() => {
    if (playerState === 'countdown' || hasFetched.current) return
    hasFetched.current = true
    fetchStream()
  }, [playerState, fetchStream])

  // cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  // force mute when hidden
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

  const handleRetry = () => {
    setRetryAttempt(c => c + 1)
    hasFetched.current = false
    setError(null)
    setLoading(true)
    fetchStream()
  }

  const countdownDisplay = useMemo(() => formatTime(timeRemaining), [timeRemaining])

  // styles
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
  }

  const playTriangleStyle = {
    width: 0,
    height: 0,
    borderLeft: '24px solid white',
    borderTop: '14px solid transparent',
    borderBottom: '14px solid transparent',
    marginLeft: 8,
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
  }

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
            FINDING STREAM...
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
          <span style={{ marginTop: 15, fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: '0 20px' }}>
            {error}
          </span>
          <button
            onClick={handleRetry}
            style={retryBtnStyle}
          >
            <RefreshCw size={14} style={{ marginRight: 6, display: 'inline' }} />
            TRY AGAIN
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
          <ShakaPlayer 
            src={streamUrl} 
            matchId={matchId}
            onError={(err) => setError(err)}
            onSuccess={() => console.log('[ShakaPlayer] Stream loaded successfully')}
          />
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 50% { opacity: 0.4; } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}
