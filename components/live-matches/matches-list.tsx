'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Flame } from 'lucide-react'
import '../../styles/live-matches.css'

const API_BASE = 'https://reedstreams-edge-v1.fly.dev/api/v1/streams'

// --- TYPES ---
interface StreamGame {
  id: number;
  name: string;
  poster: string;
  start_time: number;
  end_time: number;
  cache_time: number;
  video_link: string;
  category: string;
}

interface StreamCategory {
  category: string;
  games: StreamGame[];
}

interface ApiResponse {
  categories: StreamCategory[];
}

interface FormattedMatch {
  id: string;
  title: string;
  category: string;
  sportId: string;
  date: number;
  poster: string;
  isLive: boolean;
}

// --- HELPERS ---
const normalizeSport = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  if (cat.includes('basketball') || cat.includes('nba')) return 'basketball';
  if (cat.includes('american') || cat.includes('nfl')) return 'american-football';
  if (cat === 'football' || cat.includes('soccer') || cat.includes('laliga') || cat.includes('premier') || cat.includes('bundesliga') || cat.includes('seriea')) return 'football';
  if (cat.includes('icehockey') || cat.includes('hockey') || cat.includes('nhl')) return 'hockey';
  if (cat.includes('baseball') || cat.includes('mlb')) return 'baseball';
  if (cat.includes('mma') || cat.includes('ufc') || cat.includes('fight') || cat.includes('boxing') || cat.includes('wrestling')) return 'fight';
  if (cat.includes('motor') || cat.includes('racing') || cat.includes('f1') || cat.includes('nascar')) return 'motorsport';
  if (cat.includes('tennis') || cat.includes('atp') || cat.includes('wta')) return 'tennis';
  if (cat.includes('cricket')) return 'cricket';
  if (cat.includes('golf') || cat.includes('pga')) return 'golf';
  if (cat.includes('24/7') || cat.includes('tv')) return 'tv';
  return 'other'; 
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

// --- COMPONENT: MatchCard ---
// Replicates the SportsGrid structure exactly for visual consistency
const MatchCard: React.FC<{ match: FormattedMatch }> = ({ match }) => {
  return (
    <Link 
      href={`/match/${match.id}`} 
      className="match-link"
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
      style={{ textDecoration: 'none' }}
    >
      <article className="match-card">
        {/* Visual Header (Poster) */}
        <div className="match-visual" style={{ 
          backgroundImage: `url(${match.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
           <div className="overlay-gradient" />
           
           <div className="badge-container">
            <span className={`status-badge ${match.isLive ? 'live' : 'upcoming'}`}>
              {match.isLive ? 'LIVE' : formatTime(match.date)}
            </span>
            {match.sportId === 'fight' && (
              <div className="badge-popular">
                <Flame size={12} color="#8db902" fill="#8db902" />
              </div>
            )}
           </div>
        </div>

        {/* Info Body */}
        <div className="match-info">
           <div className="match-main-title">
             <div className="team-line">
                {match.title}
             </div>
           </div>
           
           <div className="match-sub-meta">
            {match.category}
           </div>
        </div>
      </article>
    </Link> 
  );
};

export default function LiveMatches() {
  const searchParams = useSearchParams()
  const urlSportId = searchParams.get('sportId') || 'all'
  const urlSportName = decodeURIComponent(searchParams.get('sportName') || 'All Matches')

  const [matches, setMatches] = useState<FormattedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL')

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const res = await fetch(API_BASE)
        const data: ApiResponse = await res.json()
        
        let validMatches: FormattedMatch[] = [];

        if (data && Array.isArray(data.categories)) {
            data.categories.forEach(catBlock => {
                if (catBlock.games) {
                    catBlock.games.forEach(game => {
                        const startTimeMs = game.start_time * 1000;
                        validMatches.push({
                            id: game.id.toString(),
                            title: game.name,
                            category: catBlock.category,
                            sportId: normalizeSport(catBlock.category),
                            date: startTimeMs,
                            poster: game.poster,
                            isLive: isLive(startTimeMs, catBlock.category)
                        });
                    });
                }
            });
        }

        // Filter by Sport ID (Category)
        if (urlSportId !== 'all') {
          validMatches = validMatches.filter(m => {
             const normalizedCat = normalizeSport(m.category);
             
             if (urlSportId === 'popular') {
                 const isPriority = m.category.toLowerCase().includes('ufc') || 
                                    m.category.toLowerCase().includes('wwe') ||
                                    m.category.toLowerCase().includes('nfl') ||
                                    m.category.toLowerCase().includes('nba');
                 return (m.isLive || isPriority) && normalizedCat !== 'tv';
             }
             return normalizedCat === urlSportId;
          });
        }

        setMatches(validMatches.sort((a, b) => a.date - b.date))
      } catch (e) { 
          console.error("Error fetching matches:", e) 
      } finally { 
          setLoading(false) 
      }
    }
    fetchMatches()
  }, [urlSportId])

  const groupedMatches = useMemo(() => {
    const filtered = matches.filter(m => {
      if (filter === 'LIVE') return m.isLive;
      if (filter === 'UPCOMING') return !m.isLive && m.date > Date.now();
      return true;
    });

    const groups: { [key: string]: FormattedMatch[] } = {};
    filtered.forEach(m => {
      const label = getDateLabel(m.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(m);
    });
    return groups;
  }, [matches, filter]);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-header">
          <Link href="/" className="back-link">
             <ArrowLeft size={16} /> Back Home
          </Link>
          <div className="header-title-row">
            <h1 className="page-title">
                {urlSportId === 'all' ? 'Live Matches' : urlSportName === 'All Matches' ? (urlSportId === 'american-football' ? 'Football' : urlSportId.charAt(0).toUpperCase() + urlSportId.slice(1)) : urlSportName}
            </h1>
            <span className="match-count">
                {Object.values(groupedMatches).reduce((acc, curr) => acc + curr.length, 0)} Matches
            </span>
          </div>
          <div className="filter-bar">
            <button className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>ALL</button>
            <button className={`filter-pill ${filter === 'LIVE' ? 'active' : ''}`} onClick={() => setFilter('LIVE')}>
              <div className="live-dot" /> LIVE
            </button>
            <button className={`filter-pill ${filter === 'UPCOMING' ? 'active' : ''}`} onClick={() => setFilter('UPCOMING')}>
              UPCOMING
            </button>
          </div>
        </div>

        {loading ? (
          <div className="matches-grid">
            {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton-pulse" style={{ height: '220px', borderRadius: '12px', background: '#1e1e1e', border: '1px solid #2a2a2a' }} />
            ))}
          </div>
        ) : (
          <div className="matches-list-wrapper">
            {Object.keys(groupedMatches).length > 0 ? (
              Object.entries(groupedMatches).map(([dateLabel, dateMatches]) => (
                <div key={dateLabel} className="date-group">
                  <div className="date-stamp">
                    <span className="stamp-line"></span>
                    <span className="stamp-text">{dateLabel}</span>
                    <span className="stamp-line"></span>
                  </div>
                  
                  <div className="matches-grid">
                    {dateMatches.map(m => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-page">
                <Calendar size={60} style={{ opacity: 0.3, marginBottom: '20px' }} />
                <h3>No Matches Found</h3>
                <p style={{ opacity: 0.6, fontSize: '14px' }}>Try selecting a different category or filter.</p>
                <button className="reset-btn" onClick={() => setFilter('ALL')}>Show All Matches</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}