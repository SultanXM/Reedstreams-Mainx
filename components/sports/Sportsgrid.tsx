'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Trophy, Clock, RefreshCw } from 'lucide-react'
import '../../styles/Sportsgrid.css'

import { API_STREAMS_URL } from '@/config/api'

const API_URL = API_STREAMS_URL

interface Game {
  id: number
  name: string
  poster: string
  start_time: number
  end_time: number
  video_link: string
  category: string
}

interface Category {
  category: string
  games: Game[]
}

interface InitialData {
  categories?: Category[]
}

const isLive = (startTime: number, endTime: number): boolean => {
  const now = Math.floor(Date.now() / 1000)
  return now >= startTime && now <= endTime
}

const isAlwaysLive = (category: string): boolean => {
  const alwaysLiveCategories = ['24/7', '24/7 channels', '24/7 Streams', 'always live', 'tv channels']
  return alwaysLiveCategories.some(cat => category.toLowerCase().includes(cat.toLowerCase()))
}

// soccer = football everywhere except america lol
const isSoccer = (category: string): boolean => {
  const soccerTerms = ['soccer', 'football']
  return soccerTerms.some(term => category.toLowerCase().includes(term.toLowerCase()))
}

// nfl stuff - the one with helmets and commercials every 5 seconds
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

const MatchCard = React.memo(({ game, onImageError }: { game: Game; onImageError: (id: number) => void }) => {
  const [imageError, setImageError] = useState(false)
  const live = isLive(game.start_time, game.end_time)
  const alwaysLive = isAlwaysLive(game.category)

  return (
    <Link
      href={`/match/${game.id}`}
      className="match-card-link"
    >
      <article className="match-card">
        <div className="match-visual" style={{ padding: 0 }}>
          <div className="card-top-row">
            <span className={`status-badge ${live || alwaysLive ? 'live' : 'upcoming'}`}>
              {live || alwaysLive ? 'LIVE' : formatTime(game.start_time)}
            </span>
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
          <p className="match-sub-meta">{game.category}</p>
        </div>
      </article>
    </Link>
  )
})
MatchCard.displayName = 'MatchCard'

const SportsCategorySelector = ({ loading }: { loading: boolean }) => {
  const sports = [
    { id: 'football', name: 'Football', icon: '🏈' },
    { id: 'soccer', name: 'Soccer', icon: '⚽' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
    { id: 'baseball', name: 'Baseball', icon: '⚾' },
    { id: 'mma', name: 'MMA / UFC', icon: '🥊' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'golf', name: 'Golf', icon: '⛳' },
    { id: 'motorsports', name: 'Motorsports', icon: '🏎️' },
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: '2026 winter olympics', name: 'Olympics', icon: '🎿' },
    { id: 'combat sports', name: 'Combat Sports', icon: '🥋' },
    { id: 'darts', name: 'Darts', icon: '🎯' },
    { id: '24/7 Streams', name: '24/7 Streams', icon: '📺' },
  ]

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
          sports.map(sport => (
            <Link key={sport.id} href={`/live-matches?sportId=${sport.id}`} className="selector-pill">
              <span className="pill-icon">{sport.icon}</span>
              <span className="pill-label">{sport.name}</span>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}

const MatchCarousel = ({ category, games, onImageError, icon: Icon }: { category: string, games: Game[], onImageError: (id: number) => void, icon?: React.ComponentType<{size: number, color: string}> }) => {
  const liveCount = games.filter(g => isLive(g.start_time, g.end_time) || isAlwaysLive(g.category)).length

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
          <MatchCard key={game.id} game={game} onImageError={onImageError} />
        ))}
      </div>
    </section>
  )
}

// retry hook cuz sometimes api be sleeping
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
        console.warn(`Attempt ${attempt + 1} failed, retrying...`)
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

export default function SportsGrid({ initialData }: { initialData?: InitialData }) {
  const [hiddenGameIds, setHiddenGameIds] = useState<Set<number>>(new Set())

  const fetchCategories = useCallback(async () => {
    const res = await fetch(API_URL)
    const data = await res.json()
    if (!data.categories) throw new Error('No categories found')
    return data.categories as Category[]
  }, [])

  const { data: categories, loading, error, retry } = useRetryFetch(
    fetchCategories,
    3,
    2000
  )

  // use server data if we got it
  const finalCategories = initialData?.categories || categories || []
  const finalLoading = initialData?.categories ? false : loading

  const handleImageError = useCallback((id: number) => {
    setHiddenGameIds(prev => new Set(prev).add(id))
  }, [])

  // organize games so they look nice
  const organizedCategories = useMemo(() => {
    // filter out broken image games
    const filtered = finalCategories
      .map(cat => ({
        ...cat,
        games: cat.games.filter(g => !hiddenGameIds.has(g.id))
      }))
      .filter(cat => cat.games.length > 0)

    const result: Array<{category: string, games: Game[], icon?: React.ComponentType<{size: number, color: string}>}> = []

    // split 24/7 channels from normal stuff
    const regularCategories: Category[] = []
    const alwaysLiveCategories: Category[] = []
    
    filtered.forEach(cat => {
      if (isAlwaysLive(cat.category)) {
        alwaysLiveCategories.push(cat)
      } else {
        regularCategories.push(cat)
      }
    })

    // build "Popular" section - grab mix from everywhere
    const popularGames: Game[] = []
    const gamesPerCategory = new Map<number, number>()
    const minGamesFromEach = 1
    const maxGamesFromEach = 3
    const targetPopularCount = 12

    // grab at least 1 from each category first
    regularCategories.forEach(cat => {
      const sortedGames = [...cat.games].sort((a, b) => {
        const aLive = isLive(a.start_time, a.end_time)
        const bLive = isLive(b.start_time, b.end_time)
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        return a.start_time - b.start_time
      })
      
      const toAdd = sortedGames.slice(0, minGamesFromEach)
      popularGames.push(...toAdd)
      gamesPerCategory.set(cat.games[0]?.id || 0, toAdd.length)
    })

    // fill up to target
    if (popularGames.length < targetPopularCount) {
      regularCategories.forEach(cat => {
        const currentCount = gamesPerCategory.get(cat.games[0]?.id || 0) || 0
        if (currentCount < maxGamesFromEach) {
          const sortedGames = [...cat.games].sort((a, b) => {
            const aLive = isLive(a.start_time, a.end_time)
            const bLive = isLive(b.start_time, b.end_time)
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
      const aLive = isLive(a.start_time, a.end_time)
      const bLive = isLive(b.start_time, b.end_time)
      if (aLive && !bLive) return -1
      if (!aLive && bLive) return 1
      return a.start_time - b.start_time
    })

    // add popular section on top
    if (popularGames.length > 0) {
      result.push({
        category: 'Popular',
        games: popularGames,
        icon: undefined
      })
    }

    // sort categories - football goes 2nd row
    const sortedCategories = [...regularCategories].sort((a, b) => {
      const aIsFootball = isAmericanFootball(a.category)
      const bIsFootball = isAmericanFootball(b.category)
      
      if (aIsFootball && !bIsFootball) return -1
      if (!aIsFootball && bIsFootball) return 1
      
      // live games first
      const aLiveCount = a.games.filter(g => isLive(g.start_time, g.end_time)).length
      const bLiveCount = b.games.filter(g => isLive(g.start_time, g.end_time)).length
      
      if (aLiveCount > 0 && bLiveCount === 0) return -1
      if (aLiveCount === 0 && bLiveCount > 0) return 1
      if (aLiveCount !== bLiveCount) return bLiveCount - aLiveCount
      
      return 0
    })

    // dump rest of categories
    sortedCategories.forEach(cat => {
      const sortedGames = [...cat.games].sort((a, b) => {
        const aLive = isLive(a.start_time, a.end_time)
        const bLive = isLive(b.start_time, b.end_time)
        
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        if (!aLive && !bLive) return a.start_time - b.start_time
        return 0
      })
      
      result.push({
        category: cat.category,
        games: sortedGames,
        icon: undefined
      })
    })

    // 24/7 channels at bottom
    alwaysLiveCategories.forEach(cat => {
      result.push({
        category: cat.category,
        games: cat.games,
        icon: Clock
      })
    })

    return result
  }, [finalCategories, hiddenGameIds])

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        <SportsCategorySelector loading={finalLoading} />

        <div className="matches-grid-container">
          {finalLoading ? (
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
          ) : organizedCategories.length === 0 ? (
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
