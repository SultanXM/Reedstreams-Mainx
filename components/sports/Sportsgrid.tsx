'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Flame, 
  Trophy, 
  Smartphone, 
  ShieldAlert 
} from 'lucide-react'
import '../../styles/Sportsgrid.css'

const API_BASE = 'https://streamed.pk/api'

interface APIMatch {
  id: string; title: string; category: string; date: number; popular: boolean;
  teams?: { home?: { badge: string; name: string }; away?: { badge: string; name: string } };
  sources: { source: string; id: string }[];
}

const FIXED_SPORTS = [
  { id: 'american-football', name: 'Football 🔥', icon: '🏈' },
  { id: 'football', name: 'Soccer', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'hockey', name: 'Ice Hockey', icon: '🏒' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'fight', name: 'MMA / UFC', icon: '🥊' }, // ID is 'fight' to match your API link requirements
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'rugby', name: 'Rugby', icon: '🏉' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'darts', name: 'Darts', icon: '🎯' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'motorsport', name: 'Racing', icon: '🏎️' }
]

const normalizeSport = (category: string, title: string = ''): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  const tit = title.toLowerCase();
  
  if (cat.includes('basketball') || cat.includes('nba')) return 'basketball';
  if (cat.includes('american') || cat.includes('nfl')) return 'american-football';
  if (cat.includes('soccer') || cat.includes('football')) return 'football';
  if (cat.includes('icehockey') || cat.includes('hockey') || cat.includes('nhl')) return 'hockey';
  if (cat.includes('baseball') || cat.includes('mlb')) return 'baseball';
  
  // FIXED: Now returns 'fight' to match the FIXED_SPORTS id exactly
  if (
    cat.includes('mma') || 
    cat.includes('ufc') || 
    cat.includes('fight') || 
    cat.includes('boxing') || 
    cat.includes('combat') ||
    tit.includes('ufc') ||
    tit.includes('mma')
  ) return 'fight';
  
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

const formatTime = (timestamp: number): string => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

const MatchCard = React.memo(({ match, onImageError }: { match: APIMatch; onImageError: (id: string) => void }) => {
  const isMatchLive = isLive(match.date);
  const homeName = match.teams?.home?.name || 'Home';
  const awayName = match.teams?.away?.name || 'Away';
  const hBadge = match.teams?.home?.badge ? getImageUrl(match.teams.home.badge) : null;
  const aBadge = match.teams?.away?.badge ? getImageUrl(match.teams.away.badge) : null;

  return (
    <Link href={`/match/${match.id}`} className="match-card-link" onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}>
      <article className="match-card">
        <div className="match-visual">
          <div className="card-top-row">
            <span className={`status-badge ${isMatchLive ? 'live' : 'upcoming'}`}>{isMatchLive ? 'LIVE' : formatTime(match.date)}</span>
            {match.popular && <div className="badge-popular"><Flame size={14} color="#8db902" fill="#8db902" /></div>}
          </div>
          <div className="logos-wrapper">
            {hBadge && <img src={hBadge} className="team-logo" alt={homeName} onError={() => onImageError(match.id)} />}
            <span className="vs-divider">VS</span>
            {aBadge && <img src={aBadge} className="team-logo" alt={awayName} onError={() => onImageError(match.id)} />}
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

export default function SportsGrid({ initialData }: { initialData: APIMatch[] }) {
  const [matches] = useState<APIMatch[]>(initialData || []);
  const [loading, setLoading] = useState(true); 
  const [hiddenMatches, setHiddenMatches] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleImageError = (matchId: string) => setHiddenMatches(prev => new Set(prev).add(matchId));

  const { grouped, counts } = useMemo(() => {
    const grouped: Record<string, APIMatch[]> = { popular: [] };
    const counts: Record<string, number> = { popular: 0 };
    
    FIXED_SPORTS.forEach(s => { 
      grouped[s.id] = []; 
      counts[s.id] = 0; 
    });

    matches.forEach(m => {
      // Logic for displaying only if badges exist
      const hasHomeImg = m.teams?.home?.badge && m.teams.home.badge.trim() !== "";
      const hasAwayImg = m.teams?.away?.badge && m.teams.away.badge.trim() !== "";
      if (hiddenMatches.has(m.id) || !hasHomeImg || !hasAwayImg) return;

      const isMatchLive = isLive(m.date);
      
      // Popular Section
      if (m.popular) { 
        grouped['popular'].push(m); 
        if (isMatchLive) counts['popular']++; 
      }

      // Sports Logic
      const sid = normalizeSport(m.category, m.title);
      // FIXED: Checks if the SID exists in FIXED_SPORTS (grouped) before pushing
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
      <div className="content-container">
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
                      {s.id === 'popular' && <Trophy size={20} color="#8db902" />}
                      <h2 className="section-title">{s.name}</h2>
                      {counts[s.id] > 0 && <span className="live-count-tag">{counts[s.id]} LIVE</span>}
                    </div>
                  </div>
                  <div className="carousel-track">
                    {grouped[s.id].map((m, idx) => (
                      <MatchCard key={`${m.id}-${idx}`} match={m} onImageError={handleImageError} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}