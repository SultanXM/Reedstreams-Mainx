// Views API Client for StreamD Views Counter
const VIEWS_API_BASE = 'https://streamd-views.fly.dev';

export interface ViewCountResponse {
  match_id: string;
  count: number;
}

export interface BatchCountResponse {
  views: [string, number][];
}

// Increment view for a match (call when user starts watching)
export async function incrementView(matchId: string): Promise<number> {
  try {
    const res = await fetch(`${VIEWS_API_BASE}/api/v1/views/${matchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data: ViewCountResponse = await res.json();
    return data.count;
  } catch (error) {
    console.error('Failed to increment view:', error);
    return 0;
  }
}

// Get view count for a match
export async function getViewCount(matchId: string): Promise<number> {
  try {
    const res = await fetch(`${VIEWS_API_BASE}/api/v1/views/${matchId}/count`);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data: ViewCountResponse = await res.json();
    return data.count;
  } catch (error) {
    console.error('Failed to get view count:', error);
    return 0;
  }
}

// Batch get view counts for multiple matches
export async function getBatchViewCounts(matchIds: string[]): Promise<Map<string, number>> {
  try {
    // Chunk into batches of 50
    const chunks = [];
    for (let i = 0; i < matchIds.length; i += 50) {
      chunks.push(matchIds.slice(i, i + 50));
    }
    
    const results = new Map<string, number>();
    
    await Promise.all(chunks.map(async (chunk) => {
      const res = await fetch(`${VIEWS_API_BASE}/api/v1/views/batch/count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_ids: chunk }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data: BatchCountResponse = await res.json();
      data.views.forEach(([id, count]) => {
        results.set(id, count);
      });
    }));
    
    return results;
  } catch (error) {
    console.error('Failed to get batch view counts:', error);
    return new Map();
  }
}

// Ping to keep session alive (call every 4 minutes)
export async function pingView(matchId: string): Promise<number> {
  try {
    const res = await fetch(`${VIEWS_API_BASE}/api/v1/views/${matchId}/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    return data.count;
  } catch (error) {
    console.error('Failed to ping view:', error);
    return 0;
  }
}

// Start view ping interval (returns cleanup function)
// Note: Don't ping immediately - wait for first interval
// The initial view is already recorded by incrementView
export function startViewPing(matchId: string, onCountUpdate?: (count: number) => void): () => void {
  // Ping every 4 minutes (first ping after 4 minutes)
  const interval = setInterval(() => {
    pingView(matchId).then(onCountUpdate);
  }, 4 * 60 * 1000); // 4 minutes
  
  return () => clearInterval(interval);
}

// Format view count (e.g., 1250 -> "1.2K", 999 -> "999")
export function formatViewCount(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
}
