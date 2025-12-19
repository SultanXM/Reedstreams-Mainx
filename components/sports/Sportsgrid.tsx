'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react'

/* --- IMPORTS --- */
import '../../styles/Sportsgrid.css'

// 🔥 IMPORT LANGUAGE HOOK
import { useLanguage } from "@/context/language-context"

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

// --- TYPES ---
interface Team { name: string; badge: string; }
interface APIMatch {
    id: string; title: string; category: string; date: number;
    teams?: { home?: Team; away?: Team; }; sources: any[];
}

// --- CONSTANTS ---
// 🔥 FIXED: MMA and Boxing are now placed BEFORE Tennis
const SPORT_PRIORITY = [
  'basketball', 'football', 'americanfootball', 'hockey', 'baseball', 
  'motorsport', 'mma', 'boxing', 'tennis', 'rugby', 'golf', 'darts', 'cricket'
];

const FALLBACK_SPORTS = [
  { id: 'basketball', name: 'basketball' },
  { id: 'football', name: 'football' },
  { id: 'american-football', name: 'americanfootball' },
  { id: 'hockey', name: 'hockey' },
  { id: 'baseball', name: 'baseball' },
  { id: 'mma', name: 'MMA' },
  { id: 'boxing', name: 'Boxing' },
  { id: 'motorsport', name: 'motorsport' },
  { id: 'tennis', name: 'tennis' },
  { id: 'rugby', name: 'rugby' },
  { id: 'golf', name: 'golf' },
  { id: 'darts', name: 'darts' },
  { id: 'cricket', name: 'cricket' }
];

const sportIcons: Record<string, string> = {
  football: '⚽', americanfootball: '🏈', basketball: '🏀', baseball: '⚾',
  hockey: '🏒', mma: '🥊', boxing: '🥊', tennis: '🎾',  cricket: '🏏',
  rugby: '🏉', motorsport: '🏁', motorsports: '🏎️', volleyball: '🏐',
  golf: '⛳', darts: '🎯',
}

const sportNames: Record<string, string> = {
  football: 'Soccer', americanfootball: 'NFL', basketball: 'Basketball',
  baseball: 'Baseball', hockey: 'Ice Hockey', tennis: 'Tennis',
  mma: 'MMA / UFC', boxing: 'Boxing', cricket: 'Cricket', rugby: 'Rugby',
  motorsport: 'Motor Sports', racing: 'Auto Racing', volleyball: 'Volleyball',
  golf: 'Golf', darts: 'Darts',
}

// --- HELPERS ---
function normalizeSportKey(sportName: string) {
  if (!sportName) return ''
  let key = sportName.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')
  
  // 🔥 THE "DOCTOR STRANGE" FIX: Map variations to standard keys
  if (key.includes('fight') || key.includes('ufc') || key.includes('mma') || key.includes('mixedmartial')) return 'mma'
  if (key.includes('box')) return 'boxing'
  if (key.includes('soccer')) return 'football'
  
  return key
}

function getSportIcon(sportName: string) {
  const normalizedKey = normalizeSportKey(sportName)
  return sportIcons[normalizedKey] || undefined
}

function getDisplaySportName(sport: string) {
  const normalizedKey = normalizeSportKey(sport)
  return sportNames[normalizedKey] || sport.charAt(0).toUpperCase() + sport.slice(1)
}

function getBadgeUrl(badgeId: string | undefined): string {
  if (!badgeId) return '/placeholder-badge.webp' 
  return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`
}

function isMatchToday(timestamp: number): boolean {
    const now = new Date();
    const todayUTC = now.toISOString().slice(0, 10);
    const matchDayUTC = new Date(timestamp).toISOString().slice(0, 10);
    return todayUTC === matchDayUTC;
}

function isCurrentlyActive(timestamp: number): boolean {
  return timestamp <= Date.now()
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function getRandomShade(index: number) {
  const seed = (index % 12) + 1; 
  return `card-shade-${seed}`;
}

// 🔥 RE-WRITTEN SORTING: Uses normalized keys to match the priority list
function sortSportsList(data: any[]) {
  return [...data].sort((a, b) => {
    const keyA = normalizeSportKey(a.name);
    const keyB = normalizeSportKey(b.name);
    
    const indexA = SPORT_PRIORITY.indexOf(keyA);
    const indexB = SPORT_PRIORITY.indexOf(keyB);

    // If both are in priority list, sort by index
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // Put priority items first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // Default to alphabetical
    return a.name.localeCompare(b.name);
  });
}

// --- SUB-COMPONENT: Match Row ---
function MatchesRow({ title, matches }: { title: string, matches: APIMatch[] }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  if (!matches || matches.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 300
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="matches-row-section">
      <div className="section-header">
        <div className="title-group">
          <h2 className="section-title">{title}</h2>
          <div className="title-accent"></div>
        </div>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => scroll('left')}><ChevronLeft width={20} /></button>
          <button className="nav-btn" onClick={() => scroll('right')}><ChevronRight width={20} /></button>
        </div>
      </div>
      <div className="carousel-wrapper">
        <div className="sports-carousel-container" ref={rowRef}>
          {matches.map((match, index) => {
            const live = isCurrentlyActive(match.date)
            const home = match.teams?.home
            const away = match.teams?.away
            const shade = getRandomShade(index)
            
            return (
              <Link 
                key={match.id} 
                href={`/match/${match.id}`} 
                className="match-card-link"
                onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
              >
                <div className={`match-card ${shade}`}>
                  <div className="match-teams">
                    <div className="team-info">
                       <img src={getBadgeUrl(home?.badge)} alt={home?.name} className="team-logo" />
                       <span className="team-name line-clamp-1">{home?.name || 'Home'}</span>
                    </div>
                    <span className="vs-badge">VS</span>
                    <div className="team-info">
                       <img src={getBadgeUrl(away?.badge)} alt={away?.name} className="team-logo" />
                       <span className="team-name line-clamp-1">{away?.name || 'Away'}</span>
                    </div>
                  </div>
                  <div className="match-meta">
                    <span className="league-name">{match.category || 'Match'}</span>
                    <span className={`time-badge ${live ? 'live-badge-sm' : ''}`}>
                       {live ? t.live : formatTime(match.date)}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// --- MAIN COMPONENT ---
export default function SportsGrid() {
  const [sports, setSports] = useState<any[]>([])
  const [allMatches, setAllMatches] = useState<APIMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { t } = useLanguage()

  useEffect(() => {
    async function fetchData() {
      try {
        const sportsRes = await fetch(`${STREAMED_API_BASE}/sports`)
        if (!sportsRes.ok) throw new Error('API Error')
        let sportsData = await sportsRes.json()
        
        // 🔥 SORT THE LIST BEFORE SETTING STATE
        sportsData = sortSportsList(sportsData);

        const matchesRes = await fetch(`${STREAMED_API_BASE}/matches/all-today`)
        const matchesData: APIMatch[] = await matchesRes.json()
        
        const validMatches = matchesData.filter(m => 
             isMatchToday(m.date) && m.sources && m.sources.length > 0
        )
        setAllMatches(validMatches)

        const sportsWithCounts = sportsData.map((sport: any) => {
           const sportMatches = validMatches.filter(m => {
             return normalizeSportKey(m.category) === normalizeSportKey(sport.name)
           })
           const activeCount = sportMatches.filter(m => isCurrentlyActive(m.date)).length
           return { ...sport, matchCount: activeCount }
        })
        setSports(sportsWithCounts)
        setApiError(false)

      } catch (error) {
        setApiError(true)
        const sortedFallback = sortSportsList([...FALLBACK_SPORTS]);
        const fallbackWithCounts = sortedFallback.map(sport => ({ ...sport, matchCount: 0 }))
        setSports(fallbackWithCounts)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 350
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Filter groups for row displays
  const nflMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'americanfootball')
  const basketballMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'basketball')
  const soccerMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'football')
  const hockeyMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'hockey')
  const cricketMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'cricket')
  const mmaMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'mma' || normalizeSportKey(m.category) === 'boxing')

  if (loading) {
    return (
      <section className="sports-section">
        <div className="section-header">
          <div className="title-group"><div className="skeleton-title-bar skeleton-shimmer"></div><div className="title-accent"></div></div>
          <div className="nav-controls"><div className="skeleton-nav-btn skeleton-shimmer"></div></div>
        </div>
        <div className="sports-carousel-container" style={{ overflow: 'hidden' }}>
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
        </div>
      </section>
    )
  }

  return (
    <>
    {/* 1. CATEGORIES CAROUSEL */}
    <section className="sports-section">
      <div className="section-header">
        <div className="title-group">
          <h2 className="section-title">{t.sports_heading}</h2>
          <div className="title-accent"></div>
        </div>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => scroll('left')}><ChevronLeft width={20} /></button>
          <button className="nav-btn" onClick={() => scroll('right')}><ChevronRight width={20} /></button>
        </div>
      </div>
      <div className="carousel-wrapper">
        <div className="sports-carousel-container" ref={containerRef}>
          {sports.map((sport: any) => {
            const icon = getSportIcon(sport.name)
            const displayName = getDisplaySportName(sport.name)
            const isLive = sport.matchCount > 0
            if (!icon) return null
            return (
              <Link 
                key={sport.id}
                href={`/live-matches?sportId=${sport.id}&sportName=${encodeURIComponent(sport.name)}`}
                className="sport-card-link"
              >
                <div className={`sport-card ${isLive ? 'active-live' : ''}`}>
                  <div className="card-icon-wrapper">
                      <span className="sport-emoji">{icon}</span>
                  </div>
                  <div className="card-content">
                      <h3 className="sport-title">{displayName}</h3>
                      <div className={`match-badge ${isLive ? 'live' : 'offline'}`}>
                          {isLive && <span className="live-dot"></span>}
                          {sport.matchCount} {isLive ? t.live : ''}
                      </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>

    {/* 2. MATCH ROWS */}
    <MatchesRow title={t.top_matches} matches={allMatches.slice(0, 10)} />
    {mmaMatches.length > 0 && <MatchesRow title="MMA & Boxing" matches={mmaMatches} />}
    {nflMatches.length > 0 && <MatchesRow title={t.nfl} matches={nflMatches} />}
    {basketballMatches.length > 0 && <MatchesRow title={t.basketball} matches={basketballMatches} />}
    {soccerMatches.length > 0 && <MatchesRow title={t.soccer} matches={soccerMatches} />}
    {hockeyMatches.length > 0 && <MatchesRow title={t.hockey} matches={hockeyMatches} />}
    {cricketMatches.length > 0 && <MatchesRow title={t.cricket} matches={cricketMatches} />}

    {apiError && (
      <div className="api-error-toast">
        <div className="error-header">
          <span className="error-title"><AlertTriangle size={14} /> {t.server_error}</span>
          <button className="error-close" onClick={() => setApiError(false)}><X size={14} /></button>
        </div>
      </div>
    )}
    </>
  )
}