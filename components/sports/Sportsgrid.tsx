'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Flame, Trophy } from 'lucide-react'
import '../../styles/Sportsgrid.css'

// --- CONSTANTS & CONFIGURATION ---

const BASE_URL = 'https://streamed.pk'
const API_BASE = `${BASE_URL}/api`

// Using a Map for efficient lookups is cleaner than a long if/else chain.
const SPORT_NORMALIZATION_MAP = new Map([
  ['basketball', 'basketball'], ['nba', 'basketball'],
  ['american-football', 'american-football'], ['nfl', 'american-football'],
  ['soccer', 'football'], ['football', 'football'],
  ['icehockey', 'hockey'], ['hockey', 'hockey'], ['nhl', 'hockey'],
  ['baseball', 'baseball'], ['mlb', 'baseball'],
  ['mma', 'fight'], ['ufc', 'fight'], ['fight', 'fight'], ['boxing', 'fight'], ['combat', 'fight'],
  ['motor', 'motorsport'], ['racing', 'motorsport'], ['f1', 'motorsport'], ['nascar', 'motorsport'],
  ['tennis', 'tennis'],
  ['rugby', 'rugby'],
  ['golf', 'golf'],
  ['darts', 'darts'],
  ['cricket', 'cricket'],
])

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

// --- TYPE DEFINITIONS ---

interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  popular: boolean;
  poster?: string;
  teams?: { home?: { badge: string; name: string }; away?: { badge: string; name: string } };
  sources: { source: string; id: string }[];
}

interface TwentyFourSevenGame {
  id: number;
  name: string;
  poster: string;
  video_link: string;
}

interface TwentyFourSevenCategory {
  category: string;
  games: TwentyFourSevenGame[];
}

interface SportInfo {
  id: string;
  name: string;
  icon: string;
}

interface GroupedMatches {
  [key: string]: APIMatch[];
}

interface LiveCounts {
  [key: string]: number;
}


// --- HELPER FUNCTIONS ---

const getImageUrl = (badgeId: string): string => `${API_BASE}/images/badge/${badgeId}.webp`;
const getPosterUrl = (posterId: string): string => {
  if (!posterId) return '';
  if (posterId.startsWith('http')) return posterId;
  if (posterId.startsWith('/')) return `${BASE_URL}${posterId}.webp`;
  return `${API_BASE}/images/proxy/${posterId}.webp`;
};

const isLive = (timestamp: number): boolean => {
  const now = Date.now();
  const matchTime = new Date(timestamp).getTime();
  // A match is live if it started and was less than 3 hours ago.
  return matchTime <= now && (now - matchTime) < (3 * 60 * 60 * 1000);
}

const formatTime = (timestamp: number): string => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const normalizeSport = (category: string, title: string = ''): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  const tit = title.toLowerCase();

  // Handle title-based overrides first
  if (tit.includes('ufc') || tit.includes('mma')) return 'fight';

  return SPORT_NORMALIZATION_MAP.get(cat) || '';
}

// --- SKELETON COMPONENTS ---

const SkeletonPill = () => (
  <div className="selector-pill skeleton-pill skeleton-pulse">
    <div className="skeleton-pill-icon" />
    <div className="skeleton-pill-label" />
  </div>
);

const SkeletonMatchCard = () => (
  <div className="match-card-link">
    <div className="match-card skeleton-match-card skeleton-pulse">
      <div className="match-visual">
        <div className="skeleton-logo" />
        <div className="skeleton-vs" />
        <div className="skeleton-logo" />
      </div>
      <div className="match-info">
        <div className="skeleton-title" />
        <div className="skeleton-subtitle" />
      </div>
    </div>
  </div>
);

// --- UI COMPONENTS ---

const TwentyFourSevenMatchCard = React.memo(({ match }: { match: TwentyFourSevenGame }) => {
  return (
    <Link
      href={match.video_link}
      target="_blank"
      rel="noopener noreferrer"
      className="match-card-link"
    >
      <article className="match-card">
        <div className="match-visual" style={{ padding: 0 }}>
          <img src={match.poster} alt={`${match.name} poster`} style={{objectFit: "cover", width: "100%", height: "100%", display: "block"}} />
        </div>
        <div className="match-info">
          <p className="match-main-title">{match.name}</p>
        </div>
      </article>
    </Link>
  );
});
TwentyFourSevenMatchCard.displayName = 'TwentyFourSevenMatchCard';

const MatchCard = React.memo(({ match, onImageError }: { match: APIMatch; onImageError: (id: string) => void }) => {
  const [imageError, setImageError] = useState(false);
  const isMatchLive = isLive(match.date);
  const homeName = match.teams?.home?.name || 'Home';
  const awayName = match.teams?.away?.name || 'Away';
  const homeBadgeUrl = match.teams?.home?.badge ? getImageUrl(match.teams.home.badge) : null;
  const awayBadgeUrl = match.teams?.away?.badge ? getImageUrl(match.teams.away.badge) : null;

  // Prioritize poster if available, but fallback to logos if poster fails
  const showPoster = !!match.poster && !imageError;

  return (
    <Link
      href={`/match/${match.id}`}
      className="match-card-link"
      onClick={() => sessionStorage.setItem("currentMatch", JSON.stringify(match))}
    >
      <article className="match-card">
        <div className="match-visual" style={showPoster ? { padding: 0 } : undefined}>
          <div className="card-top-row">
            <span className={`status-badge ${isMatchLive ? 'live' : 'upcoming'}`}>
              {isMatchLive ? 'LIVE' : formatTime(match.date)}
            </span>
            {match.popular && <div className="badge-popular"><Flame size={14} color="#8db902" fill="#8db902" /></div>}
          </div>
          {showPoster ? (
            <img 
              src={getPosterUrl(match.poster!)} 
              alt={match.title} 
              style={{objectFit: "cover", width: "100%", height: "100%", display: "block"}} 
              onError={() => {
                if (homeBadgeUrl && awayBadgeUrl) {
                  setImageError(true);
                } else {
                  onImageError(match.id);
                }
              }} 
            />
          ) : (
            <div className="logos-wrapper">
              {homeBadgeUrl && <img src={homeBadgeUrl} className="team-logo" alt={`${homeName} logo`} onError={() => onImageError(match.id)} />}
              <span className="vs-divider">VS</span>
              {awayBadgeUrl && <img src={awayBadgeUrl} className="team-logo" alt={`${awayName} logo`} onError={() => onImageError(match.id)} />}
            </div>
          )}
        </div>
        <div className="match-info">
          <p className="match-main-title">
            {match.teams?.home && match.teams?.away ? (
              <>{homeName} <span style={{ opacity: 0.5 }}>vs</span> {awayName}</>
            ) : (
              match.title
            )}
          </p>
          <p className="match-sub-meta">{match.category}</p>
        </div>
      </article>
    </Link>
  );
});
MatchCard.displayName = 'MatchCard';

const SportsCategorySelector = ({ sports, counts, loading }: { sports: SportInfo[], counts: LiveCounts, loading: boolean }) => (
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
        sports.map(sport => (
          <Link key={sport.id} href={`/live-matches?sportId=${sport.id}`} className="selector-pill">
            <span className="pill-icon">{sport.icon}</span>
            <span className="pill-label">{sport.name}</span>
            {counts[sport.id] > 0 && <div className="pill-count-badge">{counts[sport.id]}</div>}
          </Link>
        ))
      )}
    </div>
  </section>
);

const TwentyFourSevenCarousel = ({ section, matches }: { section: { id: string, name: string }, matches: TwentyFourSevenGame[] }) => (
    <section key={section.id} className="matches-section">
      <div className="section-row-header">
        <div className="title-block">
          <h2 className="section-title">{section.name}</h2>
        </div>
      </div>
      <div className="carousel-track">
        {matches.map(match => (
          <TwentyFourSevenMatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );

const MatchCarousel = ({ section, matches, count, onImageError }: { section: { id: string, name: string }, matches: APIMatch[], count: number, onImageError: (id: string) => void }) => (
  <section key={section.id} className="matches-section">
    <div className="section-row-header">
      <div className="title-block">
        {section.id === 'popular' && <Trophy size={20} color="var(--accent-color)" />}
        <h2 className="section-title">{section.name}</h2>
        {count > 0 && <span className="live-count-tag">{count} LIVE</span>}
      </div>
    </div>
    <div className="carousel-track">
      {matches.map(match => (
        <MatchCard key={match.id} match={match} onImageError={onImageError} />
      ))}
    </div>
  </section>
);

// --- MAIN COMPONENT ---

export default function SportsGrid({ initialData }: { initialData: APIMatch[] }) {
  const [loading, setLoading] = useState(true);
  const [hiddenMatchIds, setHiddenMatchIds] = useState<Set<string>>(new Set());
  const [twentyFourSevenStreams, setTwentyFourSevenStreams] = useState<TwentyFourSevenGame[]>([]);

  useEffect(() => {
    // If there's data, we are not loading. This simplifies the previous logic.
    if (initialData) setLoading(false);
  }, [initialData]);

  useEffect(() => {
    const fetchTwentyFourSevenStreams = async () => {
        try {
            const response = await fetch('https://reedstreams-edge-v1.fly.dev/api/v1/streams');
            const data = await response.json();
            
            let games: TwentyFourSevenGame[] = [];
            
            if (Array.isArray(data)) {
                const category = data.find((cat: any) => cat.category === '24/7 Streams');
                if (category) games = category.games;
            } else if (data && data.category === '24/7 Streams') {
                games = data.games;
            }
            
            if (games.length > 0) {
                setTwentyFourSevenStreams(games);
            }
        } catch (error) {
            console.error('Error fetching 24/7 streams:', error);
        }
    };

    fetchTwentyFourSevenStreams();
  }, []);

  const handleImageError = useCallback((matchId: string) => {
    setHiddenMatchIds(prev => new Set(prev).add(matchId));
  }, []);

  const { groupedMatches, liveCounts } = useMemo(() => {
    const grouped: GroupedMatches = { popular: [] };
    const counts: LiveCounts = { popular: 0 };

    FIXED_SPORTS.forEach(s => {
      grouped[s.id] = [];
      counts[s.id] = 0;
    });

    if (!initialData) return { groupedMatches: grouped, liveCounts: counts };

    initialData.forEach(match => {
      const hasHomeImg = !!match.teams?.home?.badge;
      const hasAwayImg = !!match.teams?.away?.badge;
      const hasPoster = !!match.poster;

      // Filter out matches with missing images or those that have errored.
      if (hiddenMatchIds.has(match.id)) {
        return;
      }

      if ((!hasHomeImg || !hasAwayImg) && !hasPoster) {
        return;
      }

      const sportId = normalizeSport(match.category, match.title);
      const isMatchLive = isLive(match.date);

      if (match.popular) {
        grouped.popular.push(match);
        if (isMatchLive) {
          counts.popular = (counts.popular || 0) + 1;
        }
      }

      if (sportId && grouped[sportId]) {
        grouped[sportId].push(match);
        if (isMatchLive) {
          counts[sportId] = (counts[sportId] || 0) + 1;
        }
      }
    });

    // NOTE: The hardcoded "Gaethje/Pimblett" fight logic has been removed.
    // The API's `popular: true` flag should be used to mark such important events.
    // This makes the component more robust and data-driven.

    return { groupedMatches: grouped, liveCounts: counts };
  }, [initialData, hiddenMatchIds]);

  const sectionsToDisplay = [
    ...(groupedMatches.popular.length > 0 ? [{ id: 'popular', name: 'Popular Today' }] : []),
    ...FIXED_SPORTS.filter(s => groupedMatches[s.id]?.length > 0)
  ];

  const twentyFourSevenSection = { id: '247-streams', name: '24/7 Streams' };

  return (
    <div className="dashboard-wrapper">
      <div className="content-container">
        <SportsCategorySelector
          sports={FIXED_SPORTS}
          counts={liveCounts}
          loading={loading}
        />

        <div className="matches-grid-container">
          {loading ? (
            Array(3).fill(0).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="skeleton-header skeleton-pulse" />
                <div className="carousel-track">
                  {Array(5).fill(0).map((_, i) => <SkeletonMatchCard key={i} />)}
                </div>
              </React.Fragment>
            ))
          ) : (
            sectionsToDisplay.map(section => (
              <MatchCarousel
                key={section.id}
                section={section}
                matches={groupedMatches[section.id]}
                count={liveCounts[section.id] || 0}
                onImageError={handleImageError}
              />
            ))
          )}
          {twentyFourSevenStreams.length > 0 && (
            <TwentyFourSevenCarousel
              section={twentyFourSevenSection}
              matches={twentyFourSevenStreams}
            />
          )}
        </div>
      </div>
    </div>
  );
}
