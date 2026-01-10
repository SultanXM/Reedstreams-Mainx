'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import '../../styles/live-matches.css'

const API_BASE = 'https://streamed.pk/api'

interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  teams?: { 
    home?: { badge: string; name: string }; 
    away?: { badge: string; name: string } 
  };
}

const Snowfall = () => {
  return (
    <div className="snow-container">
      <div className="snowflake snow-layer-1" />
      <div className="snowflake snow-layer-2" />
      <div className="snowflake snow-layer-3" />
    </div>
  );
};

const getImageUrl = (badgeId: string): string => `${API_BASE}/images/badge/${badgeId}.webp`;

const isLive = (timestamp: number): boolean => {
  const now = Date.now();
  const matchTime = new Date(timestamp).getTime();
  return matchTime <= now && (now - matchTime) < (3 * 60 * 60 * 1000);
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

const MatchCard: React.FC<{ match: Match; onImageError: (id: string) => void }> = ({ match, onImageError }) => {
  const isMatchLive = isLive(match.date);
  const homeName = match.teams?.home?.name || 'Home';
  const awayName = match.teams?.away?.name || 'Away';
  const matchTitle = `${homeName} vs ${awayName}`;

  return (
    <Link 
      href={`/match/${match.id}`} 
      className="match-link"
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
    >
      <article className="match-card">
        <div className="card-body">
           <div className="team-container">
              <img 
                src={getImageUrl(match.teams!.home!.badge)} 
                className="team-logo" 
                alt={homeName} 
                onError={() => onImageError(match.id)} 
              />
              <span className="team-name">{homeName}</span>
           </div>
           <div className="vs-container">
             <span className="vs-text">VS</span>
           </div>
           <div className="team-container">
              <img 
                src={getImageUrl(match.teams!.away!.badge)} 
                className="team-logo" 
                alt={awayName} 
                onError={() => onImageError(match.id)} 
              />
              <span className="team-name">{awayName}</span>
           </div>
        </div>
        <div className="card-footer-info">
           <div className="match-info-text">
             <span className="match-description">{matchTitle}</span>
           </div>
           <div className="match-status-btn">
             {isMatchLive ? (
               <span className="status-badge live">LIVE</span>
             ) : (
               <span className="status-badge time">{formatTime(match.date)}</span>
             )}
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

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL')
  const [hiddenMatches, setHiddenMatches] = useState<Set<string>>(new Set())

  const handleImageError = (matchId: string) => {
    setHiddenMatches(prev => {
      const newSet = new Set(prev);
      newSet.add(matchId);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/matches/all-today`)
        const data: Match[] = await res.json()
        
        let validMatches = data.filter(m => {
          const hasHomeBadge = m.teams?.home?.badge && m.teams.home.badge.trim() !== '';
          const hasAwayBadge = m.teams?.away?.badge && m.teams.away.badge.trim() !== '';
          const hasSources = (m as any).sources?.length > 0;
          return hasHomeBadge && hasAwayBadge && hasSources;
        });

        if (urlSportId !== 'all') {
          validMatches = validMatches.filter(m => {
            const cat = m.category.toLowerCase().replace(/\s+/g, '');
            if (urlSportId === 'american-football') return cat.includes('nfl') || cat.includes('american');
            if (urlSportId === 'football') return (cat.includes('soccer') || cat.includes('football')) && !cat.includes('nfl') && !cat.includes('american');
            if (urlSportId === 'hockey') return cat.includes('hockey') || cat.includes('nhl');
            if (urlSportId === 'motorsport') return cat.includes('racing') || cat.includes('motor') || cat.includes('f1');
            if (urlSportId === 'mma') return cat.includes('mma') || cat.includes('ufc') || cat.includes('boxing');
            return cat.includes(urlSportId.replace(/-/g, ''));
          });
        }
        setMatches(validMatches.sort((a, b) => a.date - b.date))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchMatches()
  }, [urlSportId])

  const groupedMatches = useMemo(() => {
    const filtered = matches.filter(m => {
      if (hiddenMatches.has(m.id)) return false;
      if (filter === 'LIVE') return isLive(m.date);
      if (filter === 'UPCOMING') return !isLive(m.date) && m.date > Date.now();
      return true;
    });

    const groups: { [key: string]: Match[] } = {};
    filtered.forEach(m => {
      const label = getDateLabel(m.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(m);
    });
    return groups;
  }, [matches, hiddenMatches, filter]);

  return (
    <div className="page-wrapper">
      <Snowfall />
      <div className="page-container">
        <div className="page-header">
          <Link href="/" className="back-link">
             <ArrowLeft size={16} /> Back Home
          </Link>
          <div className="header-title-row">
            <h1 className="page-title">{urlSportName}</h1>
            <span className="match-count">{matches.length} Matches</span>
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
            {Array(8).fill(0).map((_, i) => <div key={i} className="loading-card skeleton-pulse" />)}
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
                      <MatchCard key={m.id} match={m} onImageError={handleImageError} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-page">
                <Calendar size={60} style={{ opacity: 0.3, marginBottom: '20px' }} />
                <h3>No Matches Found</h3>
                <button className="reset-btn" onClick={() => setFilter('ALL')}>Show All Matches</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}