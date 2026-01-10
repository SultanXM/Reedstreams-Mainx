'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Flame, Clock, Trophy } from 'lucide-react'
import '../../styles/Sportsgrid.css'

const API_BASE = 'https://streamed.pk/api'

interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  popular: boolean;
  teams?: { 
    home?: { badge: string; name: string }; 
    away?: { badge: string; name: string } 
  };
  sources: { source: string; id: string }[];
}

const FIXED_SPORTS = [
  { id: 'american-football', name: 'Football 🔥', icon: '🏈' },
  { id: 'football', name: 'Soccer', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'mma', name: 'MMA / UFC', icon: '🥊' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'rugby', name: 'Rugby', icon: '🏉' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'darts', name: 'Darts', icon: '🎯' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'motorsport', name: 'Racing', icon: '🏎️' }
]

const normalizeSport = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  if (cat.includes('basketball') || cat.includes('nba')) return 'basketball';
  if (cat.includes('american') || cat.includes('nfl')) return 'american-football';
  if (cat.includes('soccer') || cat.includes('football')) return 'football';
  if (cat.includes('icehockey') || cat.includes('hockey') || cat.includes('nhl')) return 'hockey';
  if (cat.includes('baseball') || cat.includes('mlb')) return 'baseball';
  if (cat.includes('mma') || cat.includes('ufc') || cat.includes('fight') || cat.includes('boxing')) return 'mma';
  if (cat.includes('motor') || cat.includes('racing') || cat.includes('f1') || cat.includes('nascar')) return 'motorsport';
  if (cat.includes('tennis')) return 'tennis';
  if (cat.includes('rugby')) return 'rugby';
  if (cat.includes('golf')) return 'golf';
  if (cat.includes('darts')) return 'darts';
  if (cat.includes('cricket')) return 'cricket';
  return '';
}

const getImageUrl = (badgeId: string): string => `${API_BASE}/images/badge/${badgeId}.webp`;

const isLive = (timestamp: number): boolean => {
  const now = Date.now();
  const matchTime = new Date(timestamp).getTime();
  return matchTime <= now && (now - matchTime) < (3 * 60 * 60 * 1000);
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- SKELETON COMPONENTS ---
const SkeletonPill = () => (
    <div className="selector-pill skeleton-pulse" style={{ background: '#1c1c1c', border: '1px solid #222' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a2a2a', marginBottom: '8px' }} />
        <div style={{ width: '60px', height: '10px', background: '#2a2a2a', borderRadius: '4px' }} />
    </div>
);

const SkeletonMatchCard = () => (
    <div className="match-card-link">
        <div className="match-card skeleton-pulse" style={{ background: '#1e1e1e' }}>
            <div className="match-visual" style={{ background: '#111' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#222' }} />
                <div style={{ width: '20px', height: '10px', background: '#222' }} />
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#222' }} />
            </div>
            <div className="match-info">
                <div style={{ width: '80%', height: '14px', background: '#222', marginBottom: '8px', borderRadius: '4px' }} />
                <div style={{ width: '40%', height: '10px', background: '#222', borderRadius: '4px' }} />
            </div>
        </div>
    </div>
);

// --- Match Card ---
const MatchCard: React.FC<{ match: APIMatch; onImageError: (id: string) => void }> = ({ match, onImageError }) => {
  const isMatchLive = isLive(match.date);
  const homeName = match.teams?.home?.name || 'Home';
  const awayName = match.teams?.away?.name || 'Away';

  return (
    <Link 
      href={`/match/${match.id}`} 
      className="match-card-link"
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
    >
      <article className="match-card">
        <div className="match-visual">
          <div className="card-top-row">
            <span className={`status-badge ${isMatchLive ? 'live' : 'upcoming'}`}>
              {isMatchLive ? 'LIVE' : formatTime(match.date)}
            </span>
            {match.popular && <div className="badge-popular"><Flame size={14} color="#ffa500" fill="#ffa500" /></div>}
          </div>
          <div className="logos-wrapper">
            <img 
              src={getImageUrl(match.teams!.home!.badge)} 
              className="team-logo" 
              alt={homeName} 
              loading="lazy"
              onError={() => onImageError(match.id)} 
            />
            <span className="vs-divider">VS</span>
            <img 
              src={getImageUrl(match.teams!.away!.badge)} 
              className="team-logo" 
              alt={awayName} 
              loading="lazy"
              onError={() => onImageError(match.id)} 
            />
          </div>
        </div>
        <div className="match-info">
          <div className="match-main-title">{homeName} <span style={{opacity:0.5}}>vs</span> {awayName}</div>
          <div className="match-sub-meta">{match.category}</div>
        </div>
      </article>
    </Link>
  );
};

const MatchesRow: React.FC<{ sport: any, matches: APIMatch[], liveCount: number, onImageError: (id: string) => void }> = ({ sport, matches, liveCount, onImageError }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'l' | 'r') => {
    if (rowRef.current) {
      const amt = rowRef.current.clientWidth * 0.6;
      rowRef.current.scrollBy({ left: dir === 'l' ? -amt : amt, behavior: 'smooth' });
    }
  };
  
  const isPopular = sport.id === 'popular';

  return (
    <section className="matches-section" id={`section-${sport.id}`}>
      <div className="section-row-header">
        <div className="title-block">
          {isPopular && <Trophy size={20} color="var(--accent-color)" />}
          <h2 className="section-title">{sport.name}</h2>
          {liveCount > 0 && <span className="live-count-tag">{liveCount} LIVE</span>}
        </div>
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => scroll('l')}><ChevronLeft size={20} /></button>
          <button className="nav-btn" onClick={() => scroll('r')}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="carousel-track" ref={rowRef}>
        {matches.map((m, idx) => (
          <MatchCard 
            key={`${sport.id}-${m.id}-${idx}`} 
            match={m} 
            onImageError={onImageError}
          />
        ))}
      </div>
    </section>
  );
};

const SportsGrid: React.FC = () => {
  const [matches, setMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenMatches, setHiddenMatches] = useState<Set<string>>(new Set());

  const handleImageError = (matchId: string) => {
    setHiddenMatches(prev => {
      const newSet = new Set(prev);
      newSet.add(matchId);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_BASE}/matches/all-today`);
        const data: APIMatch[] = await res.json();
        const validMatches = data.filter(m => {
          const hasHomeBadge = m.teams?.home?.badge && m.teams.home.badge.trim() !== '';
          const hasAwayBadge = m.teams?.away?.badge && m.teams.away.badge.trim() !== '';
          return hasHomeBadge && hasAwayBadge && m.sources?.length > 0;
        });
        setMatches(validMatches);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchMatches();
  }, []);

  const { grouped, counts } = useMemo(() => {
    const grouped: Record<string, APIMatch[]> = {};
    const counts: Record<string, number> = {};
    
    // Explicitly add 'popular' to grouped even if not in FIXED_SPORTS array
    grouped['popular'] = [];
    counts['popular'] = 0;

    FIXED_SPORTS.forEach(s => { grouped[s.id] = []; counts[s.id] = 0; });
    
    matches.forEach(m => {
      if (hiddenMatches.has(m.id)) return;
      if (m.popular) {
        grouped['popular'].push(m);
        if (isLive(m.date)) counts['popular']++;
      }
      const sid = normalizeSport(m.category);
      if (sid && grouped[sid]) {
        grouped[sid].push(m);
        if (isLive(m.date)) counts[sid]++;
      }
    });
    return { grouped, counts };
  }, [matches, hiddenMatches]);

  // Ensure popular is still checked for rendering the row, even if not a pill
  const sportsToDisplay = [
      ...(grouped['popular'].length > 0 ? [{ id: 'popular', name: 'Popular Today' }] : []),
      ...FIXED_SPORTS.filter(s => grouped[s.id].length > 0)
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block">
              <Trophy size={20} color="var(--accent-color)" />
              <h2 className="section-title">Sports Category</h2>
            </div>
          </div>
          
          <div className="selector-grid">
            {loading ? (
                Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />)
            ) : (
                FIXED_SPORTS.map(s => {
                    const count = counts[s.id];
                    const isFootball = s.id === 'american-football';
                    
                    return (
                      <Link
                        key={s.id}
                        href={`/live-matches?sportId=${s.id}&sportName=${encodeURIComponent(s.name)}`}
                        className={`selector-pill ${isFootball ? 'pill-football' : ''}`}
                      >
                        <span className="pill-icon">{s.icon}</span>
                        <span className="pill-label">{s.name}</span>
                        {count > 0 && <div className="pill-count-badge">{count}</div>}
                      </Link>
                    );
                })
            )}
          </div>
        </section>

        {loading ? (
          <div className="matches-grid-container">
            <div className="section-row-header" style={{ border: 'none', marginBottom: '20px' }}>
                <div style={{ width: '150px', height: '24px', background: '#1c1c1c', borderRadius: '4px' }} className="skeleton-pulse" />
            </div>
            <div className="carousel-track">
                {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
            </div>
          </div>
        ) : (
          <div className="matches-grid-container">
            {sportsToDisplay.map(s => (
              <MatchesRow 
                key={s.id} 
                sport={s} 
                matches={grouped[s.id]} 
                liveCount={counts[s.id]} 
                onImageError={handleImageError}
              />
            ))}
            
            {sportsToDisplay.length === 0 && (
              <div className="empty-state">
                <Clock size={48} style={{ marginBottom: '16px' }} />
                <h3>No Matches Available</h3>
                <p>We couldn't find any scheduled games with valid team data.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SportsGrid;