'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Trophy, Clock } from 'lucide-react'
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

// checks if its soccer (not the american hand-egg one)
const isSoccer = (category: string): boolean => {
  const soccerTerms = ['soccer', 'football']
  return soccerTerms.some(term => category.toLowerCase().includes(term.toLowerCase()))
}

// american football check - cuz football means different things depending where u live lol
const isAmericanFootball = (category: string): boolean => {
  const cat = category.toLowerCase()
  // if it says football but NOT soccer = american football (the one with the brown ball)
  // also check for nfl cuz sometimes its just called that
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: '32px' }}>📺</span>
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
    { id: 'football', name: 'Football 🔥', icon: '🏈' },
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
    { id: 'combat sports', name: 'COMBAT SPORTS', icon: '🥋' },
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
          {liveCount > 0 && <span className="live-count-tag">{liveCount} LIVE</span>}
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

export default function SportsGrid({ initialData }: { initialData?: InitialData }) {
  const [loading, setLoading] = useState(!initialData?.categories)
  const [categories, setCategories] = useState<Category[]>(initialData?.categories || [])
  const [hiddenGameIds, setHiddenGameIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    // If we have initial data from server, don't fetch again
    if (initialData?.categories) {
      setCategories(initialData.categories)
      setLoading(false)
      return
    }

    // Client-side fetch if no initial data
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (err) {
        console.error('Failed to fetch streams:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [initialData])

  const handleImageError = useCallback((id: number) => {
    setHiddenGameIds(prev => new Set(prev).add(id))
  }, [])

  // organize all the games so they look nice
  const organizedCategories = useMemo(() => {
    // remove the broken image games first (they ugly)
    const filtered = categories
      .map(cat => ({
        ...cat,
        games: cat.games.filter(g => !hiddenGameIds.has(g.id))
      }))
      .filter(cat => cat.games.length > 0)

    const result: Array<{category: string, games: Game[], icon?: React.ComponentType<{size: number, color: string}>}> = []

    // split the always-live tv channels from normal games
    const regularCategories: Category[] = []
    const alwaysLiveCategories: Category[] = []
    
    filtered.forEach(cat => {
      if (isAlwaysLive(cat.category)) {
        alwaysLiveCategories.push(cat)  // these never end lol
      } else {
        regularCategories.push(cat)
      }
    })

    // make the "Popular" section - just grab some games from everywhere so it looks full
    const popularGames: Game[] = []
    const gamesPerCategory = new Map<number, number>() // keep track so we dont steal too many from one spot
    const minGamesFromEach = 1  // at least grab one from everyone, fair is fair
    const maxGamesFromEach = 3  // dont be greedy
    const targetPopularCount = 12  // 12 games looks good on screen, trust me bro

    // First pass: get at least 1 game from each category (prioritize live)
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

    // Second pass: fill up to target with more games (up to max per category)
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

    // sort popular stuff - live games first cuz nobody wants to watch a replay in popular section lmao
    popularGames.sort((a, b) => {
      const aLive = isLive(a.start_time, a.end_time)
      const bLive = isLive(b.start_time, b.end_time)
      if (aLive && !bLive) return -1
      if (!aLive && bLive) return 1
      return a.start_time - b.start_time
    })

    // slap the popular section on top (row 1) if we got anything
    if (popularGames.length > 0) {
      result.push({
        category: '🔥 Popular',
        games: popularGames,
        icon: undefined  // no icon for popular, the fire emoji is enough
      })
    }

    // sort the categories - football gotta be 2nd row right after popular or boss gets mad
    const sortedCategories = [...regularCategories].sort((a, b) => {
      // football (the american one with touchdowns) goes 2nd always, dont mess with this
      const aIsFootball = isAmericanFootball(a.category)
      const bIsFootball = isAmericanFootball(b.category)
      
      if (aIsFootball && !bIsFootball) return -1  // a is football, it wins
      if (!aIsFootball && bIsFootball) return 1   // b is football, it wins
      
      // for everything else just put live games first cuz people wanna watch now
      const aLiveCount = a.games.filter(g => isLive(g.start_time, g.end_time)).length
      const bLiveCount = b.games.filter(g => isLive(g.start_time, g.end_time)).length
      
      if (aLiveCount > 0 && bLiveCount === 0) return -1
      if (aLiveCount === 0 && bLiveCount > 0) return 1
      if (aLiveCount !== bLiveCount) return bLiveCount - aLiveCount
      
      return 0  // whatever same same
    })

    // dump the rest of the categories here (football will be first cuz we sorted it)
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

    // 24/7 channels go at the very bottom - they aint special, just always there
    alwaysLiveCategories.forEach(cat => {
      result.push({
        category: cat.category,
        games: cat.games,
        icon: Clock  // clock icon cuz time never stops or something deep like that
      })
    })

    return result
  }, [categories, hiddenGameIds])

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        <SportsCategorySelector loading={loading} />

        <div className="matches-grid-container">
          {loading ? (
            Array(3).fill(0).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="skeleton-header skeleton-pulse" />
                <div className="carousel-track">
                  {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
                </div>
              </React.Fragment>
            ))
          ) : organizedCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No matches found.</p>
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
