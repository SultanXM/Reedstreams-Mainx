'use client'

import { useState, useEffect, useCallback } from 'react'

const API_URL = 'https://reedstreams-edge-v2.fly.dev/api/v1/streams'

interface Game {
  id: number
  name: string
  poster: string
  start_time: number
  end_time: number
  video_link: string
  category: string
}

interface Category {
  category: string
  games: Game[]
}

interface ApiResponse {
  categories?: Category[]
}

export default function StatusPage() {
  const [status, setStatus] = useState<'checking' | 'up' | 'down'>('checking')
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [gameCount, setGameCount] = useState<number>(0)

  const checkApi = useCallback(async () => {
    setStatus('checking')
    
    try {
      const res = await fetch(API_URL)
      
      if (!res.ok) {
        setStatus('down')
        setLastCheck(new Date())
        return
      }
      
      const data: ApiResponse = await res.json()
      
      if (
        data.categories && 
        Array.isArray(data.categories) && 
        data.categories.length > 0 &&
        data.categories[0].games &&
        Array.isArray(data.categories[0].games)
      ) {
        setStatus('up')
        const totalGames = data.categories.reduce((acc, cat) => acc + (cat.games?.length || 0), 0)
        setGameCount(totalGames)
      } else {
        setStatus('down')
      }
    } catch (err) {
      setStatus('down')
    }
    
    setLastCheck(new Date())
  }, [])

  useEffect(() => {
    checkApi()
    const interval = setInterval(checkApi, 30000)
    return () => clearInterval(interval)
  }, [checkApi])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
      }}>
        {status === 'checking' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#666', 
              fontSize: '18px',
              margin: 0,
            }}>
              Checking status...
            </p>
          </div>
        )}

        {status === 'up' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#8db902', 
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 12px 0',
              lineHeight: 1.3,
            }}>
              Service Operational
            </p>
            <p style={{ 
              color: '#444', 
              fontSize: '14px',
              margin: 0,
            }}>
              {gameCount} streams available
            </p>
          </div>
        )}

        {status === 'down' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#ef4444', 
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 12px 0',
              lineHeight: 1.3,
            }}>
              Service Unavailable
            </p>
            <p style={{ 
              color: '#666', 
              fontSize: '14px',
              margin: '0 0 4px 0',
            }}>
              Please try again later
            </p>
          </div>
        )}

        <div style={{
          marginTop: '60px',
          textAlign: 'center',
        }}>
          <button
            onClick={checkApi}
            disabled={status === 'checking'}
            style={{
              background: 'transparent',
              border: 'none',
              color: status === 'checking' ? '#333' : '#444',
              cursor: status === 'checking' ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              padding: '8px 16px',
            }}
          >
            {status === 'checking' ? 'Checking...' : 'Refresh'}
          </button>
          
          {lastCheck && (
            <p style={{
              color: '#222',
              fontSize: '11px',
              margin: '8px 0 0 0',
            }}>
              Last checked: {lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
