'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, Clock, ChevronRight, Search, X, Calendar, ChevronDown } from 'lucide-react'
import '../../styles/live-matches.css'

const API_BASE = 'https://streamed.pk'

interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  popular?: boolean;
  poster?: string;
  teams?: { 
    home?: { badge: string; name: string }; 
    away?: { badge: string; name: string } 
  };
  sources?: any[];
}

const getBadgeUrl = (badgeId: string): string => `${API_BASE}/api/images/badge/${badgeId}.webp`;

const getPosterUrl = (posterRaw: string): string => {
  if (!posterRaw) return '';
  if (posterRaw.startsWith('/')) return `${API_BASE}${posterRaw}.webp`;
  return `${API_BASE}/api/images/proxy/${posterRaw}.webp`;
}

const isLive = (timestamp: number): boolean => {
  const now = Date.now();
  const matchTime = new Date(timestamp).getTime();
  return matchTime <= now && (now - matchTime) < (3 * 60 * 60 * 1000);
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
};

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
);

const MatchRow = React.memo(({ match, onImageError }: { match: Match; onImageError: (id: string) => void }) => {
  const [imageError, setImageError] = useState(false);
  const matchIsLive = isLive(match.date);
  const homeName = match.teams?.home?.name || 'Home';
  const awayName = match.teams?.away?.name || 'Away';
  const homeBadgeUrl = match.teams?.home?.badge ? getBadgeUrl(match.teams.home.badge) : null;
  const awayBadgeUrl = match.teams?.away?.badge ? getBadgeUrl(match.teams.away.badge) : null;

  // Prioritize poster if available, but fallback to logos if poster fails
  const showPoster = !!match.poster && !imageError;

  return (
    <Link href={`/match/${match.id}`} className="match-row-link" onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}>
      <article className="match-row">
        <div className="row-poster-container" style={{ width: '100px', flex: '0 0 100px', overflow: 'hidden' }}>
           {showPoster ? (
             <img 
                src={getPosterUrl(match.poster!)}
                alt={match.title}
                referrerPolicy="no-referrer"
                onError={() => {
                    // If poster fails, try fallback to logos. If logos aren't available, hide match.
                    if (homeBadgeUrl && awayBadgeUrl) setImageError(true);
                    else onImageError(match.id);
                }}
                className="row-poster" 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                }} 
             />
           ) : (
             <div className="row-logos-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '100%', padding: '5px' }}>
                {homeBadgeUrl && <img 
                  src={homeBadgeUrl} 
                  alt={homeName} 
                  referrerPolicy="no-referrer" 
                  onError={() => onImageError(match.id)}
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
                />}
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#444' }}>VS</span>
                {awayBadgeUrl && <img 
                  src={awayBadgeUrl} 
                  alt={awayName} 
                  referrerPolicy="no-referrer" 
                  onError={() => onImageError(match.id)}
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
                />}
             </div>
           )}
        </div>
        <div className="row-content-wrapper">
          <div className="row-info">
             <div className="row-category">{match.category}</div>
             <div className="row-title">{showPoster ? match.title : `${homeName} vs ${awayName}`}</div>
          </div>
          <div className="row-meta-col">
             <div className={`row-status-badge ${matchIsLive ? 'live' : 'upcoming'}`}>
                 {matchIsLive ? <><span className="live-dot" /> LIVE</> : <><Clock size={12} /> {formatTime(match.date)}</>}
             </div>
             <div className="row-action-btn">WATCH <ChevronRight size={14} /></div>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default function LiveMatches() {
  const searchParams = useSearchParams()
  const urlSportId = searchParams.get('sportId') || 'all'
  
  const DISPLAY_NAMES: Record<string, string> = {
    'american-football': 'NFL Football',
    'football': 'Soccer',
    'basketball': 'NBA Basketball',
    'hockey': 'NHL Hockey',
    'baseball': 'MLB Baseball',
    'fight': 'MMA / UFC',
    'motorsport': 'Racing',
    'popular': 'Popular Today'
  };

  const urlSportName = useMemo(() => {
    const paramName = searchParams.get('sportName');
    if (paramName) return decodeURIComponent(paramName);
    if (DISPLAY_NAMES[urlSportId]) return DISPLAY_NAMES[urlSportId];
    return urlSportId.replace('-', ' ').toUpperCase();
  }, [urlSportId, searchParams]);

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL')
  const [visibleCount, setVisibleCount] = useState(20)
  const [hiddenMatchIds, setHiddenMatchIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/matches/all-today`)
        const data: Match[] = await res.json()
        
        // Syncing logic with Sportsgrid:
        // 1. Must have sources
        // 2. Must have either (Home Badge AND Away Badge) OR (Poster)
        let validMatches = data.filter(m => {
          const hasSources = (m.sources || []).length > 0;
          if (!hasSources) return false;

          const hasHomeImg = !!m.teams?.home?.badge;
          const hasAwayImg = !!m.teams?.away?.badge;
          const hasPoster = !!m.poster;

          return (hasHomeImg && hasAwayImg) || hasPoster;
        });

        if (urlSportId !== 'all') {
          validMatches = validMatches.filter(m => {
            const cat = m.category.toLowerCase().replace(/\s+/g, '');
            const title = m.title.toLowerCase();
            const normUrl = urlSportId.toLowerCase();

            if (normUrl === 'fight' || normUrl === 'mma') {
              return cat.includes('mma') || cat.includes('ufc') || cat.includes('fight') || cat.includes('boxing') || title.includes('ufc');
            }
            if (normUrl === 'american-football') return cat.includes('nfl') || cat.includes('american') || cat.includes('ncaa');
            if (normUrl === 'football' || normUrl === 'soccer') {
              return (cat.includes('soccer') || cat.includes('football')) && !cat.includes('nfl') && !cat.includes('american');
            }
            return cat.includes(normUrl.replace('-', ''));
          });
        }
        setMatches(validMatches.sort((a, b) => a.date - b.date))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchMatches()
  }, [urlSportId])

  const handleImageError = (matchId: string) => {
    setHiddenMatchIds(prev => new Set(prev).add(matchId));
  };

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [filter, searchQuery, urlSportId]);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      // Filter out matches that have image errors
      if (hiddenMatchIds.has(m.id)) return false;

      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'LIVE' ? isLive(m.date) : filter === 'UPCOMING' ? (!isLive(m.date) && m.date > Date.now()) : true;
      return matchesSearch && matchesFilter;
    });
  }, [matches, filter, searchQuery, hiddenMatchIds]);

  const groupedMatches = useMemo(() => {
    // Slice the filtered list for pagination
    const sliced = filteredMatches.slice(0, visibleCount);
    const groups: { [key: string]: Match[] } = {};
    
    sliced.forEach(m => {
      const label = getDateLabel(m.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(m);
    });
    return groups;
  }, [filteredMatches, visibleCount]);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
          <div className="header-title-row">
            <h1 className="page-title">{urlSportName}</h1>
            <span className="match-count">{Object.values(groupedMatches).flat().length} Matches</span>
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
          ) : (
            Object.keys(groupedMatches).length > 0 ? (
              <>
                {Object.entries(groupedMatches).map(([dateLabel, dateMatches]) => (
                  <div key={dateLabel} className="date-group">
                    <div className="date-stamp">
                      <span className="stamp-line"></span><span className="stamp-text">{dateLabel}</span><span className="stamp-line"></span>
                    </div>
                    <div className="matches-list-container">
                      {dateMatches.map(m => {
                          return <MatchRow key={m.id} match={m} onImageError={handleImageError} />
                      })}
                    </div>
                  </div>
                ))}
                {filteredMatches.length > visibleCount && (
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
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}