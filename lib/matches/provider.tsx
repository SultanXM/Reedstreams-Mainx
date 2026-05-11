'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react'
import {
  APIMatch,
  MatchWithStatus,
  MatchFilter,
  Sport,
  fetchAllMatches,
  fetchSports,
  addMatchStatus,
} from './service'
import { getAllViews } from '../api'
import { useLiveViews } from '../../hooks/useLiveViews'

// ============================================
// MATCHES CONTEXT
// ============================================

interface MatchesContextType {
  matches: MatchWithStatus[]
  filteredMatches: MatchWithStatus[]
  sports: Sport[]
  loading: boolean
  error: string | null
  activeFilter: MatchFilter
  selectedSport: string | null
  searchQuery: string
  liveViewCounts: Record<string, number>
  setActiveFilter: (filter: MatchFilter) => void
  selectSport: (sport: string | null) => void
  setSearchQuery: (query: string) => void
  refresh: () => Promise<void>
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined)

export { MatchesContext }

// ============================================
// PROVIDER
// ============================================

interface MatchesProviderProps {
  children: ReactNode
}

export function MatchesProvider({ children }: MatchesProviderProps) {
  const [matches, setMatches] = useState<MatchWithStatus[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<MatchFilter>('all')
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch sports and matches
      const [sportsData, allMatches] = await Promise.all([
        fetchSports().catch(err => {
          console.warn('Failed to fetch sports:', err)
          return []
        }),
        fetchAllMatches()
      ])

      setSports(sportsData)

      // Merge API matches
      const mergedMatches = allMatches.map(match => {
        return {
          ...match,
          views: match.views || 0
        }
      })

      const sortedMatches = addMatchStatus(mergedMatches).sort((a, b) => a.date - b.date)
      setMatches(sortedMatches)
    } catch (err) {
      console.error('Failed to load matches:', err)
      setError('Failed to load matches. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await loadData()
  }, [loadData])

  const selectSport = useCallback((sport: string | null) => {
    setSelectedSport(sport)
  }, [])

  // Filter matches based on active filter, selected sport, and search query
  const filteredMatches = matches.filter(match => {
    const matchesFilter = activeFilter === 'popular'
      ? match.popular
      : activeFilter === 'all'
        ? true
        : match.status === activeFilter

    const matchesSport = selectedSport
      ? match.category === selectedSport
      : true

    const matchesSearch = searchQuery.trim() === ''
      ? true
      : match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSport && matchesSearch
  })

  // Track view counts for all matches
  // This ensures that Popular (non-live) matches can also be sorted by active view counts
  const matchIdsForViews = useMemo(
    () => matches.map(m => m.id),
    [matches]
  )
  const liveViewCounts = useLiveViews(matchIdsForViews)

  // Multiplier to make views look more "alive"
  const VIEW_MULTIPLIER = 1;

  // Merge live WebSocket view counts into matches
  const matchesWithLiveViews = useMemo(() => {
    return matches.map(match => {
      const liveCount = liveViewCounts[match.id] || 0;
      if (liveCount > 0) {
        return {
          ...match,
          views: (match.views || 0) + (liveCount * VIEW_MULTIPLIER)
        }
      }
      return match
    })
  }, [matches, liveViewCounts])

  // Update filtered matches when live view counts change
  const filteredMatchesWithLive = useMemo(() => {
    return matchesWithLiveViews.filter(match => {
      const matchesFilter = activeFilter === 'popular'
        ? match.popular
        : activeFilter === 'all'
          ? true
          : match.status === activeFilter

      const matchesSport = selectedSport
        ? match.category === selectedSport
        : true

      const matchesSearch = searchQuery.trim() === ''
        ? true
        : match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.category.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesFilter && matchesSport && matchesSearch
    })
  }, [matchesWithLiveViews, activeFilter, selectedSport, searchQuery])

  useEffect(() => {
    loadData()

    // Polling: Refresh matches from external API every 30 seconds.
    // Live view counts are handled by WebSocket (useLiveViews hook above).
    const interval = setInterval(async () => {
      try {
        const allMatches = await fetchAllMatches()

        if (!allMatches || allMatches.length === 0) return

        // Merge fresh data without affecting the "loading" state
        const mergedMatches = allMatches.map(match => {
          return {
            ...match,
            views: match.views || 0
          }
        })

        const sortedMatches = addMatchStatus(mergedMatches).sort((a, b) => a.date - b.date)
        setMatches(sortedMatches)
      } catch (err) {
        console.warn('Polling failed:', err)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loadData])

  const value: MatchesContextType = {
    matches: matchesWithLiveViews,
    filteredMatches: filteredMatchesWithLive,
    sports,
    loading,
    error,
    activeFilter,
    selectedSport,
    searchQuery,
    liveViewCounts,
    setActiveFilter,
    selectSport,
    setSearchQuery,
    refresh,
  }

  return (
    <MatchesContext.Provider value={value}>
      {children}
    </MatchesContext.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useMatches() {
  const context = useContext(MatchesContext)
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchesProvider')
  }
  return context
}
