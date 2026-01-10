'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import '../../styles/matches-carousel.css'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

interface Team { name: string; badge: string; }
interface APIMatch {
    id: string; title: string; category: string; date: number;
    teams?: { home?: Team; away?: Team; }; sources: any[];
}

function getBadgeUrl(badgeId: string | undefined): string {
  if (!badgeId) return '/placeholder-badge.webp' 
  return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`
}

function isCurrentlyActive(timestamp: number): boolean {
  return timestamp <= Date.now()
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

// --- DETERMINISTIC RANDOM SHADE ---
// Generates a consistent "Random" number from 1-15 based on the Match ID string
function getCardShade(matchId: string): string {
  let hash = 0;
  for (let i = 0; i < matchId.length; i++) {
    hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Force positive number and mod 15, then +1
  const seed = (Math.abs(hash) % 15) + 1;
  return `card-shade-${seed}`;
}

interface Props {
  title: string;
  matches: APIMatch[];
}

export default function MatchesCarousel({ title, matches }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 300
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!matches || matches.length === 0) return null;

  return (
    <section className="matches-section">
      
      <div className="section-header">
        <div className="title-group">
          <h2 className="section-title">{title}</h2>
          <div className="title-accent"></div>
        </div>

        <div className="nav-controls">
          <button className="nav-btn" onClick={() => scroll('left')}><ChevronLeft width={20} /></button>
          <button className="nav-btn" onClick={() => scroll('right')}><ChevronRight width={20} /></button>
        </div>
      </div>

      <div className="carousel-wrapper">
        <div className="matches-carousel-container" ref={containerRef}>
          {matches.map((match) => {
            const live = isCurrentlyActive(match.date)
            const home = match.teams?.home
            const away = match.teams?.away
            
            // Get unique shade based on ID
            const shadeClass = getCardShade(match.id)
            
            return (
              <Link key={match.id} href={`/live/${match.id}`} className="match-card-link">
                <div className={`match-card ${shadeClass}`}>
                  
                  {/* TEAMS */}
                  <div className="match-teams">
                    <div className="team-info">
                       <img src={getBadgeUrl(home?.badge)} alt={home?.name} className="team-logo" />
                       <span className="team-name line-clamp-1">{home?.name || 'Home'}</span>
                    </div>
                    
                    <span className="vs-badge">VS</span>

                    <div className="team-info">
                       <img src={getBadgeUrl(away?.badge)} alt={away?.name} className="team-logo" />
                       <span className="team-name line-clamp-1">{away?.name || 'Away'}</span>
                    </div>
                  </div>

                  {/* META */}
                  <div className="match-meta">
                    <span className="league-name">{match.category || 'Match'}</span>
                    <span className={`time-badge ${live ? 'live-badge' : ''}`}>
                       {live ? 'LIVE' : formatTime(match.date)}
                    </span>
                  </div>

                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </section>
  )
}