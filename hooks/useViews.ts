"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "https://reedstreams-wx-78.fly.dev/api/v1";

interface ViewsState {
  views: number;
  loading: boolean;
  error: string | null;
}

export function useViews(matchId: string | null) {
  const [state, setState] = useState<ViewsState>({
    views: 0,
    loading: true,
    error: null,
  });

  const hasPinged = useRef(false);

  // Fetch view count
  const fetchViews = useCallback(async () => {
    if (!matchId) return;

    try {
      const res = await fetch(`${API_BASE}/views/count/${matchId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch views");
      const data = await res.json();
      setState((s) => ({ ...s, views: data.views, loading: false }));
    } catch (err) {
      setState((s) => ({ ...s, error: "Failed to load views", loading: false }));
    }
  }, [matchId]);

  // Record a view (only once per session per match)
  const recordView = useCallback(async () => {
    if (!matchId || hasPinged.current) return;

    hasPinged.current = true;

    try {
      const res = await fetch(`${API_BASE}/views/ping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: matchId }),
      });
      if (!res.ok) throw new Error("Failed to record view");
      const data = await res.json();
      if (data.total_views !== undefined) {
        setState((s) => ({ ...s, views: data.total_views }));
      }
    } catch (err) {
      // Silent fail - views are not critical
      console.error("View ping failed:", err);
    }
  }, [matchId]);

  // Initial fetch
  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  // Poll for updates every 30 seconds (but don't ping - just get count)
  useEffect(() => {
    if (!matchId) return;
    const interval = setInterval(fetchViews, 30000);
    return () => clearInterval(interval);
  }, [fetchViews, matchId]);

  return {
    ...state,
    recordView,
    refresh: fetchViews,
  };
}

// Hook for batch fetching views for multiple matches
export function useBatchViews(matchIds: string[]) {
  const [views, setViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matchIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchBatch = async () => {
      try {
        const res = await fetch(`${API_BASE}/views/batch/count`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ match_ids: matchIds }),
        });
        if (!res.ok) throw new Error("Failed to fetch views");
        const data = await res.json();
        const viewsMap: Record<string, number> = {};
        data.views.forEach(([id, count]: [string, number]) => {
          viewsMap[id] = count;
        });
        setViews(viewsMap);
      } catch (err) {
        console.error("Batch views fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [matchIds.join(",")]);

  return { views, loading };
}
