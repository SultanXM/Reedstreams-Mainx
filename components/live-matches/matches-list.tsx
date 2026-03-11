'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ChevronRight, Search, X, Calendar, ChevronDown, RefreshCw, Eye } from 'lucide-react'
import '../../styles/live-matches.css'

import { 
  fetchMatchesBySport, 
  fetchLiveMatches,
  StreamedMatch,
  transformToUnifiedGame,
  getBestSource
} from '@/lib/streamed-api'

// Unified Game Type
interface Game {
  id: string
  name: string
  poster: string
  start_time: number
  end_time: number
  category: string
  source: 'streamed'
  is_live?: boolean
  streamedMatch: StreamedMatch
}

const isLive = (startTime: number, endTime: number, currentTimeMs: number = Date.now()): boolean => {
  const now = Math.floor(currentTimeMs / 1000)
  return now >= startTime && now <= endTime
}

const isUpcoming = (startTime: number, currentTimeMs: number = Date.now()): boolean => {
  const now = Math.floor(currentTimeMs / 1000)
  return startTime > now
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getDateLabel = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return "TODAY"
  if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW"
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()
}

const SkeletonRow = () => (
  <div className="match-row skeleton-pulse">
    <div className="row-poster-container" />
    <div className="row-content-wrapper">
      <div className="row-info">
        <div className="sk-text sk-w-30" style={{ height: '12px', marginBottom: '12px' }} />
        <div className="sk-text sk-w-60" style={{ height: '24px' }} />
      </div>
      <div className="row-meta-col sk-hide-mobile">
        <div className="sk-text sk-w-100" style={{ height: '35px', borderRadius: '8px' }} />
      </div>
    </div>
  </div>
)

// Views badge component
function ViewsBadgeRow({ matchId, views }: { matchId: string; views?: number }) {
  if (!views || views === 0) return null
  
  const formatViews = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }
  
  return (
    <span className="row-views-badge">
      <Eye size={10} />
      {formatViews(views)}
    </span>
  )
}

const MatchRow = React.memo(({ game, onImageError, currentTime, views }: { 
  game: Game
  onImageError: (id: string) => void
  currentTime: number 
  views?: number
}) => {
  const [imageError, setImageError] = useState(false)
  const live = isLive(game.start_time, game.end_time, currentTime)

  // Get best source for the match link
  const bestSource = getBestSource(game.streamedMatch)
  const sourceParam = bestSource ? `source=${bestSource.source}&sourceId=${bestSource.id}` : ''
  
  // Construct full image URL - use proxy to avoid CORS
  const getImageUrl = (poster: string): string => {
    if (!poster) return ''
    if (poster.startsWith('http')) return `/api/image-proxy?url=${encodeURIComponent(poster)}`
    // Poster already includes .webp extension
    return `/api/image-proxy?url=${encodeURIComponent(`https://streamed.pk${poster}`)}`
  }
  
  const imageUrl = getImageUrl(game.poster)
  const hasImage = !!imageUrl

  return (
    <Link href={`/match/${game.id}?${sourceParam}`} className="match-row-link">
      <article className="match-row">
        <div className="row-poster-container" style={{ width: '100px', flex: '0 0 100px', overflow: 'hidden' }}>
          <img 
            src={imageUrl}
            alt={game.name}
            referrerPolicy="no-referrer"
            onError={() => {
              setImageError(true)
              onImageError(game.id)
            }}
            className="row-poster" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <div className="row-content-wrapper">
          <div className="row-info">
            <div className="row-category">
              {game.category}
              <ViewsBadgeRow matchId={game.id} views={views} />
            </div>
            <div className="row-title">{game.name}</div>
          </div>
          <div className="row-meta-col">
            <div className={`row-status-badge ${live ? 'live' : 'upcoming'}`}>
              {live ? <><span className="live-dot" /> LIVE</> : <><Clock size={12} /> {formatTime(game.start_time)}</>}
            </div>
            <div className="row-action-btn">WATCH <ChevronRight size={14} /></div>
          </div>
        </div>
      </article>
      <style jsx>{`
        .row-views-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          background: rgba(255, 255, 255, 0.08);
          color: #888;
          font-size: 10px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          vertical-align: middle;
        }
      `}</style>
    </Link>
  )
})

export default function LiveMatches() {
  const searchParams = useSearchParams()
  const urlSportId = searchParams.get('sportId') || 'all'
  
  const DISPLAY_NAMES: Record<string, string> = {
    'football': 'Football',
    'american-football': 'American Football',
    'basketball': 'Basketball',
    'hockey': 'Ice Hockey',
    'baseball': 'Baseball',
    'fight': 'MMA / UFC',
    'mma': 'MMA / UFC',
    'tennis': 'Tennis',
    'golf': 'Golf',
    'motor-sports': 'Motor Sports',
    'cricket': 'Cricket',
    'rugby': 'Rugby',
    'all': 'All Sports'
  }

  const urlSportName = DISPLAY_NAMES[urlSportId] || urlSportId.charAt(0).toUpperCase() + urlSportId.slice(1)

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL')
  const [visibleCount, setVisibleCount] = useState(20)
  const [hiddenGameIds, setHiddenGameIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [viewsMap, setViewsMap] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      let matches: StreamedMatch[] = []
      
      if (urlSportId === 'all') {
        matches = await fetchLiveMatches()
      } else {
        matches = await fetchMatchesBySport(urlSportId)
      }
      
      // Note: API already filters out matches without posters
      
      // Transform to Game format
      const allGames: Game[] = matches.map(m => ({
        ...transformToUnifiedGame(m),
        streamedMatch: m
      }))
      
      // Sort: live first, then upcoming, then past
      const nowSec = Math.floor(now / 1000)
      allGames.sort((a, b) => {
        const aLive = isLive(a.start_time, a.end_time, now)
        const bLive = isLive(b.start_time, b.end_time, now)
        const aUpcoming = isUpcoming(a.start_time, now)
        const bUpcoming = isUpcoming(b.start_time, now)
        
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        if (aUpcoming && bUpcoming) return a.start_time - b.start_time
        if (aUpcoming && !bUpcoming) return -1
        if (!aUpcoming && bUpcoming) return 1
        return b.end_time - a.end_time
      })
      
      setGames(allGames)
    } catch (err: any) {
      setError(err.message || 'Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [urlSportId])

  useEffect(() => {
    setVisibleCount(20)
  }, [filter, searchQuery, urlSportId])

  const handleImageError = (id: string) => {
    setHiddenGameIds(prev => new Set(prev).add(id))
  }

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      if (hiddenGameIds.has(g.id)) return false

      const matchesSearch = searchQuery === '' || 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filter === 'LIVE' 
        ? isLive(g.start_time, g.end_time, now)
        : filter === 'UPCOMING' 
          ? isUpcoming(g.start_time, now)
          : true

      return matchesSearch && matchesFilter
    })
  }, [games, filter, searchQuery, hiddenGameIds, now])

  // Fetch batch views for all visible games
  useEffect(() => {
    if (filteredGames.length === 0) {
      console.log('[Views] Skipping fetch - no filtered games')
      return
    }
    
    const fetchViews = async () => {
      try {
        const { getBatchViewCounts } = await import('@/lib/views-api')
        const ids = filteredGames.slice(0, visibleCount).map(g => g.id)
        console.log('[Views] Fetching views for', ids.length, 'games')
        const counts = await getBatchViewCounts(ids)
        console.log('[Views] Got views:', counts)
        setViewsMap(counts)
      } catch (err) {
        console.error('[Views] Failed to fetch batch views:', err)
      }
    }
    
    fetchViews()
    // Refresh every 30 seconds
    const interval = setInterval(fetchViews, 30000)
    return () => clearInterval(interval)
  }, [filteredGames.slice(0, visibleCount).map(g => g.id).join(','), visibleCount])

  const groupedGames = useMemo(() => {
    const sliced = filteredGames.slice(0, visibleCount)
    const groups: { [key: string]: Game[] } = {}
    
    sliced.forEach(g => {
      const label = getDateLabel(g.start_time)
      if (!groups[label]) groups[label] = []
      groups[label].push(g)
    })
    return groups
  }, [filteredGames, visibleCount])

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
          <div className="header-title-row">
            <h1 className="page-title">{urlSportName}</h1>
            <span className="match-count">
              {loading ? 'Loading...' : `${filteredGames.length} Matches`}
            </span>
          </div>

          <div className="filter-area">
            <div className="filter-bar">
              <button className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>ALL</button>
              <button className={`filter-pill ${filter === 'LIVE' ? 'active' : ''}`} onClick={() => setFilter('LIVE')}><div className="live-dot" /> LIVE</button>
              <button className={`filter-pill ${filter === 'UPCOMING' ? 'active' : ''}`} onClick={() => setFilter('UPCOMING')}>UPCOMING</button>
              <button className={`search-toggle-btn ${isSearchOpen ? 'active' : ''}`} onClick={() => setIsSearchOpen(!isSearchOpen)}>
                {isSearchOpen ? <X size={16} /> : <Search size={16} />}
              </button>

            </div>
            {isSearchOpen && (
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  placeholder={`Search in ${urlSportName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sport-search-input"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        <div className="matches-list-wrapper">
          {loading ? (
              <div className="matches-list-container">
                {Array(6).fill(0).map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : error ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Failed to load matches</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
                <button 
                  onClick={fetchData}
                  style={{
                    background: '#8db902', color: '#000', border: 'none',
                    padding: '12px 30px', borderRadius: '6px', fontWeight: 'bold',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <RefreshCw size={16} /> Try Again
                </button>
              </div>
            ) : (
              Object.keys(groupedGames).length > 0 ? (
                <>
                  {Object.entries(groupedGames).map(([dateLabel, dateGames]) => (
                    <div key={dateLabel} className="date-group">
                      <div className="date-stamp">
                        <span className="stamp-line"></span>
                        <span className="stamp-text">{dateLabel}</span>
                        <span className="stamp-line"></span>
                      </div>
                      <div className="matches-list-container">
                        {dateGames.map(g => (
                          <MatchRow 
                            key={`${g.source}-${g.id}`} 
                            game={g} 
                            onImageError={handleImageError} 
                            currentTime={now} 
                            views={viewsMap.get(g.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredGames.length > visibleCount && (
                    <div className="load-more-container">
                      <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + 20)}>
                        Load More <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <Calendar size={60} style={{ opacity: 0.1, marginBottom: '20px' }} />
                  <h3>No {urlSportName} matches found.</h3>
                  <p>Check back later or try another category.</p>
                  {urlSportId !== 'all' && (
                    <Link href="/live-matches" style={{ display: 'inline-block', marginTop: '15px', color: '#8db902' }}>
                      View All Sports →
                    </Link>
                  )}
                </div>
              )
            )}
        </div>
      </div>
    </div>
  )
}
