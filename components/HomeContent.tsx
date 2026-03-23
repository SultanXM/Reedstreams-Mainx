'use client'

import { useMatches, MatchWithStatus } from '../lib/matches'
import { MatchCard } from './MatchCard'
import { SportSelector } from './SportSelector'
import { useState, useEffect, useRef, useMemo } from 'react'

const SPORTS = [
  { id: 'football', name: 'Soccer' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'american-football', name: 'NFL' },
  { id: 'hockey', name: 'Hockey' },
  { id: 'cricket', name: 'Cricket' },
  { id: 'motor-sports', name: 'Moto Sports' },
  { id: 'fight', name: 'Fighting' },
]

export function HomeContent() {
  const { matches, loading, error, searchQuery, setSearchQuery } = useMatches()
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, number>>({})
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const searchInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle scroll for go-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadMore = (sportId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sportId]: (prev[sportId] || 20) + 20
    }))
  }

  // Filter matches: basketball always included (uses local banner if needed), others need valid poster
  const matchesWithBanners = useMemo(() => {
    return matches.filter(m => {
      // Basketball matches are always included (they can use local ncaab banner)
      if (m.category === 'basketball') return true
      // For other categories, require a valid poster
      const hasValidPoster = m.poster && m.poster.trim() !== '' && m.poster.trim() !== 'null' && m.poster.trim() !== 'undefined'
      return hasValidPoster
    })
  }, [matches])

  // Group matches by status and category - filtered by search
  // LIVE matches ONLY go to live section, NOT in category sections
  const { liveMatches, matchesByCategory } = useMemo(() => {
    // First filter by search query
    const searchedMatches = searchQuery.trim()
      ? matchesWithBanners.filter(m =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.teams?.home?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (m.teams?.away?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        )
      : matchesWithBanners

    // LIVE matches - ONLY for the Live section
    const live = searchedMatches.filter(m => m.status === 'live')
    
    // Category matches - EXPLICITLY exclude live matches
    const byCategory: Record<string, MatchWithStatus[]> = {}

    SPORTS.forEach(sport => {
      // Strict filter: must match category AND must NOT be live
      const sportMatches = searchedMatches.filter(m =>
        m.category === sport.id && m.status !== 'live'
      )
      if (sportMatches.length > 0) {
        byCategory[sport.id] = sportMatches
      }
    })

    return { liveMatches: live, matchesByCategory: byCategory }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Show typing indicator
    setIsTyping(true)

    // Debounce typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 500)
  }

  const clearSearch = () => {
    setSearchQuery('')
    searchInputRef.current?.focus()
  }

  return (
    <>
      <main className="home-main">
        <div className="content-wrapper">
          {/* Category Selector */}
          <section className="selector-section">
            <h2 className="section-heading">Categories</h2>
            <SportSelector onSelectSport={scrollToSection} />
          </section>

          {/* Error */}
          {error && (
            <div className="error-box">
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
            <div className="empty-state">
              <p className="empty-title">No matches available</p>
              <p className="empty-subtitle">Check back later for upcoming events</p>
            </div>
          )}

          {/* Empty state - search has no results */}
          {!loading && searchQuery.trim() !== '' && liveMatches.length === 0 && Object.keys(matchesByCategory).length === 0 && (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <p className="empty-title">No matches found for "{searchQuery}"</p>
              <p className="empty-subtitle">Try a different search term</p>
              <button onClick={clearSearch} className="clear-btn">Clear Search</button>
            </div>
          )}

          {/* LIVE Section */}
          {!loading && (
            <section className="matches-section" ref={el => { sectionRefs.current['live'] = el }} data-section="live">
              <SectionHeader title="Live Now" count={liveMatches.length} />
              {liveMatches.length > 0 ? (
                <div className="matches-grid">
                  {liveMatches.slice(0, visibleSections.has('live') ? liveMatches.length : 10).map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="no-live-message">
                  <p>No matches are live right now. Check below for what's big coming up!</p>
                </div>
              )}
            </section>
          )}

          {/* Category Sections */}
          {!loading && SPORTS.map(sport => {
            const sportMatches = matchesByCategory[sport.id] || []
            if (sportMatches.length === 0) return null

            const displayedCount = expandedSections[sport.id] || Math.min(20, sportMatches.length)
            const hasMore = sportMatches.length > displayedCount

            return (
              <section
                key={sport.id}
                className="matches-section"
                ref={el => { sectionRefs.current[sport.id] = el }}
                data-section={sport.id}
              >
                <SectionHeader title={sport.name} count={sportMatches.length} />
                <div className="matches-grid">
                  {sportMatches.slice(0, displayedCount).map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
                {hasMore && (
                  <div className="load-more-container">
                    <button onClick={() => loadMore(sport.id)} className="load-more-btn">
                      Load More ({sportMatches.length - displayedCount} remaining)
                    </button>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </main>

      {/* Go to Top Button */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="go-to-top-btn" aria-label="Go to top">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}

      {/* Mobile Search Bar */}
      <div className="mobile-search">
        <div className="mobile-search-wrapper">
          {isTyping ? (
            <div className="loading-spinner">
              <div className="spinner-arc"></div>
            </div>
          ) : (
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          )}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mobile-search-input"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="clear-search-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({ title, count }: { title: string; count: number }) {
  const isLive = title === 'Live Now'
  return (
    <div className="section-header">
      {isLive && <span className="live-dot" />}
      <h2 className="section-title">{title}</h2>
      <span className="section-count">{count}</span>
      <style jsx>{`
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid #1a1a2e;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: #e91916;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(233, 25, 22, 0.8), 0 0 20px rgba(233, 25, 22, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .section-count {
          font-size: 13px;
          font-weight: 600;
          color: #888;
          background: rgba(136, 136, 136, 0.1);
          padding: 3px 10px;
          border-radius: 6px;
          border: 1px solid rgba(136, 136, 136, 0.2);
        }
      `}</style>
    </div>
  )
}

// ============================================
// SECTION SKELETON
// ============================================

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="skeleton-section">
      <div className="skeleton-header">
        <div className="skeleton-title" />
        <div className="skeleton-count" />
      </div>
      <div className="skeleton-grid">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-banner" />
          </div>
        ))}
      </div>
      <style jsx>{`
        .skeleton-section {
          margin-bottom: 40px;
        }
        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1a1a2e;
        }
        .skeleton-title {
          width: 100px;
          height: 20px;
          background: #1a1a2e;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background-image: linear-gradient(90deg, #1a1a2e 25%, #252538 50%, #1a1a2e 75%);
          background-size: 200% 100%;
        }
        .skeleton-count {
          width: 30px;
          height: 16px;
          background: #1a1a2e;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          background-image: linear-gradient(90deg, #1a1a2e 25%, #252538 50%, #1a1a2e 75%);
          background-size: 200% 100%;
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .skeleton-card {
          background: #0f0f13;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #1a1a2e;
        }
        .skeleton-banner {
          aspect-ratio: 16/9;
          background: #1a1a2e;
          animation: shimmer 1.5s infinite;
          background-image: linear-gradient(90deg, #1a1a2e 25%, #252538 50%, #1a1a2e 75%);
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 1400px) {
          .skeleton-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 1024px) {
          .skeleton-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .skeleton-grid {
            grid-template-columns: 1fr;
          }
          .skeleton-card {
            display: flex;
            height: 100px;
          }
          .skeleton-banner {
            width: 160px;
            height: 100%;
            aspect-ratio: auto;
          }
        }
      `}</style>
    </section>
  )
}
