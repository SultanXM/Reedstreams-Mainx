'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Clock, 
  Trophy, 
  Smartphone, 
  ShieldAlert 
} from 'lucide-react'
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
const MatchCard = React.memo(({ match, onImageError }: { match: APIMatch; onImageError: (id: string) => void }) => {
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
            {match.popular && <div className="badge-popular"><Flame size={14} color="#8db902" fill="#8db902" /></div>}
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
});

MatchCard.displayName = 'MatchCard';

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
          {isPopular && <Trophy size={20} color="#8db902" />}
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

  // 🛡️ POPUP STATES - 10 SECOND TIMER
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [timerCount, setTimerCount] = useState(12);

  useEffect(() => {
    setMounted(true);

    // 1. Fetch Matches Logic
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_BASE}/matches/all-today`);
        const data: APIMatch[] = await res.json();
        const validMatches = data.filter(m => {
          const homeBadge = m.teams?.home?.badge;
          const awayBadge = m.teams?.away?.badge;
          return homeBadge && homeBadge.trim() !== '' && 
                 awayBadge && awayBadge.trim() !== '' && 
                 m.sources?.length > 0;
        });
        setMatches(validMatches);
      } catch (e) { 
        console.error("Failed to fetch matches:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchMatches();

    // 2. 🛡️ APPLE DETECTION ENGINE (iOS + Mac)
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isMac = /Macintosh/.test(ua) && 'ontouchend' in document === false; 
    const isIPadPro = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS || isMac || isIPadPro) {
      setIsAppleDevice(true);
      const countdown = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsAppleDevice(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, []);

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
      const isMatchLive = isLive(m.date);
      if (m.popular) {
        grouped['popular'].push(m);
        if (isMatchLive) counts['popular']++;
      }
      const sid = normalizeSport(m.category);
      if (sid && grouped[sid]) {
        grouped[sid].push(m);
        if (isMatchLive) counts[sid]++;
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
      <style jsx>{`
        /* 🛡️ APPLE SYSTEM ALERT POPUP */
        .apple-alert-box {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 95%;
          max-width: 450px;
          background: #000;
          border: 1px solid #8db902;
          border-radius: 12px;
          z-index: 20000; 
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 30px 60px rgba(0,0,0,1);
          animation: alertSlideDown 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes alertSlideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        /* Original Layout Styles */
        .mobile-stability-banner {
          display: none;
          background: linear-gradient(90deg, #1a1a1a 0%, #000 100%);
          border-bottom: 1px solid #222;
          padding: 12px 20px;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 100;
          margin-bottom: 10px;
          margin-top: -8vh;
        }
        @media (max-width: 768px) {
          .mobile-stability-banner {
            display: flex;
          }
        }
        .stability-icon-wrapper {
          background: rgba(141, 185, 2, 0.1);
          padding: 8px;
          border-radius: 8px;
          color: #8db902;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stability-title {
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stability-desc {
          color: #888;
          font-size: 11px;
          line-height: 1.3;
        }
      `}</style>

      {/* 🛡️ DYNAMIC APPLE STABILITY POPUP (10s) */}
      {isAppleDevice && (
        <div className="apple-alert-box">
          <div style={{background: 'rgba(141, 185, 2, 0.15)', padding: '12px', borderRadius: '10px', color: '#8db902'}}>
             <ShieldAlert size={32} strokeWidth={2.5} />
          </div>
          <div style={{flex: 1}}>
             <h3 style={{color: '#fff', fontSize: '14px', fontWeight: '900', margin: 0, textTransform: 'uppercase', letterSpacing: '1px'}}>Handshake Warning</h3>
             <p style={{color: '#888', fontSize: '11px', margin: '4px 0 0 0', lineHeight: '1.4'}}>
                Apple Safari engine is unstable with our providers. For 1080p streams, please switch to <span style={{color: '#8db902', fontWeight: 'bold'}}>Desktop Chrome</span> or <span style={{color: '#8db902', fontWeight: 'bold'}}>Android</span>.
             </p>
          </div>
          <div style={{background: '#111', border: '1px solid #222', height: '40px', width: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8db902', fontSize: '14px', fontWeight: '900'}}>
             {timerCount}
          </div>
        </div>
      )}

      {/* Static banner kept for overall layout stability as per original code */}
      <div className="mobile-stability-banner">
        <div className="stability-icon-wrapper">
          <Smartphone size={18} />
        </div>
        <div className="stability-text-content">
          <div className="stability-title">IOS stability notice</div>
          <div className="stability-desc">We are not stable on IOS right now. Please switch to Android/Desktop for a seamless experience. We will be back shortly!</div>
        </div>
      </div>

      <div className="content-container">
        {/* Top Pills Section */}
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block">
              <Trophy size={20} color="#8db902" />
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

        {/* Matches Rows */}
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