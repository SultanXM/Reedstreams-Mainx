'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '../../../components/Navbar'
import { MatchCard } from '../../../components/MatchCard'
import { SearchBar } from '../../../components/SearchBar'
import { GoToTopButton } from '../../../components/GoToTopButton'
import { MatchesProvider, useMatches, MatchWithStatus } from '../../../lib/matches'
import styles from './SportPage.module.css'

const SPORT_NAMES: Record<string, string> = {
  'football': 'Soccer',
  'basketball': 'Basketball',
  'baseball': 'Baseball',
  'american-football': 'NFL',
  'hockey': 'Ice-Hockey',
  'cricket': 'Cricket',
  'motor-sports': 'Moto-Sports',
  'fight': 'MMA-UFC',
  'tennis': 'Tennis',
  'rugby': 'Rugby',
  'golf': 'Golf',
  'dart': 'Darts',
}

const SPORT_EMOJIS: Record<string, string> = {
  'football': '⚽',
  'basketball': '🏀',
  'baseball': '⚾',
  'american-football': '🏈',
  'hockey': '🏒',
  'cricket': '🏏',
  'motor-sports': '🏎️',
  'fight': '🥊',
  'tennis': '🎾',
  'rugby': '🏉',
  'golf': '⛳',
  'dart': '🎯',
}

export default function SportPage() {
  return (
    <MatchesProvider>
      <SportPageContent />
    </MatchesProvider>
  )
}

function SportPageContent() {
  const params = useParams()
  const sportName = params.name as string
  const { matches, loading, error } = useMatches()
  const [expandedCount, setExpandedCount] = useState(30)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'live' | 'upcoming' | 'all'>('all')

  // Filter matches for this sport
  const { liveMatches, upcomingMatches, displayedMatches } = useMemo(() => {
    // Filter by category
    let filtered = matches.filter(m => m.category === sportName)

    // Filter out TBD vs TBD matches (no real team names)
    filtered = filtered.filter(m => {
      const homeName = m.teams?.home?.name
      const awayName = m.teams?.away?.name
      const homeIsTbd = !homeName || homeName.toUpperCase() === 'TBD'
      const awayIsTbd = !awayName || awayName.toUpperCase() === 'TBD'
      return !(homeIsTbd && awayIsTbd)
    })

    // Filter out matches without valid posters (except basketball)
    if (sportName !== 'basketball') {
      filtered = filtered.filter(m =>
        m.poster && m.poster.trim() !== '' && m.poster.trim() !== 'null' && m.poster.trim() !== 'undefined'
      )
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.teams?.home?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (m.teams?.away?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    }

    // Separate by status
    const live = filtered.filter(m => m.status === 'live')
    const upcoming = filtered.filter(m => m.status === 'upcoming')

    // Sort upcoming by date
    upcoming.sort((a, b) => a.date - b.date)

    // Determine which matches to show based on filter
    let shown: typeof filtered
    if (activeFilter === 'live') shown = live
    else if (activeFilter === 'upcoming') shown = upcoming
    else shown = filtered.sort((a, b) => a.date - b.date)

    return { liveMatches: live, upcomingMatches: upcoming, displayedMatches: shown }
  }, [matches, sportName, searchQuery, activeFilter])

  const loadMore = () => {
    setExpandedCount(prev => prev + 20)
  }

  const displayedMatchesSlice = displayedMatches.slice(0, expandedCount)
  const hasMore = displayedMatches.length > expandedCount

  const sportDisplayName = SPORT_NAMES[sportName] || sportName
  const sportEmoji = SPORT_EMOJIS[sportName] || '🏆'

  // Render matches with date separators
  const renderMatchesWithDateSeparators = (matches: MatchWithStatus[]) => {
    const elements: React.ReactNode[] = []
    let lastDate = ''
    let isFirst = true

    matches.forEach((match) => {
      const matchDate = new Date(match.date)
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      let dateLabel = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      if (matchDate.toDateString() === now.toDateString()) {
        dateLabel = 'Today'
      } else if (matchDate.toDateString() === tomorrow.toDateString()) {
        dateLabel = 'Tomorrow'
      }

      if (dateLabel !== lastDate && !isFirst) {
        elements.push(
          <div key={`separator-${match.id}`} className={styles.dateSeparator}>
            <div className={styles.separatorLine} />
            <span className={styles.separatorDate}>{dateLabel}</span>
            <div className={styles.separatorLine} />
          </div>
        )
      }

      elements.push(<MatchCard key={match.id} match={match} />)
      lastDate = dateLabel
      isFirst = false
    })

    return elements
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Header */}
          <section className={styles.headerSection}>
            <a href="/" className={styles.backBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </a>
            <div className={styles.headerInfo}>
              <div className={styles.sportIdentity}>
                <span className={styles.sportEmoji}>{sportEmoji}</span>
                <h1 className={styles.headerTitle}>{sportDisplayName}</h1>
              </div>
              <p className={styles.headerCount}>
                {liveMatches.length > 0 && (
                  <span className={styles.liveCount}>
                    <span className={styles.liveDot} />{liveMatches.length} LIVE
                  </span>
                )}
                {upcomingMatches.length} upcoming · {displayedMatches.length} total
              </p>
            </div>
            <div className={styles.filterTabs}>
              <button
                onClick={() => { setActiveFilter('all'); setExpandedCount(30); }}
                className={`${styles.filterTab} ${activeFilter === 'all' ? styles.filterTabActive : ''}`}
              >
                All
              </button>
              <button
                onClick={() => { setActiveFilter('live'); setExpandedCount(30); }}
                className={`${styles.filterTab} ${activeFilter === 'live' ? styles.filterTabActive : ''}`}
              >
                <span className={styles.liveTabDot} />
                Live
              </button>
              <button
                onClick={() => { setActiveFilter('upcoming'); setExpandedCount(30); }}
                className={`${styles.filterTab} ${activeFilter === 'upcoming' ? styles.filterTabActive : ''}`}
              >
                Upcoming
              </button>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <section className={styles.skeletonSection}>
              <div className={styles.skeletonHeader}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonCount} />
              </div>
              <div className={styles.matchesGrid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonMatchCard key={i} />
                ))}
              </div>
            </section>
          )}

          {/* Matches Section */}
          {!loading && displayedMatches.length > 0 && (
            <section className={styles.matchesSection}>
              <div className={styles.sectionHeader}>
                {activeFilter === 'live' && <span className={styles.liveDot} />}
                {activeFilter === 'upcoming' && (
                  <svg className={styles.upcomingIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                )}
                {activeFilter === 'all' && (
                  <svg className={styles.sectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                )}
                <h2 className={styles.sectionTitle}>
                  {activeFilter === 'live' ? 'Live Now' : activeFilter === 'upcoming' ? 'Upcoming' : 'All Matches'}
                </h2>
                <span className={styles.sectionCount}>{displayedMatches.length}</span>
              </div>
              <div className={styles.matchesGrid}>
                {renderMatchesWithDateSeparators(displayedMatchesSlice)}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className={styles.loadMoreContainer}>
                  <button onClick={loadMore} className={styles.loadMoreBtn}>
                    Load More ({displayedMatches.length - expandedCount} remaining)
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Empty State */}
          {!loading && displayedMatches.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No matches found</p>
              <p className={styles.emptySubtitle}>
                {activeFilter === 'live' ? 'No live matches right now' : 'Try a different filter'}
              </p>
            </div>
          )}
        </div>
      </main>

      <GoToTopButton />
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={`Search ${sportDisplayName} matches...`} />
    </>
  )
}

// ============================================
// SKELETON MATCH CARD
// ============================================

function SkeletonMatchCard() {
  return (
    <div className="skeleton-match-card">
      <div className="skeleton-teams">
        <div className="skeleton-team">
          <div className="skeleton-badge" />
          <div className="skeleton-name" />
        </div>
        <div className="skeleton-center">
          <div className="skeleton-date" />
          <div className="skeleton-divider" />
          <div className="skeleton-time" />
        </div>
        <div className="skeleton-team">
          <div className="skeleton-badge" />
          <div className="skeleton-name" />
        </div>
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-title-line" />
        <div className="skeleton-category" />
      </div>
    </div>
  )
}
