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
  ShieldAlert,
  X 
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
            <img src={hBadge as string} className="team-logo" alt={homeName} onError={() => onImageError(match.id)} />
            <span className="vs-divider">VS</span>
            <img src={aBadge as string} className="team-logo" alt={awayName} onError={() => onImageError(match.id)} />
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
  const [mounted, setMounted] = useState(false);
  const [hiddenMatches, setHiddenMatches] = useState<Set<string>>(new Set());
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [timerCount, setTimerCount] = useState(12);
  const [showDiscordPopup, setShowDiscordPopup] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(false);

    const discordTimer = setTimeout(() => setShowDiscordPopup(true), 4000);

    const ua = window.navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document)) {
      setIsAppleDevice(true);
      const countdown = setInterval(() => setTimerCount(p => p <= 1 ? 0 : p - 1), 1000);
      return () => { clearInterval(countdown); clearTimeout(discordTimer); }
    }
    return () => clearTimeout(discordTimer);
  }, []);

  const handleImageError = (matchId: string) => setHiddenMatches(prev => new Set(prev).add(matchId));

  const { grouped, counts } = useMemo(() => {
    const grouped: Record<string, APIMatch[]> = { popular: [] };
    const counts: Record<string, number> = { popular: 0 };
    FIXED_SPORTS.forEach(s => { grouped[s.id] = []; counts[s.id] = 0; });

    matches.forEach(m => {
      const hasHomeImg = m.teams?.home?.badge && m.teams.home.badge.trim() !== "";
      const hasAwayImg = m.teams?.away?.badge && m.teams.away.badge.trim() !== "";
      if (hiddenMatches.has(m.id) || !hasHomeImg || !hasAwayImg) return;

      const isMatchLive = isLive(m.date);
      if (m.popular) { grouped['popular'].push(m); if (isMatchLive) counts['popular']++; }
      const sid = normalizeSport(m.category);
      if (sid && grouped[sid]) { grouped[sid].push(m); if (isMatchLive) counts[sid]++; }
    });
    return { grouped, counts };
  }, [matches, hiddenMatches]);

  const sportsToDisplay = [
      ...(grouped['popular'].length > 0 ? [{ id: 'popular', name: 'Popular Today' }] : []),
      ...FIXED_SPORTS.filter(s => grouped[s.id].length > 0)
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="snow-wrapper">
         <div className="snow-layer layer-1"></div>
         <div className="snow-layer layer-2"></div>
         <div className="snow-layer layer-3"></div>
      </div>

      {isAppleDevice && timerCount > 0 && (
        <div className="apple-alert-box">
          <ShieldAlert size={32} color="#8db902" />
          <div style={{flex: 1}}>
             <h3 style={{color: '#fff', fontSize: '14px', fontWeight: '900', margin: 0}}>Handshake Warning</h3>
             <p style={{color: '#888', fontSize: '11px', margin: '4px 0 0 0'}}>Safari engine unstable. Use Chrome or Android.</p>
          </div>
          <div style={{color: '#8db902', fontWeight: '900'}}>{timerCount}</div>
        </div>
      )}

      {/* SLEEK CORNER POPUP */}
      {mounted && showDiscordPopup && (
        <div className="discord-floating-card">
            <button className="card-close" onClick={() => setShowDiscordPopup(false)}><X size={16} /></button>
            <div className="card-body">
                <div className="discord-mini-icon">
                    <svg viewBox="0 0 127.14 96.36" fill="white" width="24" height="24"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21h0A105.73,105.73,0,0,0,32.47,96.36,77.7,77.7,0,0,0,39.2,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.73,11.1,105.32,105.32,0,0,0,32.05-16.15h0C130.11,50.41,122.09,26.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.87,53,48.74,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91,65.69,84.69,65.69Z"/></svg>
                </div>
                <div className="card-text">
                    <p>Yo niggas, join the Discord for live backups!</p>
                    <a href="https://discord.gg/PMaUcEKV" target="_blank" rel="noopener noreferrer">Gimme the link</a>
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .discord-floating-card {
            position: fixed; bottom: 20px; right: 20px;
            background: #1c1c1c; border: 1px solid #333;
            padding: 15px; border-radius: 12px; z-index: 10000;
            width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: slideUp 0.4s ease;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .card-close { position: absolute; top: 8px; right: 8px; background: none; border: none; color: #555; cursor: pointer; }
        .card-body { display: flex; gap: 12px; align-items: center; }
        .discord-mini-icon { background: #5865F2; padding: 8px; border-radius: 10px; }
        .card-text p { color: #eee; font-size: 13px; margin: 0; font-weight: 600; }
        .card-text a { color: #8db902; font-size: 12px; font-weight: 800; text-decoration: none; margin-top: 4px; display: inline-block; }
        @media (max-width: 768px) { .discord-floating-card { width: calc(100% - 40px); left: 20px; bottom: 10px; } }
      `}</style>

      <div className="content-container">
        <section className="top-selector-area">
          <div className="section-row-header"> 
            <div className="title-block"><Trophy size={20} color="#8db902" /><h2 className="section-title">Sports Category</h2></div>
          </div>
          <div className="selector-grid">
            {!mounted || loading ? Array(8).fill(0).map((_, i) => <SkeletonPill key={i} />) : 
              FIXED_SPORTS.map(s => (
                <Link key={s.id} href={`/live-matches?sportId=${s.id}`} className="selector-pill">
                  <span className="pill-icon">{s.icon}</span><span className="pill-label">{s.name}</span>
                  {counts[s.id] > 0 && <div className="pill-count-badge">{counts[s.id]}</div>}
                </Link>
              ))
            }
          </div>
        </section>

        <div className="matches-grid-container">
          {!mounted || loading ? (
            <>
              <div className="section-row-header" style={{ border: 'none', marginBottom: '20px' }}>
                  <div style={{ width: '150px', height: '24px', background: '#1c1c1c', borderRadius: '4px' }} className="skeleton-pulse" />
              </div>
              <div className="carousel-track">{Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}</div>
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