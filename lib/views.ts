// View Counter Utility
// Tracks global views for matches using a simple counter

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
    console.error('[Views] Error incrementing:', error);
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
    console.error('[Views] Error getting count:', error);
    return 0;
  }
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
