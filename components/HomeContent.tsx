'use client'

import { useMatches, MatchWithStatus } from '../lib/matches'
import { MatchCard } from './MatchCard'
import { SportSelector } from './SportSelector'
import { SearchBar } from './SearchBar'
import { GoToTopButton } from './GoToTopButton'
import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './HomeContent.module.css'

export function HomeContent() {
  const { matches, loading, error, searchQuery, setSearchQuery } = useMatches()
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Record<string, number>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const loadMore = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: (prev[section] || 20) + 20
    }))
  }

  // Filter matches: basketball always included (uses local banner if needed), others need valid poster
  // Also filter out matches with "DB" in the title and matches without team logos
  const matchesWithBanners = useMemo(() => {
    return matches.filter(m => {
      // Filter out matches with "DB" in title
      if (m.title.toUpperCase().includes('DB')) return false
      // Filter out TBD vs TBD matches (no real team names)
      const homeName = m.teams?.home?.name
      const awayName = m.teams?.away?.name
      // Filter if both teams are TBD or missing
      const homeIsTbd = !homeName || homeName.toUpperCase() === 'TBD'
      const awayIsTbd = !awayName || awayName.toUpperCase() === 'TBD'
      if (homeIsTbd && awayIsTbd) return false
      // Filter out matches without team logos/badges on home page
      const hasHomeBadge = m.teams?.home?.badge && m.teams.home.badge.trim() !== ''
      const hasAwayBadge = m.teams?.away?.badge && m.teams.away.badge.trim() !== ''
      if (!hasHomeBadge && !hasAwayBadge) return false
      // Basketball matches are always included (they can use local ncaab banner)
      if (m.category === 'basketball') return true
      // For other categories, require a valid poster
      const hasValidPoster = m.poster && m.poster.trim() !== '' && m.poster.trim() !== 'null' && m.poster.trim() !== 'undefined'
      return hasValidPoster
    })
  }, [matches])

  // Group matches: LIVE and POPULAR only
  const { liveMatches, popularMatches } = useMemo(() => {
    // Double check: filter out DB titles again
    const noDbMatches = matchesWithBanners.filter(m => !m.title.toUpperCase().includes('DB'))

    // First filter by search query
    const searchedMatches = searchQuery.trim()
      ? noDbMatches.filter(m =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.teams?.home?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (m.teams?.away?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        )
      : noDbMatches

    // LIVE matches - Max 5 per sport, ranked by inverse count (fewer = higher rank)
    const allLive = searchedMatches.filter(m => m.status === 'live')
    
    // Group live matches by sport
    const liveBySport: Record<string, MatchWithStatus[]> = {}
    allLive.forEach(match => {
      const sport = match.category
      if (!liveBySport[sport]) liveBySport[sport] = []
      liveBySport[sport].push(match)
    })
    
    // Sort sports by inverse count (fewer matches = higher priority)
    const sortedSports = Object.entries(liveBySport).sort((a, b) => a[1].length - b[1].length)
    
    // Take max 5 from each sport, maintain sorted order
    const live: MatchWithStatus[] = []
    sortedSports.forEach(([sport, matches]) => {
      live.push(...matches.slice(0, 5))
    })

    // POPULAR matches - EXPLICITLY exclude live matches (they have their own section)
    let popular = searchedMatches.filter(m =>
      m.popular === true && m.status !== 'live'
    )

    // If not searching, apply content restrictions to popular matches
    if (!searchQuery.trim()) {
      // Separate cricket/motor-sports from other sports
      const restrictedSports = ['cricket', 'motor-sports']
      const otherSports = popular.filter(m => !restrictedSports.includes(m.category))
      const restrictedMatches = popular.filter(m => restrictedSports.includes(m.category))

      // Top 20: Only other sports (no cricket/motor-sports)
      const top20 = otherSports.slice(0, 20)

      // Remaining 10: Can include cricket/motor-sports
      const remaining = [...otherSports.slice(20), ...restrictedMatches].slice(0, 10)

      // Combine: top 20 + 10 more (max 30 total)
      popular = [...top20, ...remaining]
    } else {
      // When searching, just limit to 30
      popular = popular.slice(0, 30)
    }

    return { liveMatches: live, popularMatches: popular }
  }, [matchesWithBanners, searchQuery])

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section')
            if (sectionId) {
              setVisibleSections(prev => new Set(Array.from(prev).concat(sectionId)))
            }
          }
        })
      },
      { rootMargin: '100px' }
    )

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [matches])

  const scrollToSection = (sportId: string | null) => {
    setSearchQuery('')
    if (sportId === null) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const ref = sectionRefs.current[sportId]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

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

      // Only add separator when date changes (skip first "Today")
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
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Category Selector */}
          <section className={styles.selectorSection}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <h2 className={styles.sectionHeading}>Categories</h2>
            </div>
            <SportSelector onSelectSport={scrollToSection} />
          </section>

          {/* Error */}
          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <>
              <SectionSkeleton title="Live" />
              <SectionSkeleton title="Matches" />
            </>
          )}

          {/* Empty state - no matches at all */}
          {!loading && matchesWithBanners.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No matches available</p>
              <p className={styles.emptySubtitle}>Check back later for upcoming events</p>
            </div>
          )}

          {/* Empty state - search has no results */}
          {!loading && searchQuery.trim() !== '' && liveMatches.length === 0 && popularMatches.length === 0 && (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <p className={styles.emptyTitle}>No matches found for "{searchQuery}"</p>
              <p className={styles.emptySubtitle}>Try a different search term</p>
              <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>Clear Search</button>
            </div>
          )}

          {/* LIVE Section */}
          {!loading && (
            <section className={styles.matchesSection} ref={el => { sectionRefs.current['live'] = el }} data-section="live">
              <SectionHeader title="Live Now" count={liveMatches.length} />
              {liveMatches.length > 0 ? (
                <div className={styles.matchesGrid}>
                  {renderMatchesWithDateSeparators(liveMatches.slice(0, visibleSections.has('live') ? liveMatches.length : 10))}
                </div>
              ) : (
                <div className={styles.noLiveMessage}>
                  <p>No matches are live right now. Check below for what's big coming up!</p>
                </div>
              )}
            </section>
          )}

          {/* POPULAR Section */}
          {!loading && (
            <section className={styles.matchesSection} ref={el => { sectionRefs.current['popular'] = el }} data-section="popular">
              <SectionHeader title="Popular" count={popularMatches.length} />
              {popularMatches.length > 0 ? (
                <div className={styles.matchesGrid}>
                  {renderMatchesWithDateSeparators(popularMatches)}
                </div>
              ) : (
                <div className={styles.noLiveMessage}>
                  <p>No popular matches available at the moment.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <GoToTopButton />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
    </>
  )
}

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({ title, count }: { title: string; count: number }) {
  const isLive = title === 'Live Now'
  const isPopular = title === 'Popular'
  return (
    <div className={styles.sectionHeader}>
      {isLive && <span className={styles.liveDot} />}
      {isPopular && (
        <svg className={styles.sectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )}
      <h2 className={styles.sectionTitle}>{title}</h2>
      <span className={styles.sectionCount}>{count}</span>
    </div>
  )
}

// ============================================
// SECTION SKELETON
// ============================================

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className={styles.skeletonSection}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonCount} />
      </div>
      <div className={styles.matchesGrid}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonMatchCard key={i} />
        ))}
      </div>
    </section>
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
