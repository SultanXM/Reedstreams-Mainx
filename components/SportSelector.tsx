'use client'

import { useMatches } from '../lib/matches'

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

const SPORT_ICONS: Record<string, JSX.Element> = {
  football: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20"></path>
      <path d="M2 12h20"></path>
      <path d="M12 2v20"></path>
      <path d="M4.93 4.93l14.14 14.14"></path>
      <path d="M19.07 4.93L4.93 19.07"></path>
    </svg>
  ),
  basketball: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M5.65 5.65l12.7 12.7"></path>
      <path d="M12 2v20"></path>
      <path d="M2 12h20"></path>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
      <path d="M12 22a10 10 0 0 1-10-10"></path>
    </svg>
  ),
  baseball: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
      <path d="M12 22a10 10 0 0 1-10-10"></path>
      <path d="M8 8l8 8"></path>
      <path d="M8 16l8-8"></path>
    </svg>
  ),
  'american-football': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="14" ry="7" transform="rotate(45 12 12)"></ellipse>
      <path d="M12 2l10 10"></path>
      <path d="M12 22L2 12"></path>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  hockey: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v10"></path>
      <path d="M12 12l-4 4"></path>
      <path d="M12 12l4 4"></path>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M2 12h20"></path>
    </svg>
  ),
  cricket: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v20"></path>
      <path d="M2 12h20"></path>
      <path d="M12 2l8 8"></path>
      <path d="M12 22l-8-8"></path>
    </svg>
  ),
  'motor-sports': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="7" cy="17" r="3"></circle>
      <circle cx="17" cy="17" r="3"></circle>
      <path d="M5 17h-2v-6l5-5h6l5 5v6h-2"></path>
      <path d="M9 17v-5h6v5"></path>
    </svg>
  ),
  fight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
      <path d="M2 12V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"></path>
      <path d="M12 2v20"></path>
      <path d="M2 12h20"></path>
    </svg>
  ),
}

interface SportSelectorProps {
  onSelectSport: (sportId: string | null) => void
}

export function SportSelector({ onSelectSport }: SportSelectorProps) {
  const { selectedSport, selectSport, loading } = useMatches()

  const handleClick = (sportId: string | null) => {
    selectSport(sportId)
    onSelectSport(sportId)
  }

  return (
    <div className="sport-selector">
      {SPORTS.map((sport) => (
        <button
          key={sport.id}
          onClick={() => handleClick(sport.id)}
          disabled={loading}
          className={`sport-pill ${selectedSport === sport.id ? 'active' : ''}`}
        >
          {sport.name}
        </button>
      ))}

      <style jsx>{`
        .sport-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #1a1a2e;
          width: 100%;
        }
        .sport-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid #2a2a4e;
          background: transparent;
          color: #888;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 500;
        }
        .sport-pill:hover:not(:disabled) {
          border-color: #888;
          color: #fff;
        }
        .sport-pill.active {
          border-color: #888;
          background: #1a1a2e;
          color: #fff;
        }
        .sport-pill:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 1024px) {
          .sport-pill {
            padding: 8px 14px;
            font-size: 12px;
          }
        }
        @media (max-width: 640px) {
          .sport-selector {
            gap: 6px;
          }
          .sport-pill {
            padding: 8px 14px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}
