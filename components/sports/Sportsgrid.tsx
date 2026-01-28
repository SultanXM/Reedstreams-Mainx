'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Flame, 
  Trophy, 
  Tv,
  Calendar,
} from 'lucide-react'
import '../../styles/Sportsgrid.css'

// --- CONSTANTS ---
const API_URL = 'https://reedstreams-edge-v1.fly.dev/api/v1/streams';

// --- TYPES ---
interface StreamGame {
  id: number;
  name: string;
  poster: string;
  start_time: number;
  end_time: number;
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

// --- CONFIGURATION ---
const FIXED_SPORTS = [
  { id: 'popular', name: 'Popular Today', icon: <Flame size={18} color="#e25c3d" fill="#e25c3d" /> },
  { id: 'american-football', name: 'Football', icon: '🏈' },
  { id: 'football', name: 'Soccer', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'fight', name: 'MMA / WWE', icon: '🥊' }, 
  { id: 'motorsport', name: 'Racing', icon: '🏎️' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'tv', name: '24/7 TV', icon: '📺' },
]

// --- HELPERS ---
const normalizeSport = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  
  if (cat.includes('basketball') || cat.includes('nba')) return 'basketball';
  if (cat.includes('american') || cat.includes('nfl')) return 'american-football';
  if (cat === 'football' || cat.includes('soccer') || cat.includes('laliga') || cat.includes('premier') || cat.includes('bundesliga') || cat.includes('seriea')) return 'football';
  if (cat.includes('icehockey') || cat.includes('hockey') || cat.includes('nhl')) return 'hockey';
  if (cat.includes('baseball') || cat.includes('mlb')) return 'baseball';
  
  if (cat.includes('mma') || cat.includes('ufc') || cat.includes('fight') || cat.includes('boxing') || cat.includes('wrestling') || cat.includes('combat')) return 'fight';
  
  if (cat.includes('motor') || cat.includes('racing') || cat.includes('f1') || cat.includes('nascar')) return 'motorsport';
  if (cat.includes('tennis') || cat.includes('atp') || cat.includes('wta')) return 'tennis';
  if (cat.includes('cricket')) return 'cricket';
  if (cat.includes('golf') || cat.includes('pga')) return 'golf';
  if (cat.includes('24/7') || cat.includes('tv')) return 'tv';
  
  return 'other'; 
}

const isLive = (timestamp: number, category: string): boolean => {
  if (category.toLowerCase().includes('24/7')) return true;
  const now = Date.now();
  return timestamp <= now && (now - timestamp) < (3.5 * 60 * 60 * 1000);
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Check for high-profile keywords
const isHighProfile = (title: string, category: string): boolean => {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  
  // Fight Sports: Only UFC, PPV, or Title Fights
  if ((c.includes('ufc') || t.includes('ufc')) && !t.includes('prelims')) return true;
  if (t.includes('main event') || t.includes('title fight') || c.includes('ppv')) return true;
  
  // Major Leagues
  if (c.includes('nfl') || c.includes('nba')) return true;
  if (c.includes('premier league') || c.includes('champions league') || c.includes('laliga')) return true;
  if (c.includes('f1') || c.includes('formula 1')) return true;
  
  return false;
}

// Major sports priority for backfill
const isMajorSport = (sportId: string): boolean => {
    return ['american-football', 'football', 'basketball', 'fight', 'hockey'].includes(sportId);
}

// --- SKELETONS (Fixed Layouts) ---
const SkeletonPill = () => (
    <div className="skeleton-pulse" style={{ 
        background: '#1c1c1c', 
        border: '1px solid #222', 
        minWidth: '120px', 
        height: '46px', 
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        marginRight: '10px'
    }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#2a2a2a' }} />
        <div style={{ width: '60px', height: '10px', background: '#2a2a2a', borderRadius: '4px', marginLeft: '10px' }} />
    </div>
);

const SkeletonMatchCard = () => (
    <div style={{ minWidth: 'var(--match-card-w)', marginRight: '15px' }}> {/* SULTAN: Uses CSS var for width */}
        <div className="match-card skeleton-pulse" style={{ background: '#1e1e1e', height: '100%', aspectRatio: '16/9', borderRadius: '12px', border: '1px solid #222' }}>
            <div style={{ background: '#111', height: '65%', width: '100%', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }} />
            <div style={{ padding: '15px' }}>
                <div style={{ width: '70%', height: '14px', background: '#222', marginBottom: '10px', borderRadius: '4px' }} />
                <div style={{ width: '40%', height: '10px', background: '#222', borderRadius: '4px' }} />
            </div>
        </div>
    </div>
);

const MatchCard = React.memo(({ match }: { match: FormattedMatch }) => {
  return (
    <Link 
      href={`/match/${match.id}`} 
      className="match-card-link" 
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
      // SULTAN FIX: Replaced hardcoded px with variable to support resizing
      style={{ 
        width: 'var(--match-card-w)',    
        minWidth: 'var(--match-card-w)', 
        maxWidth: 'var(--match-card-w)', 
        flex: '0 0 auto', 
        textDecoration: 'none' 
      }}
    >
      <article className="match-card" style={{ overflow: 'hidden' }}>
        <div className="match-visual" style={{ 
            backgroundImage: `url(${match.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // SULTAN FIX: Removed fixed height, letting CSS aspect-ratio handle the scale for bigger cards
            position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0,  }} />
          
          <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <span className={`status-badge ${match.isLive ? 'live' : 'upcoming'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
              {match.isLive ? 'LIVE' : formatTime(match.date)}
            </span>
            {match.sportId === 'fight' && <div className="badge-popular"><Flame size={12} color="#8db902" fill="#8db902" /></div>}
          </div>
        </div>

        <div className="match-info" style={{ padding: '10px' }}>
          <div className="match-main-title">
             <div className="team-line" style={{ 
                 whiteSpace: 'nowrap', 
                 overflow: 'hidden', 
                 textOverflow: 'ellipsis', 
                 display: 'block',
                 color: '#fff',
                 fontWeight: 600,
                 fontSize: '13px',
                 lineHeight: '1.2'
             }}>
                {match.title}
             </div>
          </div>
          <div className="match-sub-meta" style={{ 
              fontSize: '11px', 
              color: '#888', 
              marginTop: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
          }}>
            {match.category}
          </div>
        </div>
      </article>
    </Link>
  );
});

export default function SportsGrid() {
  const [matches, setMatches] = useState<FormattedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch matches");
        
        const data: ApiResponse = await res.json();
        const allMatches: FormattedMatch[] = [];

        if (data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((catBlock) => {
            if (catBlock.games) {
              catBlock.games.forEach((game) => {
                const startMs = game.start_time * 1000;
                allMatches.push({
                  id: game.id.toString(),
                  title: game.name,
                  category: catBlock.category,
                  sportId: normalizeSport(catBlock.category),
                  date: startMs,
                  poster: game.poster,
                  isLive: isLive(startMs, catBlock.category)
                });
              });
            }
          });
        }

        allMatches.sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            return a.date - b.date;
        });

        setMatches(allMatches);
      } catch (err) {
        console.error("SportsGrid Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { groupedMatches, categoryCounts } = useMemo(() => {
    const groups: Record<string, FormattedMatch[]> = {};
    const counts: Record<string, number> = {};

    FIXED_SPORTS.forEach(sport => {
        groups[sport.id] = [];
        counts[sport.id] = 0;
    });
    groups['other'] = [];
    
    const popularSet = new Set<string>();

    matches.forEach(m => {
        if (groups[m.sportId]) {
            groups[m.sportId].push(m);
            if (m.isLive) counts[m.sportId]++;
        } else {
            groups['other'].push(m);
        }

        if (m.isLive && m.sportId !== 'tv') {
            groups['popular'].push(m);
            popularSet.add(m.id);
            counts['popular']++;
        }
    });

    matches.forEach(m => {
        if (!popularSet.has(m.id) && m.sportId !== 'tv') {
            if (isHighProfile(m.title, m.category)) {
                 groups['popular'].push(m);
                 popularSet.add(m.id);
            }
        }
    });

    let fillIndex = 0;
    while (groups['popular'].length < 7 && fillIndex < matches.length) {
        const m = matches[fillIndex];
        if (!popularSet.has(m.id) && m.sportId !== 'tv' && isMajorSport(m.sportId)) {
            groups['popular'].push(m);
            popularSet.add(m.id);
        }
        fillIndex++;
    }

    fillIndex = 0;
    while (groups['popular'].length < 7 && fillIndex < matches.length) {
        const m = matches[fillIndex];
        if (!popularSet.has(m.id) && m.sportId !== 'tv') {
            groups['popular'].push(m);
            popularSet.add(m.id);
        }
        fillIndex++;
    }

    groups['popular'].sort((a, b) => {
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        return a.date - b.date;
    });

    return { groupedMatches: groups, categoryCounts: counts };
  }, [matches]);

  const displayRows = FIXED_SPORTS.filter(sport => groupedMatches[sport.id].length > 0);

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        
        {/* --- Top Category Pills --- */}
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block">
                <Trophy size={20} color="#8db902" />
                <h2 className="section-title">Sports Category</h2>
            </div>
          </div>
          
          <div className="selector-grid" style={{ overflowX: 'auto', display: 'flex', paddingBottom: '10px' }}>
            {loading ? (
               Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />) 
            ) : (
               FIXED_SPORTS.filter(s => s.id !== 'popular').map(sport => (
                <Link key={sport.id} href={`/live-matches?sportId=${sport.id}`} className="selector-pill">
                  <span className="pill-icon">
                    {typeof sport.icon === 'string' ? sport.icon : sport.icon}
                  </span>
                  <span className="pill-label">{sport.name}</span>
                  {categoryCounts[sport.id] > 0 && (
                    <div className="pill-count-badge">{categoryCounts[sport.id]}</div>
                  )}
                </Link>
              ))
            )}
          </div>
        </section>

        {/* --- Match Rows (Carousels) --- */}
        <div className="matches-grid-container">
          {loading ? (
            <>
              <div style={{ marginBottom: 30 }}>
                  <div className="skeleton-pulse" style={{ width: 150, height: 24, background: '#1c1c1c', borderRadius: 4, marginBottom: 15 }} />
                  <div className="carousel-track" style={{ display: 'flex', overflow: 'hidden' }}>
                     {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
                  </div>
              </div>
              <div style={{ marginBottom: 30 }}>
                  <div className="skeleton-pulse" style={{ width: 150, height: 24, background: '#1c1c1c', borderRadius: 4, marginBottom: 15 }} />
                  <div className="carousel-track" style={{ display: 'flex', overflow: 'hidden' }}>
                     {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
                  </div>
              </div>
            </>
          ) : (
            <>
              {displayRows.map(sport => (
                <section key={sport.id} className="matches-section">
                  <div className="section-row-header">
                    <div className="title-block">
                      {sport.id === 'popular' ? <Flame size={20} color="#e25c3d" fill="#e25c3d" /> :
                       sport.id === 'tv' ? <Tv size={20} color="#8db902" /> :
                       <Trophy size={20} color="#8db902" />
                      }
                      <h2 className="section-title">{sport.name}</h2>
                      
                      {categoryCounts[sport.id] > 0 && (
                          <span className="live-count-tag">
                            <span className="live-dot-indicator"></span>
                            {categoryCounts[sport.id]} LIVE
                          </span>
                      )}
                    </div>
                    
                    <Link href={`/live-matches?sportId=${sport.id}`} className="view-all-link">
                        View All
                    </Link>
                  </div>

                  <div className="carousel-track" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px' }}>
                    {groupedMatches[sport.id].slice(0, 10).map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                    {groupedMatches[sport.id].length > 10 && (
                        <Link href={`/live-matches?sportId=${sport.id}`} className="see-more-card" style={{ minWidth: '150px', flex: '0 0 auto' }}>
                            <span>See All</span>
                            <div className="count">+{groupedMatches[sport.id].length - 10}</div>
                        </Link>
                    )}
                  </div>
                </section>
              ))}

              {!loading && displayRows.length === 0 && (
                 <div className="empty-state-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Calendar size={48} color="#333" style={{ marginBottom: 15 }} />
                    <h3 style={{ color: '#888' }}>No matches found right now</h3>
                    <p style={{ color: '#555', fontSize: 14 }}>Check back later for live streams.</p>
                 </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}