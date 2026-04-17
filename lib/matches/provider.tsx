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
      // Fetch sports, matches and views in parallel
      const [sportsData, allMatches, customViews] = await Promise.all([
        fetchSports(),
        fetchAllMatches(),
        getAllViews()
      ])

      setSports(sportsData)

      // Merge custom views with API matches
      const mergedMatches = allMatches.map(match => {
        const customView = customViews.find(v => v.match_id === match.id)
        return {
          ...match,
          views: (match.views || 0) + (customView?.views || 0)
        }
      })

      const sortedMatches = addMatchStatus(mergedMatches).sort((a, b) => a.date - b.date)
      setMatches(sortedMatches)
    } catch (err) {
      console.error('Failed to load matches:', err)
      // Set error state to inform the user
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

  // WebSocket: track live view counts for LIVE matches
  const liveMatchIds = useMemo(
    () => matches.filter(m => m.status === 'live').map(m => m.id),
    [matches]
  )
  const liveViewCounts = useLiveViews(liveMatchIds)

  // Merge live WebSocket view counts into matches
  // The live count replaces the custom view portion for live matches
  const matchesWithLiveViews = useMemo(() => {
    return matches.map(match => {
      if (match.status === 'live' && liveViewCounts[match.id] !== undefined) {
        // For live matches, use the WebSocket count as the custom view portion
        // This gets added to the streamed.pk API views
        return {
          ...match,
          views: (match.views || 0) - (liveViewCounts[match.id] > 0 ? 0 : 0) + liveViewCounts[match.id]
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
        console.error('Failed to poll matches:', err)
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
