'use client'

import { useMatches } from '../lib/matches'
import { useRouter } from 'next/navigation'
import styles from './SportSelector.module.css'

const SPORTS = [
  { id: 'football', name: 'Soccer', emoji: '⚽' },
  { id: 'basketball', name: 'Basketball', emoji: '🏀' },
  { id: 'baseball', name: 'Baseball', emoji: '⚾' },
  { id: 'american-football', name: 'NFL', emoji: '🏈' },
  { id: 'hockey', name: 'Ice-Hockey', emoji: '🏒' },
  { id: 'cricket', name: 'Cricket', emoji: '🏏' },
  { id: 'motor-sports', name: 'Moto-Sports', emoji: '🏎️' },
  { id: 'fight', name: 'MMA-UFC', emoji: '🥊' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾' },
  { id: 'rugby', name: 'Rugby', emoji: '🏉' },
  { id: 'golf', name: 'Golf', emoji: '⛳' },
  { id: 'dart', name: 'Darts', emoji: '🎯' },
]

interface SportSelectorProps {
  onSelectSport: (sportId: string | null) => void
}

export function SportSelector({ onSelectSport }: SportSelectorProps) {
  const router = useRouter()
  const { selectedSport, selectSport, loading } = useMatches()

  const handleClick = (sportId: string) => {
    selectSport(sportId)
    onSelectSport(sportId)
    router.push(`/sport/${sportId}`)
  }

  return (
    <div className={styles.sportSelector}>
      <div className={styles.sportScrollContainer}>
        {SPORTS.map((sport) => (
          <button
            key={sport.id}
            onClick={() => handleClick(sport.id)}
            disabled={loading}
            className={`${styles.sportCard} ${selectedSport === sport.id ? styles.sportCardActive : ''}`}
          >
            <div className={styles.sportEmoji}>{sport.emoji}</div>
            <span className={styles.sportName}>{sport.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
