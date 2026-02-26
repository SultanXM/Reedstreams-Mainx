'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ChevronRight, Search, X, Calendar, ChevronDown, RefreshCw } from 'lucide-react'
import '../../styles/live-matches.css'

const API_URL = '/api/reedstreams/games'

interface Game {
  id: number
  name: string
  poster: string
  start_time: number
  end_time: number
  video_link: string
  category: string
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

const MatchRow = React.memo(({ game, onImageError, currentTime }: { game: Game; onImageError: (id: number) => void; currentTime: number }) => {
  const [imageError, setImageError] = useState(false)
  const live = isLive(game.start_time, game.end_time, currentTime)

  return (
    <Link href={`/match/${game.id}`} className="match-row-link">
      <article className="match-row">
        <div className="row-poster-container" style={{ width: '100px', flex: '0 0 100px', overflow: 'hidden' }}>
          {!imageError && game.poster ? (
            <img 
              src={game.poster}
              alt={game.name}
              referrerPolicy="no-referrer"
              onError={() => {
                setImageError(true)
                onImageError(game.id)
              }}
              className="row-poster" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#1a1a1a' }}>
              <span style={{ fontSize: '24px' }}>📺</span>
            </div>
          )}
        </div>
        <div className="row-content-wrapper">
          <div className="row-info">
            <div className="row-category">{game.category}</div>
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
    </Link>
  )
})

export default function LiveMatches() {
  const searchParams = useSearchParams()
  const urlSportId = searchParams.get('sportId') || 'all'
  
  const DISPLAY_NAMES: Record<string, string> = {
    'football': 'Football',
    'soccer': 'Soccer',
    'basketball': 'Basketball',
    'hockey': 'Ice Hockey',
    'baseball': 'Baseball',
    'mma': 'MMA / UFC',
    'tennis': 'Tennis',
    'golf': 'Golf',
    'all': 'All Sports'
  }

  const urlSportName = DISPLAY_NAMES[urlSportId] || urlSportId.replace('-', ' ').toUpperCase()

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL')
  const [visibleCount, setVisibleCount] = useState(20)
  const [hiddenGameIds, setHiddenGameIds] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [now, setNow] = useState(Date.now())

  // update "now" every minute so live badges work
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
      const res = await fetch(API_URL)
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      
      const data = await res.json()
      
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error('Invalid API response format')
      }
      
      // flatten all games from all categories
      let allGames: Game[] = []
      data.categories.forEach((cat: any) => {
        if (cat.games && Array.isArray(cat.games)) {
          cat.games.forEach((g: any) => {
            allGames.push({
              id: g.id,
              name: g.name,
              poster: g.poster,
              start_time: g.start_time,
              end_time: g.end_time,
              video_link: g.video_link,
              category: cat.category
            })
          })
        }
      })
      
      // dedupe by id
      const seen = new Set<number>()
      allGames = allGames.filter(g => {
        if (seen.has(g.id)) return false
        seen.add(g.id)
        return true
      })
      
      // sort: live first, then upcoming, then past
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
      console.error('[LiveMatches] Fetch error:', err)
      setError(err.message || 'Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setVisibleCount(20)
  }, [filter, searchQuery, urlSportId])

  const handleImageError = (id: number) => {
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

      const catLower = g.category.toLowerCase()
      const nameLower = g.name.toLowerCase()
      
      let matchesSport = urlSportId === 'all'
      
      if (!matchesSport) {
        switch(urlSportId) {
          case 'football':
            // nfl stuff, not soccer
            matchesSport = (nameLower.includes('nfl') || nameLower.includes('american football')) && 
                          !catLower.includes('football')
            break
          case 'soccer':
            // actual football (the one with the round ball)
            matchesSport = catLower === 'football' || 
                          catLower.includes('soccer') || 
                          catLower.includes('premier league') || 
                          catLower.includes('la liga') || 
                          catLower.includes('bundesliga') ||
                          catLower.includes('serie a') || 
                          catLower.includes('ligue 1') ||
                          catLower.includes('champions league') ||
                          catLower.includes('uel') ||
                          catLower.includes('uecl') ||
                          catLower.includes('world cup') ||
                          catLower.includes('fa cup')
            break
          case 'basketball':
            matchesSport = catLower.includes('basketball')
            break
          case 'hockey':
            matchesSport = catLower.includes('hockey')
            break
          case 'baseball':
            matchesSport = catLower.includes('baseball')
            break
          case 'mma':
            matchesSport = catLower.includes('mma') || 
                          catLower.includes('ufc') || 
                          catLower.includes('boxing') ||
                          catLower.includes('fight') ||
                          catLower.includes('wrestling')
            break
          case 'tennis':
            matchesSport = catLower.includes('tennis')
            break
          case 'golf':
            matchesSport = catLower.includes('golf')
            break
          default:
            matchesSport = catLower.includes(urlSportId.toLowerCase()) ||
                          nameLower.includes(urlSportId.toLowerCase())
        }
      }

      return matchesSearch && matchesFilter && matchesSport
    })
  }, [games, filter, searchQuery, urlSportId, hiddenGameIds, now])

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
                        <MatchRow key={g.id} game={g} onImageError={handleImageError} currentTime={now} />
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
