'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Direct WebSocket connection to the backend (bypasses Next.js HTTP proxy)
// The API proxy only supports HTTP, not WebSocket upgrades.
const WS_BACKEND_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://187.127.106.231:8080'

interface ViewCountMessage {
  type: 'view_count'
  match_id: string
  count: number
}

/**
 * Hook that manages WebSocket connections for live view counts.
 * Connects directly to the backend WebSocket endpoint for each live match ID.
 * Returns a map of match_id → live viewer count.
 *
 * Automatically reconnects on disconnect and cleans up when match IDs change.
 */
export function useLiveViews(matchIds: string[]): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const wsRefs = useRef<Map<string, WebSocket>>(new Map())

  const connect = useCallback((matchId: string) => {
    // Don't double-connect
    if (wsRefs.current.has(matchId)) return

    const url = `${WS_BACKEND_URL}/ws/views/${matchId}`

    try {
      const ws = new WebSocket(url)
      wsRefs.current.set(matchId, ws)

      ws.onmessage = (event) => {
        try {
          const data: ViewCountMessage = JSON.parse(event.data)
          if (data.type === 'view_count') {
            setCounts(prev => ({ ...prev, [data.match_id]: data.count }))
          }
        } catch {
          // Ignore parse errors
        }
      }

      ws.onclose = () => {
        wsRefs.current.delete(matchId)
        // Reconnect after 2 seconds (match might still be live)
        setTimeout(() => {
          if (matchIds.includes(matchId)) {
            connect(matchId)
          }
        }, 2000)
      }

      ws.onerror = () => {
        // Will be handled by onclose
      }
    } catch {
      // WebSocket not supported or other error
    }
  }, [matchIds])

  const disconnect = useCallback((matchId: string) => {
    const ws = wsRefs.current.get(matchId)
    if (ws) {
      ws.close()
      wsRefs.current.delete(matchId)
    }
  }, [])

  useEffect(() => {
    // Connect to all match IDs
    matchIds.forEach(id => connect(id))

    // Cleanup: disconnect any match IDs that are no longer in the list
    const currentIds = new Set(matchIds)
    wsRefs.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        disconnect(id)
      }
    })

    return () => {
      // On unmount, disconnect everything
      wsRefs.current.forEach((_, id) => disconnect(id))
    }
  }, [matchIds, connect, disconnect])

  return counts
}
