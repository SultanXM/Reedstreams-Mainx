'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Flame, 
  Trophy, 
  Tv,
} from 'lucide-react'
import '../../styles/Sportsgrid.css'

// New API Type Definitions based on your JSON
interface StreamGame {
  id: number;
  name: string;
  poster: string;
  start_time: number; // Unix timestamp in seconds
  end_time: number;
  cache_time: number;
  video_link: string;
  category: string;
}

interface StreamCategory {
  category: string;
  games: StreamGame[];
}

// Internal Interface for the UI
interface FormattedMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  poster: string;
  isLive: boolean;
  videoLink: string;
}

const FIXED_SPORTS = [
  { id: 'american-football', name: 'Football 🔥', icon: '🏈' },
  { id: 'football', name: 'Soccer', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'fight', name: 'MMA / WWE', icon: '🥊' }, 
  { id: 'motorsport', name: 'Racing', icon: '🏎️' },
  { id: 'tv', name: '24/7 TV', icon: '📺' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
]

// Normalizes API category strings to our internal IDs
const normalizeSport = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  
  if (cat.includes('basketball') || cat.includes('nba')) return 'basketball';
  if (cat.includes('american') || cat.includes('nfl')) return 'american-football';
  if (cat === 'football' || cat.includes('soccer') || cat.includes('laliga') || cat.includes('premier')) return 'football';
  if (cat.includes('icehockey') || cat.includes('hockey') || cat.includes('nhl')) return 'hockey';
  if (cat.includes('baseball') || cat.includes('mlb')) return 'baseball';
  
  if (
    cat.includes('mma') || 
    cat.includes('ufc') || 
    cat.includes('fight') || 
    cat.includes('boxing') || 
    cat.includes('wrestling') || // Added Wrestling here
    cat.includes('combat')
  ) return 'fight';
  
  if (cat.includes('motor') || cat.includes('racing') || cat.includes('f1')) return 'motorsport';
  if (cat.includes('tennis')) return 'tennis';
  if (cat.includes('cricket')) return 'cricket';
  if (cat.includes('golf')) return 'golf';
  if (cat.includes('24/7')) return 'tv';
  
  return 'other'; // Fallback
}

const isLive = (timestamp: number, category: string): boolean => {
  // 24/7 streams are always live
  if (category.toLowerCase().includes('24/7')) return true;

  const now = Date.now();
  // Timestamp from API is seconds, so compare accordingly
  // However, we convert to ms in formatting, so passed timestamp here is ms
  const matchTime = timestamp; 
  
  // Logic: It is live if we are past start time and within 3.5 hours of start
  return matchTime <= now && (now - matchTime) < (3.5 * 60 * 60 * 1000);
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const SkeletonPill = () => (
    <div className="selector-pill skeleton-pulse" style={{ background: '#1c1c1c', border: '1px solid #222' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a2a2a', marginBottom: '8px' }} />
        <div style={{ width: '60px', height: '10px', background: '#2a2a2a', borderRadius: '4px' }} />
    </div>
);

const SkeletonMatchCard = () => (
    <div className="match-card-link">
        <div className="match-card skeleton-pulse" style={{ background: '#1e1e1e' }}>
            <div className="match-visual" style={{ background: '#111', height: '120px' }} />
            <div className="match-info">
                <div style={{ width: '80%', height: '14px', background: '#222', marginBottom: '8px', borderRadius: '4px' }} />
                <div style={{ width: '40%', height: '10px', background: '#222', borderRadius: '4px' }} />
            </div>
        </div>
    </div>
);

const MatchCard = React.memo(({ match }: { match: FormattedMatch }) => {
  // Parsing the title to see if we can split it (Optional, for styling)
  // New API titles are usually "Team A vs. Team B"
  const titleParts = match.title.split(' vs. ');
  const isVsTitle = titleParts.length === 2;

  const homeName = isVsTitle ? titleParts[0] : match.title;
  const awayName = isVsTitle ? titleParts[1] : '';

  return (
    <Link 
      href={`/match/${match.id}`} 
      className="match-card-link" 
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
    >
      <article className="match-card">
        {/* Visual Section: Now uses the Banner/Poster from API */}
        <div className="match-visual" style={{ 
            backgroundImage: `url(${match.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            height: '140px', // Fixed height for banner look
            borderRadius: '12px',
            overflow: 'hidden'
        }}>
          {/* Dark Overlay for readability of badges */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%)' }} />
          
          <div className="card-top-row" style={{ position: 'relative', zIndex: 2, padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span className={`status-badge ${match.isLive ? 'live' : 'upcoming'}`}>
              {match.isLive ? 'LIVE' : formatTime(match.date)}
            </span>
            {/* Hot fire icon for high profile stuff or manual override */}
            {(match.category.toLowerCase().includes('ufc') || match.category.toLowerCase().includes('wwe')) && (
               <div className="badge-popular"><Flame size={14} color="#8db902" fill="#8db902" /></div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="match-info" style={{ marginTop: '10px' }}>
          <div className="match-main-title" style={{ fontSize: '14px', lineHeight: '1.4', fontWeight: '600', color: '#fff' }}>
            {isVsTitle ? (
              <>
                {homeName} <span style={{ opacity: 0.5, fontSize: '0.9em' }}>vs</span> {awayName}
              </>
            ) : (
              homeName
            )}
          </div>
          <div className="match-sub-meta" style={{ opacity: 0.6, fontSize: '12px', marginTop: '4px' }}>
            {match.category}
          </div>
        </div>
      </article>
    </Link>
  );
});

export default function SportsGrid({ initialData }: { initialData: StreamCategory[] }) {
  const [matches, setMatches] = useState<FormattedMatch[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (initialData) {
      // Flatten the nested 'categories' -> 'games' structure
      const flattened: FormattedMatch[] = [];
      
      initialData.forEach((catBlock) => {
        if(catBlock.games) {
          catBlock.games.forEach((game) => {
            // Convert API seconds to JS milliseconds
            const startTimeMs = game.start_time * 1000;
            const liveStatus = isLive(startTimeMs, catBlock.category);

            flattened.push({
              id: game.id.toString(),
              title: game.name,
              category: catBlock.category, // Use the category from the parent block or game.category
              date: startTimeMs,
              poster: game.poster,
              isLive: liveStatus,
              videoLink: game.video_link
            });
          });
        }
      });
      
      // Sort: Live first, then by date
      flattened.sort((a, b) => {
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        return a.date - b.date;
      });

      setMatches(flattened);
      setLoading(false);
    }
  }, [initialData]);


  const { grouped, counts } = useMemo(() => {
    const grouped: Record<string, FormattedMatch[]> = { popular: [] };
    const counts: Record<string, number> = { popular: 0 };
    
    // Initialize groups
    FIXED_SPORTS.forEach(s => { 
      grouped[s.id] = []; 
      counts[s.id] = 0; 
    });
    grouped['other'] = []; // Catch-all

    matches.forEach(m => {
      const sid = normalizeSport(m.category);
      
      // Populate "Popular" if it's Live or specific categories like PPV
      const isHighProfile = m.category.includes('UFC') || m.category.includes('Boxing') || m.category.includes('WWE');
      if (m.isLive || isHighProfile) { 
        grouped['popular'].push(m);
        if(m.isLive) counts['popular']++;
      }

      // Populate Specific Categories
      if (sid && grouped[sid]) { 
        grouped[sid].push(m); 
        if (m.isLive) counts[sid]++; 
      } else {
        // Fallback for types not in our fixed list
        grouped['other'].push(m);
      }
    });

    return { grouped, counts };
  }, [matches]);

  const sportsToDisplay = [
      ...(grouped['popular'].length > 0 ? [{ id: 'popular', name: 'Popular & Live' }] : []),
      ...FIXED_SPORTS.filter(s => grouped[s.id].length > 0),
      ...(grouped['other'].length > 0 ? [{ id: 'other', name: 'Other Sports' }] : [])
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        
        {/* Top Category Selector */}
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block">
                <Trophy size={20} color="#8db902" />
                <h2 className="section-title">Sports Category</h2>
            </div>
          </div>
          <div className="selector-grid">
            {loading ? Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />) : 
              FIXED_SPORTS.map(s => (
                <Link key={s.id} href={`/live-matches?sportId=${s.id}`} className="selector-pill">
                  <span className="pill-icon">{s.icon}</span>
                  <span className="pill-label">{s.name}</span>
                  {counts[s.id] > 0 && <div className="pill-count-badge">{counts[s.id]}</div>}
                </Link>
              ))
            }
          </div>
        </section>

        {/* Matches Grid */}
        <div className="matches-grid-container">
          {loading ? (
            <>
              <div className="section-row-header" style={{ border: 'none', marginBottom: '20px' }}>
                <div style={{ width: '150px', height: '24px', background: '#1c1c1c', borderRadius: '4px' }} className="skeleton-pulse" />
              </div>
              <div className="carousel-track">
                {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
              </div>
            </>
          ) : (
            <>
              {sportsToDisplay.map(s => (
                <section key={s.id} className="matches-section">
                  <div className="section-row-header">
                    <div className="title-block">
                      {s.id === 'popular' && <Flame size={20} color="#e25c3d" fill="#e25c3d" />}
                      {s.id === 'tv' && <Tv size={20} color="#8db902" />}
                      {s.id !== 'popular' && s.id !== 'tv' && <Trophy size={20} color="#8db902" />}
                      <h2 className="section-title">{s.name}</h2>
                      {counts[s.id] > 0 && <span className="live-count-tag">{counts[s.id]} LIVE</span>}
                    </div>
                  </div>
                  <div className="carousel-track">
                    {grouped[s.id].map((m) => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </section>
              ))}
              
              {/* If no matches found */}
              {matches.length === 0 && !loading && (
                 <div style={{ padding: '20px', color: '#666', textAlign: 'center' }}>
                    No live matches currently available.
                 </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}