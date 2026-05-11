'use client'

import { MatchWithStatus, getTeamBadgeUrl } from '../lib/matches'
import { useMatches } from '../lib/matches/provider'
import { useState, useEffect } from 'react'
import styles from './MatchCard.module.css'

interface MatchCardProps {
  match: MatchWithStatus
}

function formatDate(dateMs: number): string {
  const date = new Date(dateMs)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

function formatTime(dateMs: number): string {
  return new Date(dateMs).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatCountdown(targetDate: number): string {
  const targetTime = targetDate > 10000000000 ? targetDate : targetDate * 1000
  const now = Date.now()
  const diff = targetTime - now

  if (diff <= 0) return 'LIVE'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (minutes < 15) return 'Starting soon'
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

export function MatchCard({ match }: MatchCardProps) {
  const { liveViewCounts } = useMatches()
  const { status, date, title, category, teams, views = 0 } = match
  const isLive = status === 'live'
  const [countdown, setCountdown] = useState('')

  // Use the tracked live count for all matches if available
  const displayViews = liveViewCounts[match.id] !== undefined
    ? liveViewCounts[match.id]
    : views

  useEffect(() => {
    if (!isLive && date) {
      setCountdown(formatCountdown(date))
      const interval = setInterval(() => {
        setCountdown(formatCountdown(date))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isLive, date])

  const homeBadge = teams?.home?.badge
  const awayBadge = teams?.away?.badge
  const homeName = teams?.home?.name || 'TBD'
  const awayName = teams?.away?.name || 'TBD'

  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const dateStr = date ? formatDate(date) : ''
  const timeStr = date ? formatTime(date) : ''

  return (
    <div
      className={styles.matchLink}
      onClick={() => { window.location.href = `/watch/${match.id}` }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/watch/${match.id}` }}
    >
      <div className={styles.matchCard}>
        {/* Status/Views Badge */}
        {(isLive || displayViews > 0) && (
          <div className={isLive ? styles.liveBadge : styles.popularBadge}>
            {isLive ? (
              <>
                <span className={styles.liveDot} />
                LIVE
              </>
            ) : (
              <svg className={styles.viewIcon} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
            <span className={styles.viewsCount}>{formatViews(displayViews)}</span>
          </div>
        )}

        {/* Teams Section */}
        <div className={styles.teamsSection}>
          {/* Home Team */}
          <div className={styles.team}>
            {homeBadge ? (
              <div className={styles.badgeWrapper}>
                <img
                  src={getTeamBadgeUrl(homeBadge)}
                  alt={homeName}
                  className={styles.teamBadge}
                  loading="lazy"
                />
                <div className={styles.badgeShadow} aria-hidden="true">
                  <img src={getTeamBadgeUrl(homeBadge)} alt="" aria-hidden="true" />
                </div>
              </div>
            ) : (
              <div className={styles.teamBadgePlaceholder}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <span className={styles.teamName}>{homeName}</span>
          </div>

          {/* Center Info */}
          <div className={styles.centerInfo}>
            <span className={styles.dateText}>{dateStr}</span>
            <div className={styles.centerDivider} />
            <span className={isLive ? styles.liveText : styles.timeText}>
              {isLive ? 'LIVE' : (countdown || timeStr)}
            </span>
          </div>

          {/* Away Team */}
          <div className={styles.team}>
            {awayBadge ? (
              <div className={styles.badgeWrapper}>
                <img
                  src={getTeamBadgeUrl(awayBadge)}
                  alt={awayName}
                  className={styles.teamBadge}
                  loading="lazy"
                />
                <div className={styles.badgeShadow} aria-hidden="true">
                  <img src={getTeamBadgeUrl(awayBadge)} alt="" aria-hidden="true" />
                </div>
              </div>
            ) : (
              <div className={styles.teamBadgePlaceholder}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <span className={styles.teamName}>{awayName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
