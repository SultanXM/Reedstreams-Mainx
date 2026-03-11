'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  incrementView, 
  getViewCount, 
  startViewPing, 
  formatViewCount 
} from '@/lib/views-api';

export function useViews(matchId: string) {
  const [viewCount, setViewCount] = useState<number>(0);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Record a view when user starts watching
  const recordView = useCallback(async () => {
    if (hasRecorded) return;
    
    const count = await incrementView(matchId);
    setViewCount(count);
    setHasRecorded(true);
  }, [matchId, hasRecorded]);

  // Get initial view count
  useEffect(() => {
    const fetchCount = async () => {
      const count = await getViewCount(matchId);
      setViewCount(count);
    };
    fetchCount();
  }, [matchId]);

  // Start ping interval when view is recorded
  useEffect(() => {
    if (!hasRecorded) return;
    
    const stopPing = startViewPing(matchId, (count) => {
      setViewCount(count);
    });
    
    return stopPing;
  }, [matchId, hasRecorded]);

  return {
    views: viewCount,
    viewCount,
    formattedCount: formatViewCount(viewCount),
    recordView,
    loading: false,
  };
}

// Hook for batch fetching views
export function useBatchViews(matchIds: string[]) {
  const [viewsMap, setViewsMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (matchIds.length === 0) return;
    
    const fetchViews = async () => {
      const { getBatchViewCounts } = await import('@/lib/views-api');
      const counts = await getBatchViewCounts(matchIds);
      setViewsMap(counts);
    };
    
    fetchViews();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchViews, 30000);
    return () => clearInterval(interval);
  }, [matchIds.join(',')]);

  return viewsMap;
}
