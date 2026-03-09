'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Trophy, Clock, RefreshCw, Eye } from 'lucide-react'
import '../../styles/Sportsgrid.css'

import { API_STREAMS_URL } from '@/config/api'
import { useBatchViews } from '@/hooks/useViews'

const PPVSU_URL = API_STREAMS_URL

// PPVSU Types
interface PpvsuGame {
  id: number
  name: string
  poster: string
  start_time: number
  end_time: number
  video_link: string
  category: string
}

interface PpvsuCategory {
  category: string
  games: PpvsuGame[]
}

interface PpvsuData {
  categories?: PpvsuCategory[]
}

// Unified Game Type for UI
interface UnifiedGame {
  id: number | string
  name: string
  poster: string
  start_time: number
  end_time: number
  category: string
  source: 'ppvsu'
  is_live: boolean
  league?: string
}

interface UnifiedCategory {
  category: string
  games: UnifiedGame[]
  icon?: React.ComponentType<{size: number, color: string}>
  source: 'ppvsu'
}

const isLive = (startTime: number, endTime: number): boolean => {
  const now = Math.floor(Date.now() / 1000)
  return now >= startTime && now <= endTime
}

const isAlwaysLive = (category: string): boolean => {
  const alwaysLiveCategories = ['24/7', '24/7 channels', '24/7 Streams', 'always live', 'tv channels']
  return alwaysLiveCategories.some(cat => category.toLowerCase().includes(cat.toLowerCase()))
}

const isAmericanFootball = (category: string): boolean => {
  const cat = category.toLowerCase()
  return (cat.includes('football') && !cat.includes('soccer')) || cat.includes('nfl')
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const SkeletonPill = () => (
  <div className="selector-pill skeleton-pill skeleton-pulse">
    <div className="skeleton-pill-icon" />
    <div className="skeleton-pill-label" />
  </div>
)

const SkeletonMatchCard = () => (
  <div className="match-card-link">
    <div className="match-card skeleton-match-card skeleton-pulse">
      <div className="match-visual">
        <div className="skeleton-logo" />
      </div>
      <div className="match-info">
        <div className="skeleton-title" />
        <div className="skeleton-subtitle" />
      </div>
    </div>
  </div>
)

const MatchCard = React.memo(({ game, onImageError, showViews = false }: { 
  game: UnifiedGame
  onImageError: (id: number | string) => void 
  showViews?: boolean
}) => {
  const [imageError, setImageError] = useState(false)
  
  // Live tag logic: use is_live from API or calculate from time
  const live = game.is_live || isLive(game.start_time, game.end_time)
  const alwaysLive = isAlwaysLive(game.category)

  return (
    <Link
      href={`/match/${game.id}?source=${game.source}`}
      className="match-card-link"
    >
      <article className="match-card">
        <div className="match-visual" style={{ padding: 0 }}>
          <div className="card-top-row">
            <span className={`status-badge ${live || alwaysLive ? 'live' : 'upcoming'}`}>
              {live || alwaysLive ? 'LIVE' : formatTime(game.start_time)}
            </span>
            {/* 👁️ Views count for Popular row */}
            {showViews && <ViewsBadgeInline matchId={String(game.id)} />}
          </div>
          {!imageError ? (
            <img 
              src={game.poster} 
              alt={game.name}
              style={{objectFit: "cover", width: "100%", height: "100%", display: "block"}} 
              onError={() => {
                setImageError(true)
                onImageError(game.id)
              }} 
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#1a1a1a' }}>
              <span style={{ color: '#444', fontSize: '14px' }}>No Image</span>
            </div>
          )}
        </div>
        <div className="match-info">
          <p className="match-main-title">{game.name}</p>
          <p className="match-sub-meta">{game.league || game.category}</p>
        </div>
      </article>
    </Link>
  )
})
MatchCard.displayName = 'MatchCard'

// 👁️ Inline views badge for cards
function ViewsBadgeInline({ matchId }: { matchId: string }) {
  const [views, setViews] = useState<number | null>(null)
  
  useEffect(() => {
    fetch(`https://reedstreams-wx-78.fly.dev/api/v1/views/count/${matchId}`)
      .then(r => r.json())
      .then(data => setViews(data.views))
      .catch(() => {})
  }, [matchId])
  
  if (views === null || views === 0) return null
  
  const formatViews = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }
  
  return (
    <span className="views-badge-inline">
      <Eye size={10} />
      {formatViews(views)}
      <style jsx>{`
        .views-badge-inline {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          color: #aaa;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 3px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </span>
  )
}

const SportsCategorySelector = ({ loading, liveMatches }: { loading: boolean, liveMatches?: UnifiedGame[] }) => {
  const sports = [
    { id: 'soccer', name: 'Soccer', icon: '⚽' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'baseball', name: 'Baseball', icon: '⚾' },
    { id: 'football', name: 'Football', icon: '🏈' },
    { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
    { id: 'mma', name: 'MMA / UFC', icon: '🥊' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'golf', name: 'Golf', icon: '⛳' },
    { id: 'motorsports', name: 'Motorsports', icon: '🏎️' },
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: 'combat sports', name: 'Combat Sports', icon: '🥋' },
    { id: 'darts', name: 'Darts', icon: '🎯' },
    { id: '24/7 Streams', name: '24/7 Streams', icon: '📺' },
  ]

  // Count live matches per sport category
  const getLiveCount = (sportId: string): number => {
    if (!liveMatches || liveMatches.length === 0) return 0
    return liveMatches.filter(m => {
      const cat = m.category?.toLowerCase() || ''
      if (sportId === 'football') {
        return (cat.includes('football') && !cat.includes('soccer')) || cat.includes('nfl')
      }
      if (sportId === 'combat sports') {
        return cat.includes('combat') || cat.includes('mma') || cat.includes('boxing')
      }
      if (sportId === '24/7 Streams') {
        return cat.includes('24/7')
      }
      return cat.includes(sportId.toLowerCase())
    }).length
  }

  return (
    <section className="top-selector-area">
      <div className="section-row-header">
        <div className="title-block">
          <Trophy size={20} color="var(--accent-color)" />
          <h2 className="section-title">Sports Categories</h2>
        </div>
      </div>
      <div className="selector-grid">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />)
        ) : (
          sports.map(sport => {
            const liveCount = getLiveCount(sport.id)
            return (
              <Link key={sport.id} href={`/live-matches?sportId=${sport.id}`} className="selector-pill" style={{ position: 'relative' }}>
                {/* 🔴 Premium Live Badge */}
                {liveCount > 0 && (
                  <span className="sport-live-badge">
                    <span className="live-pulse-dot" />
                    {liveCount}
                  </span>
                )}
                <span className="pill-icon">{sport.icon}</span>
                <span className="pill-label">{sport.name}</span>
              </Link>
            )
          })
        )}
      </div>
      <style jsx>{`
        .sport-live-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #ff3b3b 0%, #ff0000 50%, #d90000 100%);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          box-shadow: 
            0 2px 8px rgba(255, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.3px;
          backdrop-filter: blur(4px);
        }
        .live-pulse-dot {
          width: 5px;
          height: 5px;
          background: #fff;
          border-radius: 50%;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          50% { opacity: 0.8; transform: scale(0.9); box-shadow: 0 0 0 4px rgba(255, 255, 255, 0); }
        }
      `}</style>
    </section>
  )
}

const MatchCarousel = ({ 
  category, 
  games, 
  onImageError, 
  icon: Icon 
}: { 
  category: string
  games: UnifiedGame[]
  onImageError: (id: number | string) => void
  icon?: React.ComponentType<{size: number, color: string}>
}) => {
  const liveCount = games.filter(g => g.is_live || isLive(g.start_time, g.end_time) || isAlwaysLive(g.category)).length
  const isPopular = category === 'Popular'

  return (
    <section className="matches-section">
      <div className="section-row-header">
        <div className="title-block">
          {Icon && <Icon size={20} color="var(--accent-color)" />}
          <h2 className="section-title">{category}</h2>
          {liveCount > 0 && <span className="live-count-tag">{liveCount} Live</span>}
        </div>
      </div>
      <div className="carousel-track">
        {games.map(game => (
          <MatchCard 
            key={`${game.source}-${game.id}`} 
            game={game} 
            onImageError={onImageError}
            showViews={isPopular}
          />
        ))}
      </div>
    </section>
  )
}

// Fetch both PPVSU and Sportsurge data
async function fetchAllStreams(): Promise<UnifiedCategory[]> {
  const ppvsuRes = await fetch(PPVSU_URL)

  const result: UnifiedCategory[] = []

  // Process PPVSU data
  if (ppvsuRes.ok) {
    const ppvsuData: PpvsuData = await ppvsuRes.json()
    if (ppvsuData.categories) {
      ppvsuData.categories.forEach(cat => {
        result.push({
          category: cat.category,
          games: cat.games.map(g => ({
            id: g.id,
            name: g.name,
            poster: g.poster,
            start_time: g.start_time,
            end_time: g.end_time,
            category: g.category,
            source: 'ppvsu' as const,
            is_live: isLive(g.start_time, g.end_time)
          })),
          source: 'ppvsu'
        })
      })
    }
  }

  return result
}

function useRetryFetch<T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 2000
): { data: T | null; loading: boolean; error: string | null; retry: () => void } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await fetchFn()
        setData(result)
        setLoading(false)
        return
      } catch (err) {
        if (attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, retryDelay * (attempt + 1)))
        } else {
          setError('Unable to load content. Please try again.')
          setLoading(false)
        }
      }
    }
  }, [fetchFn, maxRetries, retryDelay])

  useEffect(() => {
    execute()
  }, [execute, retryCount])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { data, loading, error, retry }
}

interface SportsGridProps {
  initialData?: { categories?: PpvsuCategory[] }
}

export default function SportsGrid({ initialData }: SportsGridProps) {
  const [hiddenGameIds, setHiddenGameIds] = useState<Set<number | string>>(new Set())

  const { data: fetchedCategories, loading, error, retry } = useRetryFetch(
    fetchAllStreams,
    3,
    2000
  )
  
  // Use initialData if available, otherwise use fetched data
  const categories = initialData?.categories && initialData.categories.length > 0
    ? initialData.categories.map(cat => ({
        category: cat.category,
        games: cat.games.map(g => ({
          id: g.id,
          name: g.name,
          poster: g.poster,
          start_time: g.start_time,
          end_time: g.end_time,
          category: g.category,
          source: 'ppvsu' as const,
          is_live: isLive(g.start_time, g.end_time)
        })),
        source: 'ppvsu' as const
      }))
    : fetchedCategories

  const handleImageError = useCallback((id: number | string) => {
    setHiddenGameIds(prev => new Set(prev).add(id))
  }, [])

  // organize games
  const organizedCategories = useMemo(() => {
    if (!categories) return []
    
    // filter out broken image games
    const filtered = categories
      .map(cat => ({
        ...cat,
        games: cat.games.filter(g => !hiddenGameIds.has(g.id))
      }))
      .filter(cat => cat.games.length > 0)

    const result: UnifiedCategory[] = []

    // split categories
    const regularCategories: UnifiedCategory[] = []
    const alwaysLiveCategories: UnifiedCategory[] = []
    
    filtered.forEach(cat => {
      if (isAlwaysLive(cat.category)) {
        alwaysLiveCategories.push(cat)
      } else {
        regularCategories.push(cat)
      }
    })

    // build "Popular" section
    const popularGames: UnifiedGame[] = []
    const gamesPerCategory = new Map<string, number>()
    const minGamesFromEach = 1
    const maxGamesFromEach = 3
    const targetPopularCount = 12

    // grab at least 1 from each category first
    regularCategories.forEach(cat => {
      const sortedGames = [...cat.games].sort((a, b) => {
        const aLive = a.is_live || isLive(a.start_time, a.end_time)
        const bLive = b.is_live || isLive(b.start_time, b.end_time)
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        return a.start_time - b.start_time
      })
      
      const toAdd = sortedGames.slice(0, minGamesFromEach)
      popularGames.push(...toAdd)
      gamesPerCategory.set(cat.category, toAdd.length)
    })

    // fill up to target
    if (popularGames.length < targetPopularCount) {
      regularCategories.forEach(cat => {
        const currentCount = gamesPerCategory.get(cat.category) || 0
        if (currentCount < maxGamesFromEach) {
          const sortedGames = [...cat.games].sort((a, b) => {
            const aLive = a.is_live || isLive(a.start_time, a.end_time)
            const bLive = b.is_live || isLive(b.start_time, b.end_time)
            if (aLive && !bLive) return -1
            if (!aLive && bLive) return 1
            return a.start_time - b.start_time
          })
          
          const additional = sortedGames.slice(currentCount, currentCount + (maxGamesFromEach - currentCount))
          const needed = targetPopularCount - popularGames.length
          const toAdd = additional.slice(0, needed)
          popularGames.push(...toAdd)
        }
      })
    }

    // sort popular - live first
    popularGames.sort((a, b) => {
      const aLive = a.is_live || isLive(a.start_time, a.end_time)
      const bLive = b.is_live || isLive(b.start_time, b.end_time)
      if (aLive && !bLive) return -1
      if (!aLive && bLive) return 1
      return a.start_time - b.start_time
    })

    // add popular section
    if (popularGames.length > 0) {
      result.push({
        category: 'Popular',
        games: popularGames,
        icon: undefined,
        source: 'ppvsu'
      })
    }

    // sort regular categories - basketball first, then football
    const sortedCategories = [...regularCategories].sort((a, b) => {
      const aIsBasketball = a.category.toLowerCase().includes('basketball')
      const bIsBasketball = b.category.toLowerCase().includes('basketball')
      const aIsFootball = isAmericanFootball(a.category)
      const bIsFootball = isAmericanFootball(b.category)
      
      // Basketball first
      if (aIsBasketball && !bIsBasketball) return -1
      if (!aIsBasketball && bIsBasketball) return 1
      
      // Then Football
      if (aIsFootball && !bIsFootball) return -1
      if (!aIsFootball && bIsFootball) return 1
      
      const aLiveCount = a.games.filter(g => g.is_live || isLive(g.start_time, g.end_time)).length
      const bLiveCount = b.games.filter(g => g.is_live || isLive(g.start_time, g.end_time)).length
      
      if (aLiveCount > 0 && bLiveCount === 0) return -1
      if (aLiveCount === 0 && bLiveCount > 0) return 1
      if (aLiveCount !== bLiveCount) return bLiveCount - aLiveCount
      
      return 0
    })

    // add regular categories
    sortedCategories.forEach(cat => {
      const sortedGames = [...cat.games].sort((a, b) => {
        const aLive = a.is_live || isLive(a.start_time, a.end_time)
        const bLive = b.is_live || isLive(b.start_time, b.end_time)
        
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        if (!aLive && !bLive) return a.start_time - b.start_time
        return 0
      })
      
      result.push({
        category: cat.category,
        games: sortedGames,
        icon: cat.icon,
        source: cat.source
      })
    })

    // 24/7 channels at bottom
    alwaysLiveCategories.forEach(cat => {
      result.push({
        category: cat.category,
        games: cat.games,
        icon: Clock,
        source: cat.source
      })
    })

    return result
  }, [categories, hiddenGameIds])

  // Get all live matches for the sports badges
  const allLiveMatches = useMemo(() => {
    if (!organizedCategories) return []
    return organizedCategories.flatMap(cat => cat.games.filter(g => g.is_live))
  }, [organizedCategories])

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        <SportsCategorySelector loading={loading} liveMatches={allLiveMatches} />

        <div className="matches-grid-container">
          {loading && !initialData?.categories?.length ? (
            Array(3).fill(0).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="skeleton-header skeleton-pulse" />
                <div className="carousel-track">
                  {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
                </div>
              </React.Fragment>
            ))
          ) : error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: '#666',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <p style={{ fontSize: '18px', fontWeight: 500, color: '#999' }}>Connection Error</p>
              <p style={{ fontSize: '14px', color: '#666' }}>Unable to load content</p>
              <button 
                onClick={retry}
                style={{
                  background: '#8db902',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          ) : organizedCategories.length === 0 && !loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: '#666',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <p style={{ fontSize: '18px', fontWeight: 500, color: '#999' }}>No Content Available</p>
              <p style={{ fontSize: '14px', color: '#666' }}>Check back later</p>
              <button 
                onClick={retry}
                style={{
                  background: '#8db902',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          ) : (
            organizedCategories.map(cat => (
              <MatchCarousel
                key={cat.category}
                category={cat.category}
                games={cat.games}
                onImageError={handleImageError}
                icon={cat.icon}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
