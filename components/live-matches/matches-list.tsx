'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import '../../styles/live-matches.css'

const API_BASE = 'https://reedstreams-edge-v1.fly.dev/api/v1/streams'

// New API Data Interfaces
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

// The API returns this root object
interface ApiResponse {
  categories: StreamCategory[];
}

// Internal Interface for the View
interface FormattedMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  poster: string;
  isLive: boolean;
}

const isLive = (timestamp: number, category: string = ''): boolean => {
  if (category.toLowerCase().includes('24/7')) return true;
  
  const now = Date.now();
  // Timestamp is passed as ms here
  // Live if current time is >= start time AND less than 3.5 hours after start
  return timestamp <= now && (now - timestamp) < (3.5 * 60 * 60 * 1000);
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper to get Date Stamp Label
const getDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === tomorrow.toDateString()) return "TOMORROW";
  
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
};

const normalizeSport = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  if (cat.includes('basketball') || cat.includes('nba')) return 'basketball';
  if (cat.includes('american') || cat.includes('nfl')) return 'american-football';
  if (cat === 'football' || cat.includes('soccer') || cat.includes('laliga') || cat.includes('premier')) return 'football';
  if (cat.includes('icehockey') || cat.includes('hockey') || cat.includes('nhl')) return 'hockey';
  if (cat.includes('baseball') || cat.includes('mlb')) return 'baseball';
  if (cat.includes('mma') || cat.includes('ufc') || cat.includes('fight') || cat.includes('boxing') || cat.includes('wrestling')) return 'fight';
  if (cat.includes('motor') || cat.includes('racing') || cat.includes('f1')) return 'motorsport';
  if (cat.includes('tennis')) return 'tennis';
  if (cat.includes('cricket')) return 'cricket';
  if (cat.includes('golf')) return 'golf';
  if (cat.includes('24/7')) return 'tv';
  return 'other'; 
}

const MatchCard: React.FC<{ match: FormattedMatch }> = ({ match }) => {
  // Parse Title: "Team A vs. Team B"
  const titleParts = match.title.split(' vs. ');
  const isVsTitle = titleParts.length === 2;
  const homeName = isVsTitle ? titleParts[0] : match.title;
  const awayName = isVsTitle ? titleParts[1] : '';

  return (
    <Link 
      href={`/match/${match.id}`} 
      className="match-link"
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
    >
      <article className="match-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Visual Header (Poster) */}
        <div className="card-visual" style={{ 
          height: '140px', 
          width: '100%',
          backgroundImage: `url(${match.poster})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative'
        }}>
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }} />
           
           <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '6px' }}>
              {match.isLive ? (
                <span className="status-badge live">LIVE</span>
              ) : (
                <span className="status-badge time">{formatTime(match.date)}</span>
              )}
           </div>
        </div>

        {/* Info Body */}
        <div className="card-footer-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px' }}>
           <div className="match-info-text">
             <span className="match-description" style={{ fontSize: '15px', fontWeight: '600', color: '#fff', lineHeight: '1.3' }}>
               {isVsTitle ? (
                 <>
                   <div style={{color: '#fff'}}>{homeName}</div>
                   <div style={{fontSize: '0.8em', color: '#888', margin: '2px 0'}}>vs</div>
                   <div style={{color: '#fff'}}>{awayName}</div>
                 </>
               ) : (
                 match.title
               )}
             </span>
           </div>
           <div style={{ marginTop: '8px', fontSize: '12px', color: '#8db902', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
        const data: ApiResponse = await res.json() // Expecting object { categories: [...] }
        
        let validMatches: FormattedMatch[] = [];

        // Check if categories exists and is an array
        if (data && Array.isArray(data.categories)) {
            data.categories.forEach(catBlock => {
                if (catBlock.games) {
                    catBlock.games.forEach(game => {
                        const startTimeMs = game.start_time * 1000; // Convert seconds to ms
                        validMatches.push({
                            id: game.id.toString(),
                            title: game.name,
                            category: catBlock.category,
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
                 return m.isLive || m.category.includes('UFC') || m.category.includes('WWE');
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
      // Filter Tabs Logic
      if (filter === 'LIVE') return m.isLive;
      if (filter === 'UPCOMING') return !m.isLive && m.date > Date.now();
      return true;
    });

    // Group by Date Label
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
            <h1 className="page-title">{urlSportName}</h1>
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
            {Array(8).fill(0).map((_, i) => <div key={i} className="loading-card skeleton-pulse" style={{ height: '220px', borderRadius: '12px', background: '#1c1c1c' }} />)}
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