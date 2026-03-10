"use client"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker"
import { useViews } from "@/hooks/useViews"
import { Clock, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import ViewsCounter from "./ViewsCounter"
import HLSPlayer from "./HLSPlayer"
import ReedVideoJS from "./ReedVideoJS"
import ShakaPlayer from "./ShakaPlayer"
import PlayerSelector from "./player-selector"
import { usePlayerPreference } from "@/hooks/usePlayerPreference"
import { PlayerType } from "@/hooks/usePlayerPreference"
import { getProxiedStreamUrl } from "@/lib/proxy-cache"

const formatTime = (ms: number) => {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms / 60000) % 60)
  const s = Math.floor((ms / 1000) % 60)
  return `${h}h ${m}m ${s}s`
}

export default function MatchPlayer({ matchId }: { matchId: string }) {
  useUniversalAdBlocker()
  const { recordView } = useViews(matchId)

  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playerState, setPlayerState] = useState<'countdown' | 'initial' | 'ready'>('initial')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("shaka")
  const [resumeTime, setResumeTime] = useState<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const { preferredPlayer, setPreferredPlayer } = usePlayerPreference()

  useEffect(() => {
    setCurrentPlayer(preferredPlayer)
  }, [preferredPlayer])

  const hasFetched = useRef(false)

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
    } catch (e) {}
  }, [matchId])

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

  const fetchStream = useCallback(async () => {
    if (playerState === 'countdown') return
    
    setLoading(true)
    setError(null)
    
    const maxRetries = 5
    const baseDelay = 2000

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(`https://reedstreams-wx-78.fly.dev/api/v1/streams/ppvsu/${matchId}/signed-url`, {
          cache: 'no-store',
        })

        if (!res.ok) throw new Error("Stream not ready")

        const data = await res.json()
        
        if (!data.signed_url) {
          throw new Error("No signed URL in response")
        }
        
        const fullStreamUrl = data.signed_url.startsWith('http') 
          ? data.signed_url 
          : `https://reedstreams-wx-78.fly.dev${data.signed_url}`
        
        // Wrap stream URL through worker for edge caching
        const proxiedStreamUrl = getProxiedStreamUrl(fullStreamUrl);
        setStreamUrl(proxiedStreamUrl)
        setLoading(false)
        return
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

  useEffect(() => {
    if (playerState === 'countdown' || hasFetched.current) return
    hasFetched.current = true
    fetchStream()
  }, [playerState, fetchStream])

  const handlePlayClick = () => {
    setPlayerState('ready')
    setIsPlaying(true)
    recordView() // Record view when user clicks play
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

  const handlePlayerSwitch = useCallback((newPlayer: PlayerType) => {
    if (newPlayer === currentPlayer) return;

    const video = playerContainerRef.current?.querySelector('video') as HTMLVideoElement | null;
    if (video && video.currentTime > 0) {
      setResumeTime(video.currentTime);
      setIsPlaying(!video.paused);
    } else {
      setResumeTime(undefined);
    }

    // 🧹 Cleanup when switching FROM JW Player
    if (currentPlayer === 'jw' && newPlayer !== 'jw') {
      setPpvIframeUrl(null);
      setPpvLoading(false);
    }

    setCurrentPlayer(newPlayer);
    setPreferredPlayer(newPlayer);
  }, [currentPlayer, setPreferredPlayer]);

  const handlePlayerError = (err: string) => {
    setError(err)
  }

  const countdownDisplay = useMemo(() => formatTime(timeRemaining), [timeRemaining])

  // Fetch iframe from PPV.to API when JW Player is selected
  const [ppvIframeUrl, setPpvIframeUrl] = useState<string | null>(null)
  const [ppvLoading, setPpvLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Ensure client-side only rendering for iframe
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cleanup when leaving JW Player
  useEffect(() => {
    if (currentPlayer !== 'jw') {
      setPpvIframeUrl(null);
      setPpvLoading(false);
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (currentPlayer === 'jw' && !ppvIframeUrl && !ppvLoading) {
      setPpvLoading(true)
      fetch('https://api.ppv.to/api/streams')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.streams) {
            for (const category of data.streams) {
              for (const stream of category.streams) {
                if (String(stream.id) === String(matchId)) {
                  if (stream.iframe) {
                    setPpvIframeUrl(stream.iframe)
                  } else if (stream.uri_name) {
                    // Construct embed URL from uri_name
                    setPpvIframeUrl(`https://pooembed.eu/embed/${stream.uri_name.split('/').pop()}`)
                  }
                  setPpvLoading(false)
                  return
                }
              }
            }
          }
          setPpvLoading(false)
        })
        .catch(() => setPpvLoading(false))
    }
  }, [currentPlayer, matchId, ppvIframeUrl, ppvLoading])

  const iframeSrc = ppvIframeUrl

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
    borderRadius: '50%',
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

  // Countdown state - WITH player selector
  if (playerState === 'countdown') {
    return (
      <div>
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
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '8px 12px' }}>
          <div style={{ fontSize: 11, color: '#555' }}>
            Player: <span style={{ color: '#888' }}>
              {currentPlayer === "hls" ? "HLS.js" : currentPlayer === "videojs" ? "Video.js" : currentPlayer === "shaka" ? "Shaka" : "JW Player"}
            </span>
          </div>
          <PlayerSelector compact selected={currentPlayer} onSelect={handlePlayerSwitch} />
        </div>
      </div>
    )
  }

  // Loading state - WITH player selector
  if (loading && !streamUrl && currentPlayer !== 'jw') {
    return (
      <div>
        <div style={wrapperStyle}>
          <div style={stateContainerStyle}>
            <Loader2 size={32} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginTop: 12, fontWeight: 500, fontSize: 12, letterSpacing: 0.5, color: '#666' }}>
              LOADING STREAM
            </span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '8px 12px' }}>
          <div style={{ fontSize: 11, color: '#555' }}>
            Player: <span style={{ color: '#888' }}>
              {currentPlayer === "hls" ? "HLS.js" : currentPlayer === "videojs" ? "Video.js" : currentPlayer === "shaka" ? "Shaka" : "JW Player"}
            </span>
          </div>
          <PlayerSelector compact selected={currentPlayer} onSelect={handlePlayerSwitch} />
        </div>
      </div>
    )
  }

  // Error state - WITH player selector
  if (error && !streamUrl && currentPlayer !== 'jw') {
    return (
      <div>
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
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '8px 12px' }}>
          <div style={{ fontSize: 11, color: '#555' }}>
            Player: <span style={{ color: '#888' }}>
              {currentPlayer === "hls" ? "HLS.js" : currentPlayer === "videojs" ? "Video.js" : currentPlayer === "shaka" ? "Shaka" : "JW Player"}
            </span>
          </div>
          <PlayerSelector compact selected={currentPlayer} onSelect={handlePlayerSwitch} />
        </div>
      </div>
    )
  }

  // JW Player (iframe)
  if (currentPlayer === 'jw') {
    // Force remount when switching to JW Player
    const jwKey = `jw-${matchId}-${Date.now()}`;
    if (ppvLoading || !iframeSrc) {
      return (
        <div key={`jw-loading-${matchId}-${Date.now()}`}>
          <div style={wrapperStyle}>
            <div style={stateContainerStyle}>
              <Loader2 size={32} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ marginTop: 12, fontWeight: 500, fontSize: 12, color: '#666' }}>
                {ppvLoading ? 'Loading from backend...' : 'Stream not available on backend'}
              </span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '8px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 11, color: '#555' }}>
                Player: <span style={{ color: '#888' }}>JW Player</span>
              </div>
              <ViewsCounter matchId={matchId} compact />
            </div>
            <PlayerSelector compact selected={currentPlayer} onSelect={handlePlayerSwitch} />
          </div>
        </div>
      )
    }
    
    return (
      <div key={jwKey}>
        <div style={{...wrapperStyle, position: 'relative'}}>
          {mounted ? (
            <>
              <JWPlayerIframe embedUrl={iframeSrc} />
              {/* Click-through shield */}
              <JWClickShield />
            </>
          ) : (
            <div style={stateContainerStyle}>
              <Loader2 size={32} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ marginTop: 12, fontWeight: 500, fontSize: 12, color: '#666' }}>
                Initializing player...
              </span>
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 11, color: '#555' }}>
              Player: <span style={{ color: '#888' }}>JW Player</span>
            </div>
            <ViewsCounter matchId={matchId} compact />
          </div>
          <PlayerSelector compact selected={currentPlayer} onSelect={handlePlayerSwitch} />
        </div>
      </div>
    )
  }

  // Regular players
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
        return <ReedVideoJS key={`videojs-${matchId}-${Date.now()}`} {...commonProps} />;
      case "shaka":
        return <ShakaPlayer key={`shaka-${matchId}-${Date.now()}`} {...commonProps} />;
      case "hls":
      default:
        return <HLSPlayer key={`hls-${matchId}-${Date.now()}`} {...commonProps} />;
    }
  };

  return (
    <div>
      <div style={wrapperStyle} ref={playerContainerRef}>
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

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 11, color: '#555' }}>
            Player: <span style={{ color: '#888' }}>
              {currentPlayer === "hls" ? "HLS.js" : currentPlayer === "videojs" ? "Video.js" : currentPlayer === "shaka" ? "Shaka" : "JW Player"}
            </span>
          </div>
          <ViewsCounter matchId={matchId} compact />
        </div>
        <PlayerSelector compact selected={currentPlayer} onSelect={handlePlayerSwitch} />
      </div>
    </div>
  )
}

// JW Player iframe component
function JWPlayerIframe({ embedUrl }: { embedUrl: string }) {
  // Detect device BEFORE render (SSR-safe)
  const [deviceInfo] = useState(() => {
    if (typeof navigator === 'undefined') {
      return { isMobile: true, isSafari: false, isChrome: false }
    }
    const ua = navigator.userAgent
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua)
    const isChrome = /Chrome/.test(ua) && !/Edge/.test(ua) && !isMobile
    return { isMobile, isSafari, isChrome }
  })

  // Sandbox blocks window.open on mobile/Safari where JS shield might not reach
  const useSandbox = deviceInfo.isMobile || deviceInfo.isSafari

  const baseProps = {
    src: embedUrl,
    className: "video-iframe",
    style: { width: '100%', height: '100%', border: 'none' } as React.CSSProperties,
    allowFullScreen: true,
    referrerPolicy: "no-referrer" as const,
  }

  if (useSandbox) {
    return (
      <iframe
        {...baseProps}
        // Sandbox blocks popups
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
      />
    )
  }

  // Chrome desktop - rely on JS shield
  return <iframe {...baseProps} />
}

// Click-through shield component
function JWClickShield() {
  const [isBlocking, setIsBlocking] = useState(true)
  const [tapCount, setTapCount] = useState(0)

  // Re-enable shield after 4 seconds of no interaction
  useEffect(() => {
    if (!isBlocking) {
      const timer = setTimeout(() => {
        setIsBlocking(true)
        setTapCount(0)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isBlocking, tapCount])

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newCount = tapCount + 1
    setTapCount(newCount)

    // First tap: absorb it (block potential ad)
    // Second+ tap: allow through for 4 seconds
    if (newCount >= 1) {
      setIsBlocking(false)
    }
  }

  if (!isBlocking) return null

  return (
    <div
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation() }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        background: 'transparent',
        cursor: 'pointer',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    />
  )
}
