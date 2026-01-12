'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Flame, Clock, Trophy, X } from 'lucide-react'
import '../../styles/Sportsgrid.css'

const API_BASE = 'https://streamed.pk/api'

// --- THE REAL TALK LIST ---
const FUNNY_MESSAGES = [
  "Only Real Niggas join our discord",
  "Stop being a ghost, join the community",
  "Matches, requests, and zero bullshit. Join up.",
  "If you like the stream, you'll love the chat.",
]

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
  const [mounted, setMounted] = useState(false);
  const [hiddenMatches, setHiddenMatches] = useState<Set<string>>(new Set());
  
  // --- DISCORD DYNAMIC TEXT LOGIC ---
  const [showPopup, setShowPopup] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    // SESSION STORAGE LOGIC
    const hasSeenThisSession = sessionStorage.getItem('reedstreams_discord_seen');
    if (!hasSeenThisSession) {
      const timer = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(timer);
    }

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % FUNNY_MESSAGES.length);
    }, 3000);

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

    return () => clearInterval(msgInterval);
  }, []);

  const closePopup = () => {
    sessionStorage.setItem('reedstreams_discord_seen', 'true');
    setShowPopup(false);
  };

  const handleImageError = (matchId: string) => {
    setHiddenMatches(prev => {
      const newSet = new Set(prev);
      newSet.add(matchId);
      return newSet;
    });
  };

  const { grouped, counts } = useMemo(() => {
    const grouped: Record<string, APIMatch[]> = {};
    const counts: Record<string, number> = {};
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

  const sportsToDisplay = [
      ...(grouped['popular'].length > 0 ? [{ id: 'popular', name: 'Popular Today' }] : []),
      ...FIXED_SPORTS.filter(s => grouped[s.id].length > 0)
  ];

  return (
    <div className="dashboard-wrapper">
      
      {/* --- FUNNY REAL-TALK POPUP --- */}
      {mounted && showPopup && (
        <div className="sultan-popup-overlay">
          <div className="sultan-popup-content">
            <button className="sultan-close-btn" onClick={closePopup}><X size={24} /></button>
            
            <div className="discord-icon-wrapper">
               <svg viewBox="0 0 127.14 96.36" fill="#5865F2" width="60" height="60">
                 <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39.2,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.73,11.1,105.32,105.32,0,0,0,32.05-16.15h0C130.11,50.41,122.09,26.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.87,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91,65.69,84.69,65.69Z"/>
               </svg>
            </div>

            <h2 className="sultan-popup-title">Join the Crew</h2>
            <div className="dynamic-text-container">
               <p className="sultan-popup-text funny-rotation">
                {FUNNY_MESSAGES[messageIndex]}
              </p>
            </div>
            <a href="https://discord.gg/PMaUcEKV" target="_blank" rel="noopener noreferrer" className="sultan-discord-btn" onClick={closePopup}>JOIN DISCORD</a>
          </div>
        </div>
      )}

      <div className="content-container">
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block">
              <Trophy size={20} color="var(--accent-color)" />
              <h2 className="section-title">Sports Category</h2>
            </div>
          </div>
          
          <div className="selector-grid">
            {mounted && (loading ? (
                Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />)
            ) : (
                FIXED_SPORTS.map(s => {
                    const count = counts[s.id];
                    return (
                      <Link
                        key={s.id}
                        href={`/live-matches?sportId=${s.id}&sportName=${encodeURIComponent(s.name)}`}
                        className="selector-pill"
                      >
                        <span className="pill-icon">{s.icon}</span>
                        <span className="pill-label">{s.name}</span>
                        {count > 0 && <div className="pill-count-badge">{count}</div>}
                      </Link>
                    );
                })
            ))}
          </div>
        </section>

        <div className="matches-grid-container">
          {mounted && (loading ? (
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
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsGrid;