'use client'

import { useMatches, MatchFilter } from '../lib/matches'

export function MatchesFilter() {
  const { activeFilter, setActiveFilter, matches, loading } = useMatches()

  // we need to count matches by status, right?
  const counts = {
    all: matches.length,
    live: matches.filter(m => m.status === 'live').length,
    upcoming: matches.filter(m => m.status === 'upcoming').length,
    popular: matches.filter(m => m.popular).length,
  }

  const filters: { id: MatchFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'popular', label: 'Popular' },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '16px 0',
    }}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id
        const count = counts[filter.id]
        
        return (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: isActive ? 'none' : '1px solid #1a1a2e',
              background: isActive ? '#888' : 'transparent',
              color: isActive ? '#000' : '#9ca3af',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive && !loading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = '#2a2a4e'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#1a1a2e'
              }
            }}
          >
            <span>{filter.label}</span>
            {count > 0 && (
              <span style={{
                background: isActive ? 'rgba(0,0,0,0.2)' : '#1a1a2e',
                color: isActive ? '#000' : '#6b7280',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
