'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, Clock, ChevronRight, Search, X } from 'lucide-react'
import '../../styles/live-matches.css'

const API_BASE = 'https://reedstreams-edge-v1.fly.dev/api/v1/streams'

interface FormattedMatch {
  id: string;
  title: string;
  category: string;
  sportId: string;
  date: number;
  poster: string;
  isLive: boolean;
}

const isLive = (timestamp: number, category: string = ''): boolean => {
  if (category.toLowerCase().includes('24/7')) return true;
  const now = Date.now();
  return timestamp <= now && (now - timestamp) < (3.5 * 60 * 60 * 1000);
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
        <div className="row-poster-container sk-bg" />
        <div className="row-content-wrapper">
            <div className="row-info">
                <div className="sk-text sk-w-30" style={{ height: '12px', marginBottom: '12px' }} />
                <div className="sk-text sk-w-60" style={{ height: '24px' }} />
            </div>
            <div className="row-meta-col sk-hide-mobile">
                <div className="sk-text sk-w-100" style={{ height: '35px', borderRadius: '8px' }} />
                <div className="sk-text sk-w-80" style={{ height: '15px', marginTop: '10px' }} />
            </div>
        </div>
    </div>
);

const MatchRow = React.memo(({ match }: { match: FormattedMatch }) => {
  return (
    <Link href={`/match/${match.id}`} className="match-row-link">
      <article className="match-row">
        <div className="row-poster-container">
           <div className="row-poster" style={{ backgroundImage: `url(${match.poster})` }} />
           <div className="row-overlay-icon">
               <PlayCircle size={28} color="#fff" fill="rgba(0,0,0,0.5)" />
           </div>
        </div>
        <div className="row-content-wrapper">
          <div className="row-info">
             <div className="row-category">{match.category}</div>
             <div className="row-title">{match.title}</div>
          </div>
          <div className="row-meta-col">
             <div className={`row-status-badge ${match.isLive ? 'live' : 'upcoming'}`}>
                 {match.isLive ? <><span className="live-dot" /> LIVE</> : <><Clock size={12} /> {formatTime(match.date)}</>}
             </div>
             <div className="row-action-btn">WATCH NOW <ChevronRight size={14} /></div>
          </div>
        </div>
      </article>
    </Link>
  );
});

export default function LiveMatches() {
  const searchParams = useSearchParams()
  const urlSportId = searchParams.get('sportId') || 'all'
  const [matches, setMatches] = useState<FormattedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_BASE)
        const data = await res.json()
        let validMatches: FormattedMatch[] = [];
        if (data && Array.isArray(data.categories)) {
            data.categories.forEach((catBlock: any) => {
                if (catBlock.games) {
                    catBlock.games.forEach((game: any) => {
                        const startTimeMs = game.start_time * 1000;
                        validMatches.push({
                            id: game.id.toString(),
                            title: game.name,
                            category: catBlock.category,
                            sportId: 'unknown',
                            date: startTimeMs,
                            poster: game.poster,
                            isLive: isLive(startTimeMs, catBlock.category)
                        });
                    });
                }
            });
        }
        
        if (urlSportId !== 'all') {
          validMatches = validMatches.filter(m => {
             const normCat = m.category.toLowerCase();
             const normUrl = urlSportId.toLowerCase();
             
             // Smart TV Filter
             if (normUrl === 'tv') {
                 return normCat.includes('24/7') || normCat.includes('tv');
             }
             
             // Smart Fight/MMA Filter
             if (normUrl === 'fight' || normUrl === 'mma') {
                 return normCat.includes('mma') || normCat.includes('ufc') || normCat.includes('fight') || normCat.includes('boxing') || normCat.includes('wwe');
             }

             // Strict American Football
             if (normUrl === 'american-football') {
                 return normCat.includes('nfl') || normCat.includes('american');
             }
             
             // Strict Soccer
             if (normUrl === 'football' || normUrl === 'soccer') {
                 const isSoccer = normCat.includes('football') || normCat.includes('soccer');
                 const isNotAmerican = !normCat.includes('nfl') && !normCat.includes('american');
                 return isSoccer && isNotAmerican;
             }
             
             // Fallback for others (Basketball, Hockey, etc)
             return normCat.includes(normUrl.replace('-', ''));
          });
        }
        setMatches(validMatches.sort((a, b) => a.date - b.date))
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    fetchMatches()
  }, [urlSportId])

  const groupedMatches = useMemo(() => {
    const filtered = matches.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'LIVE' ? m.isLive : filter === 'UPCOMING' ? (!m.isLive && m.date > Date.now()) : true;
      return matchesSearch && matchesFilter;
    });
    const groups: { [key: string]: FormattedMatch[] } = {};
    filtered.forEach(m => {
      const label = getDateLabel(m.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(m);
    });
    return groups;
  }, [matches, filter, searchQuery]);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Back Home</Link>
          <div className="header-title-row">
            <h1 className="page-title">{urlSportId.toUpperCase().replace('-', ' ')}</h1>
            <span className="match-count">{Object.values(groupedMatches).reduce((acc, curr) => acc + curr.length, 0)} Matches</span>
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
                        placeholder={`Search in ${urlSportId}...`}
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
            Object.keys(groupedMatches).length > 0 ? Object.entries(groupedMatches).map(([dateLabel, dateMatches]) => (
                <div key={dateLabel} className="date-group">
                  <div className="date-stamp">
                    <span className="stamp-line"></span><span className="stamp-text">{dateLabel}</span><span className="stamp-line"></span>
                  </div>
                  <div className="matches-list-container">
                    {dateMatches.map(m => <MatchRow key={m.id} match={m} />)}
                  </div>
                </div>
            )) : (
              <div className="empty-state">
                <h3>No {urlSportId.replace('-', ' ')} matches found.</h3>
                <p>Check back later or try another category.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}