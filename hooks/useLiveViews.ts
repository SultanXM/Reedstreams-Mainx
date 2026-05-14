'use client'

import { useEffect, useState } from 'react'
import { SERVICE_API_BASE } from '../lib/serviceApi'

const PING_INTERVAL = 30000; // 30 seconds

interface AllViewsResponse {
  views: Record<string, number>
}

/**
 * Hook that manages live view counts via HTTP pings.
 * Fetches all counts periodically to update the UI.
 */
export function useLiveViews(matchIds: string[]): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const res = await fetch(`${SERVICE_API_BASE}/views/all`)
        if (res.ok) {
          const data: AllViewsResponse = await res.json()
          setCounts(data.views)
        }
      } catch (err) {
        console.warn('Failed to fetch all view counts', err)
      }
    }

    fetchAllCounts()
    const interval = setInterval(fetchAllCounts, 30000) // Refresh list every 30s
    return () => clearInterval(interval)
  }, [matchIds]) // Included matchIds just to be safe, though not strictly needed for 'all'

  return counts
}

/**
 * Hook to be used on the Watch Page to ping the backend for a specific match.
 */
export function useTrackMatchView(matchId: string | undefined) {
    useEffect(() => {
        if (!matchId) return;

        const sendPing = async () => {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)
                
                await fetch(`${SERVICE_API_BASE}/ping`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ match_id: matchId }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId)
            } catch (err) {
                console.warn('View count ping failed', err);
            }
        };

        // Initial ping
        sendPing();

        // Setup interval
        const interval = setInterval(sendPing, PING_INTERVAL);

        return () => clearInterval(interval);
    }, [matchId]);
}
