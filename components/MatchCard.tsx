'use client'

import { MatchWithStatus, getPosterUrl } from '../lib/matches'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './MatchCard.module.css'

interface MatchCardProps {
  match: MatchWithStatus
}

function formatViews(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

function formatCountdown(targetDate: number): string {
  // Handle both seconds and milliseconds timestamps
  const targetTime = targetDate > 10000000000 ? targetDate : targetDate * 1000
  const now = Date.now()
  const diff = targetTime - now

  // Match has started - this shouldn't happen as live matches skip countdown
  if (diff <= 0) return 'Live Now'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  // Show "Starting soon" only when match is about to start (within 15 minutes)
  if (minutes < 15) return 'Starting soon'
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function MatchCard({ match }: MatchCardProps) {
  const { status, formattedDate, formattedTime, poster, title, category, views = 0, date } = match
  const isLive = status === 'live'
  const [countdown, setCountdown] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isLive && date) {
      setCountdown(formatCountdown(date))
      const interval = setInterval(() => {
        setCountdown(formatCountdown(date))
      }, 1000) // Update every second
      return () => clearInterval(interval)
    }
  }, [isLive, date])

  // Determine if this is a basketball match without a banner
  const isBasketball = category === 'basketball'
  const hasValidPoster = poster && poster.trim() !== '' && poster.trim() !== 'null' && poster.trim() !== 'undefined'
  
  // Use local ncaab banner ONLY for basketball matches that truly don't have a poster
  const posterUrl = isBasketball && !hasValidPoster 
    ? '/images/ncaab-banner.jpeg' 
    : (hasValidPoster ? getPosterUrl(poster) : '/images/ncaab-banner.jpeg')
  
  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <Link href={`/watch/${match.id}`} className={styles.matchLink}>
      <div className={styles.matchCard}>
        {/* Blurred Background */}
        <div className={styles.blurredBg}>
          <img
            src={posterUrl}
            alt=""
            className={`${styles.blurImage} ${isLoaded ? styles.blurImageLoaded : ''}`}
            loading="lazy"
          />
        </div>

        {/* Banner - Desktop Portrait, Mobile Landscape */}
        <div className={styles.bannerContainer}>
          {!isLoaded && <div className={styles.skeletonShimmer} />}
          <img
            src={posterUrl}
            alt={title}
            className={`${styles.matchBanner} ${isLoaded ? styles.matchBannerLoaded : ''}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
              setIsLoaded(true) // Hide skeleton even on error
            }}
          />

          {/* LIVE Badge - Top Left */}
          {isLive && isLoaded && (
            <div className={styles.liveBadge}>
              LIVE
            </div>
          )}

          {/* Views Badge - Bottom Right (only for live) */}
          {isLive && isLoaded && (
            <div className={styles.viewsBadge}>
              <span className={styles.viewsDot} />
              <span className={styles.viewsCount}>{formatViews(views)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.matchInfo}>
          <div className={styles.metaRow}>
            <span className={styles.matchCategory}>{categoryName}</span>
            <span className={styles.matchTime}>
              {isLive ? 'Live Now' : countdown || formattedTime}
            </span>
          </div>
          <h3 className={styles.matchTitle}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
