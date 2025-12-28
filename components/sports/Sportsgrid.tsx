'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, AlertTriangle, X, PlayCircle } from 'lucide-react'

/* --- IMPORTS --- */
import '../../styles/Sportsgrid.css'
import { useLanguage } from "@/context/language-context"

const STREAMED_BASE_URL = 'https://streamed.pk' 
const STREAMED_API_BASE = 'https://streamed.pk/api' 

// GENERIC FALLBACK IMAGE (NFL THEMED STADIUM)
const GENERIC_NFL_BG = "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000&auto=format&fit=crop";

interface APITeam {
  name: string;
  badge: string; 
}

interface APIMatch {
    id: string;
    title: string;
    category: string;
    date: number;
    poster?: string; 
    popular: boolean;
    teams?: {
        home?: APITeam;
        away?: APITeam;
    };
    sources: {
        source: string;
        id: string;
    }[];
}

const SPORT_PRIORITY = [
  'basketball', 'football', 'americanfootball', 'hockey', 'baseball', 
  'motorsport', 'mma', 'boxing', 'tennis', 'rugby', 'golf', 'darts', 'cricket'
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

function getMatchBackground(match: APIMatch) {
  if (match.poster) {
    return `${STREAMED_BASE_URL}${match.poster}.webp`;
  }
  return null;
}

function normalizeSportKey(sportName: string) {
  if (!sportName) return ''
  let key = sportName.toLowerCase().replace(/[\s-]/g, '').replace(/[()]/g, '')
  if (key.includes('fight') || key.includes('ufc') || key.includes('mma')) return 'mma'
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
  if (badgeId.startsWith('http')) return badgeId;
  return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`
}

function isCurrentlyActive(timestamp: number): boolean {
  return timestamp <= Date.now()
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function sortSportsList(data: any[]) {
  return [...data].sort((a, b) => {
    const keyA = normalizeSportKey(a.name);
    const keyB = normalizeSportKey(b.name);
    const indexA = SPORT_PRIORITY.indexOf(keyA);
    const indexB = SPORT_PRIORITY.indexOf(keyB);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

function getGradientClass(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 15;
    return `gradient-${index}`;
}

// --- FEATURED BANNER COMPONENT ---
function FeaturedBanner({ matches }: { matches: APIMatch[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useLanguage()

  // Rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % matches.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [matches.length])

  if (!matches || matches.length === 0) return null

  const match = matches[currentIndex]
  const bgImage = getMatchBackground(match)
  const home = match.teams?.home
  const away = match.teams?.away
  const hasLogos = home?.badge && away?.badge
  const matchTitle = (home && away) ? `${home.name} vs ${away.name}` : match.title
  
  // LOGIC: Banner -> Logos (Gradient) -> Generic NFL Image
  let cardStyle: React.CSSProperties = {}
  let cardClass = "featured-hero"

  if (bgImage) {
      // 1. Has specific banner
      cardStyle = { backgroundImage: `url(${bgImage})` }
  } else if (hasLogos) {
      // 2. Has Logos -> Show Gradient
      cardStyle = { backgroundColor: 'rgba(2,3,5,0.8)' }
      const gradientClass = getGradientClass(match.id)
      cardClass += ` has-logos ${gradientClass}`
  } else {
      // 3. Last Resort -> Generic NFL Image
      cardStyle = { backgroundImage: `url(${GENERIC_NFL_BG})` }
      cardClass += " is-generic"
  }

  return (
    <div className="featured-section">
      {/* WRAPPER LINK: 
         1. Href points to match page
         2. onClick saves match data to session storage (same as regular cards)
         3. Styles ensure it fills the space
      */}
      <Link 
        href={`/match/${match.id}`} 
        onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
        style={{ display: 'block', width: '100%', textDecoration: 'none' }}
      >
          <div className={cardClass} style={cardStyle}>
            
            {/* Only show center logos if we are in state 2 (No Banner, But Has Logos) */}
            {!bgImage && hasLogos ? (
                 <div className="featured-logos">
                    <img src={getBadgeUrl(home?.badge)} alt="Home" className="card-team-logo" />
                    <span className="card-vs-text">VS</span>
                    <img src={getBadgeUrl(away?.badge)} alt="Away" className="card-team-logo" />
                 </div>
            ) : null}

            <div className="featured-overlay">
              <div className="featured-info">
                <span className="featured-label">Featured Match</span>
                <h1 className="featured-title">{matchTitle}</h1>
                <div className="featured-meta">
                  <span style={{color: '#8db902'}}>{match.category}</span>
                  <span>•</span>
                  <span>{isCurrentlyActive(match.date) ? t.live : formatTime(match.date)}</span>
                </div>
              </div>
              
              {/* Changed from Link to Div to avoid nested <a> tags */}
              <div className="featured-btn">
                 <PlayCircle size={20} /> Watch Now
              </div>
            </div>
            
            <div className="featured-indicators">
              {matches.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                      // IMPORTANT: Stop propagation so clicking a dot doesn't navigate to the page
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                  }}
                />
              ))}
            </div>
          </div>
      </Link>
    </div>
  )
}

function MatchesRow({ title, matches }: { title: string, matches: APIMatch[] }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  if (!matches || matches.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 260 
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
        </div>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => scroll('left')}><ChevronLeft width={20} /></button>
          <button className="nav-btn" onClick={() => scroll('right')}><ChevronRight width={20} /></button>
        </div>
      </div>
      
      <div className="carousel-wrapper">
        <div className="sports-carousel-container" ref={rowRef}>
          {matches.map((match) => {
            const live = isCurrentlyActive(match.date)
            const home = match.teams?.home
            const away = match.teams?.away
            const bgImage = getMatchBackground(match);
            const hasLogos = home?.badge && away?.badge;
            
            const matchTitle = (home && away) ? `${home.name} vs ${away.name}` : match.title;

            let cardStyle: React.CSSProperties = {};
            let cardClass = "match-card-visual";

            if (bgImage) {
                cardStyle = { backgroundImage: `url(${bgImage})` };
            } else if (hasLogos) {
                cardStyle = { backgroundColor: '#020305' }; 
                const gradientClass = getGradientClass(match.id);
                cardClass += ` has-logos ${gradientClass}`;
            } else {
                cardStyle = { backgroundColor: '#0a0a0a' }; 
                cardClass += " is-fallback";
            }

            return (
              <Link 
                key={match.id} 
                href={`/match/${match.id}`} 
                className="match-card-link"
                onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
              >
                <div className={cardClass} style={cardStyle}>
                  <div className="match-card-overlay"></div>
                  
                  {live && <span className="card-live-badge">{t.live}</span>}

                  {!bgImage && hasLogos ? (
                    <div className="match-logos-container">
                      <img src={getBadgeUrl(home?.badge)} alt="Home" className="card-team-logo" loading="lazy" />
                      <span className="card-vs-text">VS</span>
                      <img src={getBadgeUrl(away?.badge)} alt="Away" className="card-team-logo" loading="lazy" />
                    </div>
                  ) : !bgImage && !hasLogos ? (
                    <div className="fallback-content">
                       <span className="reed-logo-text">REED<span className="reed-highlight">STREAMS</span></span>
                       <div className="reed-underline"></div>
                       <span className="fallback-category">{match.category}</span>
                    </div>
                  ) : null}
                </div>

                <div className="match-card-info">
                  <span className="match-card-title">{matchTitle}</span>
                  <div className="match-card-sub">
                     <span className="match-league-name">{match.category}</span>
                     <span className="sub-sep">•</span>
                     <span>{live ? t.live : formatTime(match.date)}</span>
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
        if (!sportsRes.ok) throw new Error('Sports API Error')
        let sportsData = await sportsRes.json()
        sportsData = sortSportsList(sportsData);

        const matchesRes = await fetch(`${STREAMED_API_BASE}/matches/all-today`)
        if (!matchesRes.ok) throw new Error('Matches API Error')
        const matchesData: APIMatch[] = await matchesRes.json()
        
        const validMatches = matchesData.filter(m => m.sources && m.sources.length > 0)
        setAllMatches(validMatches)

        const sportsWithCounts = sportsData.map((sport: any) => {
           const sportMatches = validMatches.filter(m => normalizeSportKey(m.category) === normalizeSportKey(sport.name))
           const activeCount = sportMatches.filter(m => isCurrentlyActive(m.date)).length
           return { ...sport, matchCount: activeCount }
        })

        setSports(sportsWithCounts)
        setApiError(false)

      } catch (error) {
        console.error("API Fetch Error:", error);
        setApiError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 300
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // --- LOGIC FOR FILTERING MATCHES ---
  const nflMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'americanfootball')
  const basketballMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'basketball')
  const soccerMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'football')
  const hockeyMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'hockey')
  const cricketMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'cricket')
  const mmaMatches = allMatches.filter(m => normalizeSportKey(m.category) === 'mma' || normalizeSportKey(m.category) === 'boxing')

  // --- FEATURED MATCHES LOGIC (NFL Priority) ---
  // 1. Get all NFL matches
  // 2. Get everything else
  // 3. Combine and slice top 6
  const featuredMatches = [
    ...allMatches.filter(m => normalizeSportKey(m.category) === 'americanfootball'),
    ...allMatches.filter(m => normalizeSportKey(m.category) !== 'americanfootball')
  ].slice(0, 6);

  if (loading) {
    return (
      <div style={{minHeight: '100vh'}}>
         {/* 1. Banner Skeleton */}
        <div className="skeleton-banner skeleton-shimmer"></div>

         {/* 2. Sports Skeleton */}
        <section className="sports-section">
            <div className="section-header">
                <div className="skeleton-title-bar skeleton-shimmer"></div>
            </div>
            <div className="sports-carousel-container" style={{ overflow: 'hidden', paddingBottom: '20px' }}>
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card skeleton-sport"></div>)}
            </div>
        </section>
        
        {/* 3. Match Rows Skeletons (3 Rows to fill page) */}
        {[...Array(3)].map((_, rowIdx) => (
            <section key={rowIdx} className="matches-row-section" style={{marginTop: '30px'}}>
                <div className="section-header">
                    <div className="skeleton-title-bar skeleton-shimmer"></div>
                </div>
                <div className="sports-carousel-container" style={{ overflow: 'hidden' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card skeleton-match"></div>)}
                </div>
            </section>
        ))}
      </div>
    )
  }

  return (
    <>
    {/* Featured Banner (Above Sports) */}
    {featuredMatches.length > 0 && <FeaturedBanner matches={featuredMatches} />}

    <section className="sports-section">
      <div className="section-header">
        <div className="title-group">
          <h2 className="section-title">{t.sports_heading}</h2>
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

    {/* Top 10 Matches (Any Sport) */}
    <MatchesRow title={t.top_matches} matches={allMatches.slice(0, 10)} />
    
    {/* Explicit Order */}
    {nflMatches.length > 0 && <MatchesRow title={t.nfl} matches={nflMatches} />}
    {basketballMatches.length > 0 && <MatchesRow title={t.basketball} matches={basketballMatches} />}
    {soccerMatches.length > 0 && <MatchesRow title={t.soccer} matches={soccerMatches} />}
    {hockeyMatches.length > 0 && <MatchesRow title={t.hockey} matches={hockeyMatches} />}

    {/* Remaining Categories */}
    {mmaMatches.length > 0 && <MatchesRow title="MMA & Boxing" matches={mmaMatches} />}
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