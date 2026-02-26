'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Activity, RefreshCw } from 'lucide-react'

const API_URL = 'https://reedstreams-edge-v1.fly.dev/api/v1/streams'

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
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [gameCount, setGameCount] = useState<number>(0)

  const checkApi = useCallback(async () => {
    setStatus('checking')
    const startTime = performance.now()
    
    try {
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      const endTime = performance.now()
      setResponseTime(Math.round(endTime - startTime))
      
      if (!res.ok) {
        setStatus('down')
        setLastCheck(new Date())
        return
      }
      
      const data: ApiResponse = await res.json()
      
      // check if response looks right
      if (
        data.categories && 
        Array.isArray(data.categories) && 
        data.categories.length > 0 &&
        data.categories[0].games &&
        Array.isArray(data.categories[0].games)
      ) {
        setStatus('up')
        // count total games
        const totalGames = data.categories.reduce((acc, cat) => acc + (cat.games?.length || 0), 0)
        setGameCount(totalGames)
      } else {
        setStatus('down')
      }
    } catch (err) {
      setStatus('down')
      setResponseTime(null)
    }
    
    setLastCheck(new Date())
  }, [])

  // check on mount and every 30 seconds
  useEffect(() => {
    checkApi()
    const interval = setInterval(checkApi, 30000)
    return () => clearInterval(interval)
  }, [checkApi])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Activity size={48} color="#8db902" style={{ marginBottom: '16px' }} />
          <h1 style={{
            color: '#fff',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
          }}>
            ReedStreams Status
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            API: {API_URL}
          </p>
        </div>

        {/* Status Card */}
        <div style={{
          background: '#141414',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid #222',
          marginBottom: '24px',
        }}>
          {status === 'checking' && (
            <div>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <RefreshCw size={40} color="#8db902" className="spin" />
              </div>
              <h2 style={{ color: '#fff', margin: '0 0 8px 0' }}>Checking API...</h2>
              <p style={{ color: '#666', margin: 0 }}>Hold up bro</p>
            </div>
          )}

          {status === 'up' && (
            <div>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(141, 185, 2, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <CheckCircle size={40} color="#8db902" />
              </div>
              <h2 style={{ 
                color: '#8db902', 
                margin: '0 0 16px 0',
                fontSize: '24px',
              }}>
                Everything is alright enjoy streams
              </h2>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                color: '#666',
                fontSize: '14px',
              }}>
                <span>🎮 {gameCount} games live</span>
                {responseTime && <span>⚡ {responseTime}ms</span>}
              </div>
            </div>
          )}

          {status === 'down' && (
            <div>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <XCircle size={40} color="#ef4444" />
              </div>
              <h2 style={{ 
                color: '#ef4444', 
                margin: '0 0 16px 0',
                fontSize: '22px',
                fontWeight: 'bold',
              }}>
                fuck fuck bro server down
              </h2>
              <p style={{ color: '#666', margin: '0 0 8px 0' }}>
                in from sultan
              </p>
              <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>
                (sultan is probably fixing it dont worry)
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#444',
          fontSize: '12px',
        }}>
          <span>
            Last check: {lastCheck ? formatTime(lastCheck) : 'never'}
          </span>
          <button
            onClick={checkApi}
            disabled={status === 'checking'}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#666',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: status === 'checking' ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: status === 'checking' ? 0.5 : 1,
            }}
          >
            <RefreshCw size={14} /> Check Now
          </button>
        </div>

        {/* Auto refresh indicator */}
        <p style={{ color: '#333', fontSize: '11px', marginTop: '16px' }}>
          Auto-refreshes every 30 seconds
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
