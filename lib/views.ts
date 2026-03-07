// View Counter Utility
// Tracks active viewers for matches with ping mechanism

const API_BASE = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || '';

/**
 * Increment view count for a match
 * Call this when user opens a match page
 */
export async function incrementView(matchId: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/api/views/${matchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error('Failed to increment view');
    
    const data = await res.json();
    return data.views;
  } catch (error) {
    return 0;
  }
}

/**
 * Get current view count for a match
 */
export async function getViewCount(matchId: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/api/views/${matchId}/count`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error('Failed to get view count');
    
    const data = await res.json();
    return data.views;
  } catch (error) {
    return 0;
  }
}

/**
 * Ping to keep viewer session alive
 * Extends TTL by 5 minutes
 * Call this every 4 minutes while user is watching
 */
export async function pingView(matchId: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/api/views/${matchId}/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) throw new Error('Failed to ping view');
    
    const data = await res.json();
    return data.views;
  } catch (error) {
    return 0;
  }
}

/**
 * Start ping interval for a match
 * Returns cleanup function to stop pinging
 * 
 * Usage:
 *   const stopPing = startViewPing(matchId);
 *   // ... later when leaving page ...
 *   stopPing();
 */
export function startViewPing(matchId: string, onCountUpdate?: (count: number) => void): () => void {
  // Ping every 4 minutes (240 seconds)
  // TTL is 5 minutes, so this gives 1 minute buffer
  const PING_INTERVAL = 4 * 60 * 1000; // 4 minutes in ms
  
  // Initial ping
  pingView(matchId).then(count => {
    if (onCountUpdate) onCountUpdate(count);
  });
  
  // Set up interval
  const intervalId = setInterval(() => {
    pingView(matchId).then(count => {
      if (onCountUpdate) onCountUpdate(count);
    });
  }, PING_INTERVAL);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Format view count for display (e.g., 1.2K, 3M)
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}
