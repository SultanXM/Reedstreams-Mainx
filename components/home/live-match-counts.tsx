'use client'

import { useState, useEffect } from 'react'

interface Sport {
  id: string
  name: string
}

export default function LiveMatchCounts() {
  const [isOpen, setIsOpen] = useState(false)
  const [sports, setSports] = useState<Array<Sport & { count: number }>>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sports')
        const sportsData = await res.json()
        
        const sportsWithCounts = await Promise.all(
          sportsData.map(async (sport: Sport) => {
            const matchRes = await fetch(`/api/matches/${sport.id}`)
            const matches = await matchRes.json()
            return { ...sport, count: Array.isArray(matches) ? matches.length : 0 }
          })
        )
        
        setSports(sportsWithCounts)
      } catch (error) {
        // console.error('Error fetching sports:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <>
      <div 
        className="floating-match-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-broadcast-tower"></i>
        <span className="live-pulse"></span>
      </div>

      {isOpen && (
        <div className="live-match-counts">
          <div className="counts-header">
            <div className="live-indicator">
              <div className="pulse-dot"></div>
              <span>LIVE MATCHES</span>
            </div>
            <button 
              className="close-match-counts"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div id="sports-container">
            {sports.map(sport => (
              <div key={sport.id} className="sport-count-item">
                <span className="sport-name">{sport.name}</span>
                <span className="sport-count">{sport.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
