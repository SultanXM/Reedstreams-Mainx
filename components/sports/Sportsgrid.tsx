'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Flame, 
  Trophy, 
  Tv,
  Calendar,
  Clock 
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

const getTimeUntil = (timestamp: number): string => {
  const now = Date.now();
  const diff = timestamp - now;
  if (diff < 0) return "Starting...";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) return "Tomorrow";
  if (hours > 0) return `Starts in ${hours}h ${minutes}m`;
  return `Starts in ${minutes}m`;
}

const isHighProfile = (title: string, category: string): boolean => {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  if ((c.includes('ufc') || t.includes('ufc')) && !t.includes('prelims')) return true;
  if (t.includes('main event') || t.includes('title fight') || c.includes('ppv')) return true;
  if (c.includes('nfl') || c.includes('nba')) return true;
  if (c.includes('premier league') || c.includes('champions league') || c.includes('laliga')) return true;
  if (c.includes('f1') || c.includes('formula 1')) return true;
  return false;
}

const isMajorSport = (sportId: string): boolean => {
    return ['american-football', 'football', 'basketball', 'fight', 'hockey'].includes(sportId);
}

// --- SKELETONS ---
const SkeletonPill = () => (
    <div className="selector-pill skeleton-pulse" style={{ border: '1px solid #222' }}>
        <div style={{ width: '40px', height: '40px', background: '#222', borderRadius: '50%', marginBottom: '10px' }} />
        <div style={{ width: '60px', height: '10px', background: '#222', borderRadius: '4px' }} />
    </div>
);

const SkeletonMatchCard = () => (
    <div style={{ width: 'var(--match-card-w)', minWidth: 'var(--match-card-w)', flexShrink: 0 }}> 
        <div className="match-card skeleton-pulse" style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #222', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#222' }} />
            <div style={{ padding: '12px', flex: 1 }}>
                <div style={{ width: '80%', height: '14px', background: '#252525', marginBottom: '8px', borderRadius: '4px' }} />
                <div style={{ width: '50%', height: '10px', background: '#252525', borderRadius: '4px' }} />
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
    >
      <article className="match-card">
        <div className="match-visual" style={{ 
            backgroundImage: `url(${match.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 10%)' }} />
          <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <span className={`status-badge ${match.isLive ? 'live' : 'upcoming'}`}>
              {match.isLive ? 'LIVE' : formatTime(match.date)}
            </span>
            {match.sportId === 'fight' && <div className="badge-popular"><Flame size={12} color="#8db902" fill="#8db902" /></div>}
          </div>
        </div>
        <div className="match-info">
          <div className="match-sub-meta">{match.category}</div>
          <div className="match-main-title">{match.title}</div>
          {!match.isLive && (
             <div className="match-timer-text">
                <Clock size={10} color="#888" /> {getTimeUntil(match.date)}
             </div>
          )}
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
    FIXED_SPORTS.forEach(sport => { groups[sport.id] = []; counts[sport.id] = 0; });
    groups['other'] = [];
    const popularSet = new Set<string>();
    matches.forEach(m => {
        if (groups[m.sportId]) { groups[m.sportId].push(m); if (m.isLive) counts[m.sportId]++; } 
        else { groups['other'].push(m); }
        if (m.isLive && m.sportId !== 'tv') { groups['popular'].push(m); popularSet.add(m.id); counts['popular']++; }
    });
    matches.forEach(m => {
        if (!popularSet.has(m.id) && m.sportId !== 'tv' && isHighProfile(m.title, m.category)) {
            groups['popular'].push(m); popularSet.add(m.id);
        }
    });
    let fillIndex = 0;
    while (groups['popular'].length < 7 && fillIndex < matches.length) {
        const m = matches[fillIndex];
        if (!popularSet.has(m.id) && m.sportId !== 'tv' && isMajorSport(m.sportId)) {
            groups['popular'].push(m); popularSet.add(m.id);
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

  const displayRows = FIXED_SPORTS.filter(sport => groupedMatches[sport.id].length > 0 && sport.id !== 'motorsport');

  return (
    <div className="dashboard-wrapper">
      <div className="theme-bg-overlay" />
      <div className="content-container">
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block">
                <Trophy size={20} color="#8db902" />
                <h2 className="section-title">Sports Category</h2>
            </div>
          </div>
          <div className="selector-grid">
            {loading ? (
               Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />) 
            ) : (
               FIXED_SPORTS.filter(s => s.id !== 'popular').map(sport => (
                <Link key={sport.id} href={`/live-matches?sportId=${sport.id}`} className="selector-pill">
                  <span className="pill-icon">{sport.icon}</span>
                  <span className="pill-label">{sport.name}</span>
                  {categoryCounts[sport.id] > 0 && <div className="pill-count-badge">{categoryCounts[sport.id]}</div>}
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="matches-grid-container">
          {loading ? (
            <>
              <div style={{ marginBottom: 30 }}>
                  <div className="skeleton-pulse" style={{ width: 150, height: 24, background: '#1a1a1a', borderRadius: 4, marginBottom: 15 }} />
                  <div className="carousel-track" style={{ display: 'flex', overflow: 'hidden' }}>
                     {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
                  </div>
              </div>
            </>
          ) : (
            displayRows.map(sport => (
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
                  <Link href={`/live-matches?sportId=${sport.id}`} className="view-all-link">View All</Link>
                </div>
                <div className="carousel-track">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}