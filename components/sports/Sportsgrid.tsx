'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Flame, 
  Trophy, 
} from 'lucide-react'
import '../../styles/Sportsgrid.css'

const API_BASE = 'https://streamed.pk/api'
const REED_API_URL = 'https://reedstreams-edge-v1.fly.dev/api/v1/streams'

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
  { id: 'fight', name: 'MMA / UFC', icon: '🥊' }, 
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

// --- UPDATED BANNER CARD ---
const BannerCard = ({ game }: { game: any }) => {
  const isMatchLive = isLive(game.start_time * 1000);
  return (
    <Link 
      href={`/match/${game.id}?isNative=true`} 
      className="match-card-link" 
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify({
          id: game.id,
          title: game.name,
          date: game.start_time * 1000,
          isNative: true,
          embedUrl: game.video_link // Fixed: Passing the actual stream link
      }))}
    >
      <article className="match-card">
        <div className="match-visual" style={{ padding: 0, overflow: 'hidden', position: 'relative', display: 'block' }}>
          <img src={game.poster} alt={game.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
          <div className="card-top-row" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '12px', display: 'flex', justifyContent: 'flex-start' }}>
            <span className={`status-badge ${isMatchLive ? 'live' : 'upcoming'}`} style={{ margin: 0 }}>
                {isMatchLive ? 'LIVE' : formatTime(game.start_time * 1000)}
            </span>
          </div>
        </div>
        <div className="match-info">
          <div className="match-main-title">{game.name}</div>
          <div className="match-sub-meta">REEDSTREAMS SIGNAL</div>
        </div>
      </article>
    </Link>
  );
};

const MatchCard = React.memo(({ match, onImageError }: { match: APIMatch; onImageError: (id: string) => void }) => {
  const isTargetMatch = match.title.toLowerCase().includes('gaethje') || match.title.toLowerCase().includes('pimblett');
  const isMatchLive = isTargetMatch ? true : isLive(match.date);
  const isPopular = isTargetMatch ? true : match.popular;

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
            {isPopular && <div className="badge-popular"><Flame size={14} color="#8db902" fill="#8db902" /></div>}
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
  const [reedCombat, setReedCombat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [hiddenMatches, setHiddenMatches] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchMMA() {
      try {
        const res = await fetch(REED_API_URL);
        const data = await res.json();
        const wrestlingData = data.categories.find((c: any) => c.category === "Wrestling")?.games || [];
        const combatData = data.categories.find((c: any) => c.category === "Combat Sports")?.games || [];
        setReedCombat([...wrestlingData, ...combatData]);
      } catch (e) { console.error("API Error"); }
      setLoading(false);
    }
    fetchMMA();
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
      const hasHomeImg = m.teams?.home?.badge && m.teams.home.badge.trim() !== "";
      const hasAwayImg = m.teams?.away?.badge && m.teams.away.badge.trim() !== "";
      if (hiddenMatches.has(m.id) || !hasHomeImg || !hasAwayImg) return;

      const sid = normalizeSport(m.category, m.title);
      const isMatchLive = isLive(m.date);
      
      if (m.popular) { grouped['popular'].push(m); if (isMatchLive) counts['popular']++; }
      if (sid && grouped[sid]) { grouped[sid].push(m); if (isMatchLive) counts[sid]++; }
    });

    const gaethjeMatch = grouped['fight'].find(m => m.title.toLowerCase().includes('gaethje') || m.title.toLowerCase().includes('pimblett'));
    if (gaethjeMatch) {
      grouped['fight'] = [gaethjeMatch];
      counts['fight'] = 1; 
    } else {
      grouped['fight'] = [];
      counts['fight'] = 0;
    }

    return { grouped, counts };
  }, [matches, hiddenMatches]);

  const sportsToDisplay = [
      ...(grouped['popular'].length > 0 ? [{ id: 'popular', name: 'Popular Today', type: 'standard' }] : []),
      ...FIXED_SPORTS.filter(s => grouped[s.id].length > 0).map(s => ({ ...s, type: 'standard' }))
  ];

  if (reedCombat.length > 0) {
    const pos = Math.max(0, sportsToDisplay.length - 1);
    // Fixed Heading: Removed Royal Rumble text
    sportsToDisplay.splice(pos, 0, { id: 'reed-combat', name: 'MMA & BOXING', type: 'banner' } as any);
  }

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
            <div className="carousel-track">{Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}</div>
          ) : (
            <>
              {sportsToDisplay.map(s => (
                <section key={s.id} className="matches-section">
                  <div className="section-row-header">
                    <div className="title-block">
                      <h2 className="section-title">{s.name}</h2>
                      {counts[s.id] > 0 && <span className="live-count-tag">{counts[s.id]} LIVE</span>}
                    </div>
                  </div>
                  <div className="carousel-track">
                    {s.type === 'banner' ? 
                      reedCombat.map((game, i) => <BannerCard key={i} game={game} />) :
                      grouped[s.id].map((m, idx) => <MatchCard key={`${m.id}-${idx}`} match={m} onImageError={handleImageError} />)
                    }
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