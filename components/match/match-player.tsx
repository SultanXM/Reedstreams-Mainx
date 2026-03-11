"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useViews } from "@/hooks/useViews"
import { AlertCircle, Loader2, RefreshCw, Monitor, Wifi, Settings } from "lucide-react"
import ViewsCounter from "./ViewsCounter"
import { 
  fetchStreams, 
  StreamedStream,
  StreamedMatch,
  fetchLiveMatches,
  getBestSource 
} from "@/lib/streamed-api"

interface MatchPlayerProps {
  matchId: string
  initialSource?: string
  initialSourceId?: string
}

export default function MatchPlayer({ 
  matchId, 
  initialSource,
  initialSourceId 
}: MatchPlayerProps) {
  const { recordView } = useViews(matchId)

  const [streams, setStreams] = useState<StreamedStream[]>([])
  const [selectedStream, setSelectedStream] = useState<StreamedStream | null>(null)
  const [matchData, setMatchData] = useState<StreamedMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Find match data and available sources
  useEffect(() => {
    const findMatch = async () => {
      try {
        // Try to get from sessionStorage first
        const stored = sessionStorage.getItem("currentMatch")
        if (stored) {
          const data = JSON.parse(stored)
          if (String(data.id) === matchId && data.sources) {
            setMatchData(data)
            return
          }
        }

        // Fetch from API
        const matches = await fetchLiveMatches()
        const match = matches.find(m => m.id === matchId)
        if (match) {
          setMatchData(match)
          sessionStorage.setItem("currentMatch", JSON.stringify(match))
        }
      } catch (e) {
        // Silent fail
      }
    }
    findMatch()
  }, [matchId])

  // Load streams for the selected source
  const loadStreams = useCallback(async (source: string, sourceId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const streamsData = await fetchStreams(source, sourceId)
      
      if (streamsData.length === 0) {
        setError("No streams available for this source")
        setStreams([])
        setSelectedStream(null)
      } else {
        setStreams(streamsData)
        // Auto-select first HD stream or first stream
        const hdStream = streamsData.find(s => s.hd)
        setSelectedStream(hdStream || streamsData[0])
      }
    } catch (err) {
      setError("Failed to load streams. Please try another source.")
      setStreams([])
      setSelectedStream(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load with provided source or best source
  useEffect(() => {
    if (!matchData) return
    
    if (initialSource && initialSourceId) {
      loadStreams(initialSource, initialSourceId)
    } else {
      const best = getBestSource(matchData)
      if (best) {
        loadStreams(best.source, best.id)
      } else {
        setError("No sources available for this match")
        setLoading(false)
      }
    }
  }, [matchData, initialSource, initialSourceId, loadStreams])

  const handleSourceChange = (source: string, sourceId: string) => {
    loadStreams(source, sourceId)
    setIsPlaying(false)
  }

  const handleStreamChange = (stream: StreamedStream) => {
    setSelectedStream(stream)
    setIsPlaying(false)
  }

  const handlePlay = () => {
    setIsPlaying(true)
    recordView()
  }

  const handleRetry = () => {
    if (matchData) {
      const best = getBestSource(matchData)
      if (best) {
        loadStreams(best.source, best.id)
      }
    }
  }

  // Wrapper styles
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
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
    background: 'rgba(0,0,0,0.6)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  }

  const playCircleStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    background: 'rgba(141, 185, 2, 0.9)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background 0.2s ease',
  }

  const retryBtnStyle: React.CSSProperties = {
    marginTop: 16,
    background: '#8db902',
    color: '#000',
    padding: '10px 20px',
    fontWeight: 600,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }

  // Get available sources from match data
  const availableSources = matchData?.sources || []

  // Current active source
  const currentSource = selectedStream?.source || initialSource

  return (
    <div>
      {/* Player Container */}
      <div style={wrapperStyle}>
        {loading ? (
          <div style={stateContainerStyle}>
            <Loader2 size={36} color="#666" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginTop: 16, fontWeight: 500, fontSize: 13, letterSpacing: 0.5, color: '#666' }}>
              LOADING STREAM
            </span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={stateContainerStyle}>
            <AlertCircle color="#c44" size={40} />
            <span style={{ marginTop: 12, fontWeight: 500, color: '#aaa', textAlign: 'center', padding: '0 20px', fontSize: 14 }}>
              {error}
            </span>
            <button onClick={handleRetry} style={retryBtnStyle}>
              <RefreshCw size={14} /> RETRY
            </button>
          </div>
        ) : !selectedStream ? (
          <div style={stateContainerStyle}>
            <Wifi size={40} color="#666" />
            <span style={{ marginTop: 12, fontWeight: 500, color: '#666', textAlign: 'center' }}>
              Select a source to start watching
            </span>
          </div>
        ) : !isPlaying ? (
          <>
            {/* Poster/Thumbnail preview */}
            {matchData?.poster && (
              <img 
                src={`https://streamed.pk${matchData.poster}.webp`}
                alt={matchData.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.4,
                }}
              />
            )}
            <div 
              style={playOverlayStyle}
              onClick={handlePlay}
              onMouseEnter={(e) => {
                const circle = e.currentTarget.querySelector<HTMLDivElement>('[data-play-circle]')
                if (circle) {
                  circle.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                const circle = e.currentTarget.querySelector<HTMLDivElement>('[data-play-circle]')
                if (circle) {
                  circle.style.transform = 'scale(1)'
                }
              }}
            >
              <div data-play-circle style={playCircleStyle}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '24px solid #000',
                  borderTop: '14px solid transparent',
                  borderBottom: '14px solid transparent',
                  marginLeft: 4,
                }} />
              </div>
              <span style={{ marginTop: 16, color: '#fff', fontSize: 14, fontWeight: 500 }}>
                Click to Play
              </span>
            </div>
          </>
        ) : (
          <iframe
            ref={iframeRef}
            src={selectedStream.embedUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allowFullScreen
            allow="autoplay; fullscreen"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Source & Stream Selector Bar */}
      <div className="player-controls">
        {/* Source Selector */}
        <div className="control-row">
          <div className="control-label">
            <Monitor size={14} />
            <span>Sources</span>
          </div>
          <div className="control-options">
            {availableSources.map((src) => {
              const isActive = currentSource === src.source
              return (
                <button
                  key={`source-${src.source}-${src.id}`}
                  onClick={() => handleSourceChange(src.source, src.id)}
                  className={`source-btn ${isActive ? 'active' : ''}`}
                >
                  {src.source}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stream Quality Selector */}
        {streams.length > 1 && (
          <div className="control-row">
            <div className="control-label">
              <Settings size={14} />
              <span>Quality</span>
            </div>
            <div className="control-options">
              {streams.map((stream) => {
                const isActive = selectedStream?.id === stream.id
                return (
                  <button
                    key={`stream-${stream.id}-${stream.streamNo}`}
                    onClick={() => handleStreamChange(stream)}
                    className={`quality-btn ${isActive ? 'active' : ''}`}
                  >
                    {stream.hd && <span className="hd-badge">HD</span>}
                    <span>{stream.language}</span>
                    <span className="stream-num">#{stream.streamNo}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Stream Info */}
        <div className="player-info-bar">
          <div className="player-info-left">
            <ViewsCounter matchId={matchId} compact />
            {selectedStream && (
              <span className="player-stream-meta">
                {selectedStream.language} • {selectedStream.hd ? 'HD' : 'SD'}
              </span>
            )}
          </div>
          <span className="player-source-meta">
            via {currentSource || 'stream'}
          </span>
        </div>
      </div>
    </div>
  )
}
