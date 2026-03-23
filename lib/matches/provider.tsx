'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { 
  APIMatch, 
  MatchWithStatus, 
  MatchFilter, 
  Sport,
  fetchAllMatches,
  fetchLiveMatches,
  fetchPopularMatches,
  fetchSports,
  addMatchStatus,
  filterMatches 
} from './service'
import { getAllViews } from '../api'

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
      setError('Failed to load matches. Please try again.')
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

  useEffect(() => {
    loadData()
    
    // Live Polling: Refresh both API and Custom view counts every 30 seconds
    const interval = setInterval(async () => {
      try {
        const [allMatches, customViews] = await Promise.all([
          fetchAllMatches(),
          getAllViews()
        ])
        
        // Merge fresh data without affecting the "loading" state
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
        console.error('Failed to poll views:', err)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loadData])

  const value: MatchesContextType = {
    matches,
    filteredMatches,
    sports,
    loading,
    error,
    activeFilter,
    selectedSport,
    searchQuery,
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
