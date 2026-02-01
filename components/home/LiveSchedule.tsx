/* components/home/LiveSchedule.tsx */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import '../../styles/live-schedule.css'

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api'

// Define the expected Team/Match structure from your API doc
interface Team { name: string; badge: string; }
interface APIMatch {
    id: string; title: string; category: string; date: number; // Unix timestamp in milliseconds
    teams?: { home?: Team; away?: Team; }; sources: any[];
}

// --- HELPERS ---
const TOTAL_GRADIENTS = 10;
const GRADIENT_CLASSES = Array.from({ length: TOTAL_GRADIENTS }, (_, i) => `gradient-type-${i + 1}`);

function getBadgeUrl(badgeId: string | undefined): string {
  if (!badgeId) return '/placeholder-badge.webp' 
  return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`
}

/**
 * Ensures the match date is precisely 'Today' by comparing the UTC calendar date string.
 * This is the ultimate filter against future matches.
 */
function isMatchToday(timestamp: number): boolean {
    const now = new Date();
    const matchDate = new Date(timestamp);
    
    // Compare YYYY-MM-DD in UTC to ensure calendar day match
    const todayUTC = now.toISOString().slice(0, 10);
    const matchDayUTC = matchDate.toISOString().slice(0, 10);
    
    return todayUTC === matchDayUTC;
}

function isCurrentlyActive(timestamp: number): boolean {
  return timestamp <= Date.now()
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

/** NEW: Formats the date for display (e.g., Dec 07) */
function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
}

function getRandomGradientClass(index: number): string {
  const seed = Math.floor(Math.random() * (TOTAL_GRADIENTS + 1)); 
  if (seed === 0) {
    return ''; // Solid Black
  } else {
    return GRADIENT_CLASSES[seed - 1] || ''; 
  }
}

// --- MAIN COMPONENT ---
export default function LiveSchedule() {
  const [schedule, setSchedule] = useState<Record<string, APIMatch[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STREAMED_API_BASE}/matches/all-today`)
        const allMatches: APIMatch[] = await res.json()

        // FILTER: Guarantee only today's matches appear
        const filteredMatches = allMatches.filter(match => isMatchToday(match.date)); 

        const groupedMatches: Record<string, APIMatch[]> = {}

        filteredMatches.forEach(match => {
          if (match.sources && match.sources.length > 0) {
            const category = match.category || 'Other' 
            if (!groupedMatches[category]) groupedMatches[category] = []
            groupedMatches[category].push(match)
          }
        })

        // Sort each group: LIVE (Active) matches first, then chronological
        Object.keys(groupedMatches).forEach(category => {
          groupedMatches[category].sort((a, b) => {
            const aActive = isCurrentlyActive(a.date)
            const bActive = isCurrentlyActive(b.date)
            
            if (aActive && !bActive) return -1
            if (!aActive && bActive) return 1
            
            return a.date - b.date
          })
        })

        setSchedule(groupedMatches)

      } catch (error) {
        console.error('Error loading schedule:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  if (loading) return <div className="text-center p-10 py-20 text-[#555]">Loading Today's Schedule...</div>

  if (Object.keys(schedule).length === 0) {
    return <div className="text-center p-10 py-20 text-[#555]">No streamable matches scheduled for today.</div>
  }

  return (
    <section className="schedule-section-grouped">
      
      {Object.entries(schedule).map(([sportCategory, matches]) => (
        <div key={sportCategory} className="sport-group">
          
          <h2 className="sport-group-header-grid">{sportCategory}</h2>

          <div className="match-grid">
            {matches.map((match: APIMatch, index) => {
              const active = isCurrentlyActive(match.date)
              const homeTeamBadge = match.teams?.home?.badge
              const awayTeamBadge = match.teams?.away?.badge
              
              const gradientClass = getRandomGradientClass(index);
              
              return (
                <Link 
                  key={match.id} 
                  href={`/live/${match.id}`} 
                  className="grid-card-link"
                >
                  <div className={`match-grid-card ${gradientClass}`}>
                    
                    <div className="card-content-overlay">
                      
                      <div className="card-logos-center">
                        <img src={getBadgeUrl(homeTeamBadge)} alt={match.teams?.home?.name || 'Home'} className="card-badge" width={65} height={65} />
                        <span className="card-vs">VS</span>
                        <img src={getBadgeUrl(awayTeamBadge)} alt={match.teams?.away?.name || 'Away'} className="card-badge" width={65} height={65} />
                      </div>

                      <div className="card-footer">
                        <h3 className="match-title-grid">
                          {match.title}
                        </h3>
                        
                        <span 
                          className="card-status-badge"
                          style={{ backgroundColor: active ? '#8db902' : '#2a2e38', color: active ? '#000' : '#a0aec0' }}
                        >
                          {active ? 'LIVE' : `${formatTime(match.date)} ${formatDate(match.date)}`}
                          {!active && <Clock size={10} style={{ display: 'inline', marginLeft: '3px', verticalAlign: 'middle' }} />}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}