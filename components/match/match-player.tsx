"use client"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { Clock, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import HLSPlayer from "./HLSPlayer"
import ReedVideoJS from "./ReedVideoJS"
import ShakaPlayer from "./ShakaPlayer"
import PlayerSelector from "./player-selector"
import { usePlayerPreference } from "@/hooks/usePlayerPreference"
import { PlayerType } from "@/hooks/usePlayerPreference"

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
  
  // For seamless player switching
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("hls")
  const [resumeTime, setResumeTime] = useState<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const { preferredPlayer, setPreferredPlayer } = usePlayerPreference()

  // Sync preferred player with current player on initial load
  useEffect(() => {
    setCurrentPlayer(preferredPlayer)
  }, [preferredPlayer])

  const hasFetched = useRef(false)
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
      // cache busted
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

  // fetch stream with auto-retry logic
  const fetchStream = useCallback(async () => {
    if (playerState === 'countdown') return
    
    setLoading(true)
    setError(null)
    
    const maxRetries = 5
    const baseDelay = 2000

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(`/api/reedstreams/stream/${matchId}`, {
          cache: 'no-store',
        })

        if (!res.ok) throw new Error("Stream not ready")

        const streams = await res.json()
        
        if (Array.isArray(streams) && streams.length > 0 && streams[0].embedUrl) {
          setStreamUrl(streams[0].embedUrl)
          setLoading(false)
          return
        } else if (streams.embedUrl) {
          setStreamUrl(streams.embedUrl)
          setLoading(false)
          return
        } else {
          throw new Error("No stream URL in response")
        }
      } catch (e) {
        const isLastAttempt = attempt === maxRetries - 1
        
        if (isLastAttempt) {
          setError("Stream not available right now. Servers might be busy.")
          setLoading(false)
          return
        }
        
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
    setIsPlaying(true)
    const video = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null
    if (video) {
      video.muted = false
      video.volume = 1
    }
  }

  const handleRetry = () => {
    hasFetched.current = false
    setError(null)
    setLoading(true)
    fetchStream()
  }

  // SEAMLESS PLAYER SWITCHING
  const handlePlayerSwitch = useCallback((newPlayer: PlayerType) => {
    if (newPlayer === currentPlayer) return;

    // Capture current playback state before switching
    const video = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
    if (video && video.currentTime > 0) {
      console.log(`[MatchPlayer] Switching players. Captured time: ${video.currentTime}, playing: ${!video.paused}`);
      setResumeTime(video.currentTime);
      setIsPlaying(!video.paused);
    } else {
      setResumeTime(undefined);
    }

    // Update both local state and preference
    setCurrentPlayer(newPlayer);
    setPreferredPlayer(newPlayer);
  }, [currentPlayer, setPreferredPlayer]);

  const handlePlayerError = (err: string) => {
    setError(err)
  }

  const countdownDisplay = useMemo(() => formatTime(timeRemaining), [timeRemaining])

  // Common styles
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
    color: 'white',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
  }

  const stateContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
  }

  const playOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }

  const playCircleStyle: React.CSSProperties = {
    width: 72,
    height: 72,
    background: 'rgba(0,0,0,0.7)',
    border: '2px solid rgba(255,255,255,0.8)',
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  }

  const playTriangleStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '20px solid white',
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    marginLeft: 6,
  }

  const videoStageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }

  const hiddenStyle: React.CSSProperties = { opacity: 0, pointerEvents: 'none' }
  const visibleStyle: React.CSSProperties = { opacity: 1, pointerEvents: 'auto' }

  const retryBtnStyle: React.CSSProperties = {
    marginTop: 16,
    background: '#fff',
    color: '#000',
    padding: '8px 16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: 0,
    cursor: 'pointer',
    fontSize: 12,
  }

  // Render the current player
  const renderPlayer = () => {
    if (!streamUrl) return null;

    const commonProps = {
      src: streamUrl,
      matchId,
      startTime: resumeTime,
      autoPlay: isPlaying || playerState === 'ready',
      onError: handlePlayerError,
    };

    switch (currentPlayer) {
      case "videojs":
        return <ReedVideoJS {...commonProps} />;
      case "shaka":
        return <ShakaPlayer {...commonProps} />;
      case "hls":
      default:
        return <HLSPlayer {...commonProps} />;
    }
  };

  // Countdown state
  if (playerState === 'countdown') {
    return (
      <div style={wrapperStyle}>
        <div style={stateContainerStyle}>
          <Clock size={40} color="#888" />
          <h2 style={{ marginTop: 16, fontSize: 14, letterSpacing: 1, fontWeight: 600, color: '#888' }}>
            STARTING SOON
          </h2>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: 'monospace', marginTop: 12 }}>
            {countdownDisplay}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading && !streamUrl) {
    return (
      <div style={wrapperStyle}>
        <div style={stateContainerStyle}>
          <Loader2 size={32} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginTop: 12, fontWeight: 500, fontSize: 12, letterSpacing: 0.5, color: '#666' }}>
            LOADING STREAM
          </span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Error state
  if (error && !streamUrl) {
    return (
      <div style={wrapperStyle}>
        <div style={stateContainerStyle}>
          <AlertCircle color="#c44" size={40} />
          <span style={{ marginTop: 12, fontWeight: 500, color: '#aaa', textAlign: 'center', padding: '0 20px', fontSize: 13 }}>
            {error}
          </span>
          <button onClick={handleRetry} style={retryBtnStyle}>
            <RefreshCw size={12} style={{ marginRight: 6, display: 'inline', verticalAlign: 'middle' }} />
            RETRY
          </button>
        </div>
      </div>
    )
  }

  // Main player UI
  return (
    <div>
      {/* Player Container */}
      <div style={wrapperStyle} ref={playerContainerRef}>
        {/* Play Button Overlay */}
        {playerState === 'initial' && (
          <div
            onClick={handlePlayClick}
            style={playOverlayStyle}
            onMouseEnter={(e) => {
              const circle = e.currentTarget.querySelector<HTMLDivElement>('[data-circle]')
              if (circle) {
                circle.style.borderColor = '#fff'
                circle.style.transform = 'scale(1.1)'
                circle.style.background = 'rgba(0,0,0,0.9)'
              }
            }}
            onMouseLeave={(e) => {
              const circle = e.currentTarget.querySelector<HTMLDivElement>('[data-circle]')
              if (circle) {
                circle.style.borderColor = 'rgba(255,255,255,0.8)'
                circle.style.transform = 'scale(1)'
                circle.style.background = 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <div data-circle style={playCircleStyle}>
              <div style={playTriangleStyle} />
            </div>
          </div>
        )}

        {/* Video Player - Always rendered when stream is ready */}
        {streamUrl && (
          <div
            style={{
              ...videoStageStyle,
              ...(playerState === 'ready' ? visibleStyle : hiddenStyle),
            }}
          >
            {renderPlayer()}
          </div>
        )}
      </div>

      {/* Player Selector Bar - Always visible for instant switching */}
      <div style={{ 
        marginTop: 10, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#0a0a0a',
        padding: '8px 12px',
        borderRadius: 0,
      }}>
        <div style={{ fontSize: 11, color: '#555' }}>
          Player: <span style={{ color: '#888' }}>
            {currentPlayer === "hls" ? "HLS.js" : currentPlayer === "videojs" ? "Video.js" : "Shaka"}
          </span>
        </div>
        <PlayerSelector 
          compact 
          selected={currentPlayer} 
          onSelect={handlePlayerSwitch} 
        />
      </div>
    </div>
  )
}
