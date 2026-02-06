/* components/home/LiveSchedule.tsx */
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Clock, Loader } from 'lucide-react';
import '../../styles/live-schedule.css';

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api';

// --- Interfaces ---
interface Team {
  name: string;
  badge: string;
}

interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number; // Unix timestamp in milliseconds
  teams?: { home?: Team; away?: Team };
  sources?: unknown[];
}

// --- Helper Functions ---
const TOTAL_GRADIENTS = 10;

const getBadgeUrl = (badgeId: string | undefined): string => {
  if (!badgeId) return '/placeholder-logo.svg';
  return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`;
};

const isCurrentlyActive = (timestamp: number): boolean => {
  const matchTime = new Date(timestamp).getTime();
  const now = Date.now();
  return matchTime <= now && now - matchTime < 3 * 60 * 60 * 1000; // 3-hour window
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

// --- Child Components ---

const ScheduleCard: React.FC<{ match: APIMatch; index: number }> = ({ match, index }) => {
  const [homeImgError, setHomeImgError] = useState(false);
  const [awayImgError, setAwayImgError] = useState(false);

  const isActive = isCurrentlyActive(match.date);
  // Deterministic gradient based on index
  const gradientClass = `gradient-type-${(index % TOTAL_GRADIENTS) + 1}`;

  const homeTeamName = match.teams?.home?.name || 'Home';
  const awayTeamName = match.teams?.away?.name || 'Away';

  return (
    <Link key={match.id} href={`/match/${match.id}`} className="grid-card-link">
      <div className={`match-grid-card ${gradientClass}`}>
        <div className="card-content-overlay">
          <div className="card-logos-center">
            <img
              src={homeImgError ? '/placeholder-logo.svg' : getBadgeUrl(match.teams?.home?.badge)}
              alt={homeTeamName}
              className="card-badge"
              width={65}
              height={65}
              onError={() => setHomeImgError(true)}
            />
            <span className="card-vs">VS</span>
            <img
              src={awayImgError ? '/placeholder-logo.svg' : getBadgeUrl(match.teams?.away?.badge)}
              alt={awayTeamName}
              className="card-badge"
              width={65}
              height={65}
              onError={() => setAwayImgError(true)}
            />
          </div>

          <div className="card-footer">
            <h3 className="match-title-grid">{match.title}</h3>
            <span className={`card-status-badge ${isActive ? 'live' : 'upcoming'}`}>
              {isActive ? 'LIVE' : `${formatTime(match.date)} ${formatDate(match.date)}`}
              {!isActive && <Clock size={10} className="clock-icon" />}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LoadingState = () => (
    <div className="schedule-state">
        <Loader className="animate-spin" size={32} />
        <span>Loading Today's Schedule...</span>
    </div>
);

const EmptyState = () => (
    <div className="schedule-state">
        <span>No streamable matches scheduled for today.</span>
    </div>
);


// --- Main Component ---
export default function LiveSchedule() {
  const [allMatches, setAllMatches] = useState<APIMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaysMatches = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${STREAMED_API_BASE}/matches/all-today`);
        if (!res.ok) throw new Error('Failed to fetch schedule');
        const data: APIMatch[] = await res.json();
        
        const today = new Date().toISOString().slice(0, 10);
        
        // Filter for matches that are actually today and have sources
        const relevantMatches = data.filter(match => {
            const matchDay = new Date(match.date).toISOString().slice(0, 10);
            return matchDay === today && match.sources && match.sources.length > 0;
        });

        setAllMatches(relevantMatches);
      } catch (error) {
        console.error('Error loading schedule:', error);
        setAllMatches([]); // Ensure empty state on error
      } finally {
        setLoading(false);
      }
    };
    fetchTodaysMatches();
  }, []);

  const schedule = useMemo(() => {
    const grouped: Record<string, APIMatch[]> = {};
    
    // Group matches by category
    allMatches.forEach(match => {
      const category = match.category || 'Other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(match);
    });

    // Sort each group: LIVE matches first, then by date
    for (const category in grouped) {
      grouped[category].sort((a, b) => {
        const aActive = isCurrentlyActive(a.date);
        const bActive = isCurrentlyActive(b.date);
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return a.date - b.date; // Chronological sort for non-live
      });
    }

    return grouped;
  }, [allMatches]);

  if (loading) return <LoadingState />;
  if (Object.keys(schedule).length === 0) return <EmptyState />;

  return (
    <section className="schedule-section-grouped">
      {Object.entries(schedule).map(([sportCategory, matches]) => (
        <div key={sportCategory} className="sport-group">
          <h2 className="sport-group-header-grid">{sportCategory}</h2>
          <div className="match-grid">
            {matches.map((match, index) => (
              <ScheduleCard key={match.id} match={match} index={index} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
