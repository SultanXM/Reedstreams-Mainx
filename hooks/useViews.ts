"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "https://reedstreams-wx-78.fly.dev/api/v1";

interface ViewsState {
  views: number;
  loading: boolean;
  error: string | null;
}

// Global cache for views to avoid refetching
const globalViewsCache = new Map<string, number>();

export function useViews(matchId: string | null) {
  const [state, setState] = useState<ViewsState>({
    views: matchId ? globalViewsCache.get(matchId) ?? 0 : 0,
    loading: !matchId || !globalViewsCache.has(matchId),
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  // Fetch view count - priority load
  const fetchViews = useCallback(async () => {
    if (!matchId) return;
    
    // Use cached value immediately
    if (globalViewsCache.has(matchId)) {
      setState(s => ({ ...s, views: globalViewsCache.get(matchId)!, loading: false }));
      return;
    }

    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/views/count/${matchId}`, {
        cache: "no-store",
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch views");
      const data = await res.json();
      globalViewsCache.set(matchId, data.views);
      setState({ views: data.views, loading: false, error: null });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setState(s => ({ ...s, error: "Failed to load views", loading: false }));
      }
    }
  }, [matchId]);

  // Record a view - every call counts (no dedup)
  const recordView = useCallback(() => {
    if (!matchId) return;

    // Optimistic update
    const currentViews = globalViewsCache.get(matchId) ?? state.views;
    const newViews = currentViews + 1;
    globalViewsCache.set(matchId, newViews);
    setState(s => ({ ...s, views: newViews }));

    // Send to server
    fetch(`${API_BASE}/views/ping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match_id: matchId }),
      keepalive: true,
    }).catch(() => {});
  }, [matchId, state.views]);

  // Initial fetch - priority
  useEffect(() => {
    fetchViews();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchViews]);

  return {
    ...state,
    recordView,
    refresh: fetchViews,
  };
}

// Hook for batch fetching views - returns map for instant access
export function useBatchViews(matchIds: string[]) {
  const [views, setViews] = useState<Record<string, number>>(() => {
    // Initialize from cache
    const initial: Record<string, number> = {};
    matchIds.forEach(id => {
      if (globalViewsCache.has(id)) initial[id] = globalViewsCache.get(id)!;
    });
    return initial;
  });
  const [loading, setLoading] = useState(() => 
    matchIds.some(id => !globalViewsCache.has(id))
  );

  useEffect(() => {
    // Check if we already have all
    const missing = matchIds.filter(id => !globalViewsCache.has(id));
    if (missing.length === 0) {
      setViews(Object.fromEntries(matchIds.map(id => [id, globalViewsCache.get(id)!])));
      setLoading(false);
      return;
    }

    // Chunk into batches
    const chunks: string[][] = [];
    for (let i = 0; i < missing.length; i += 50) {
      chunks.push(missing.slice(i, i + 50));
    }

    let cancelled = false;

    Promise.all(
      chunks.map(chunk =>
        fetch(`${API_BASE}/views/batch/count`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ match_ids: chunk }),
        })
          .then(r => r.json())
          .then(data => {
            if (cancelled) return;
            data.views.forEach(([id, count]: [string, number]) => {
              globalViewsCache.set(id, count);
            });
          })
          .catch(() => {})
      )
    ).then(() => {
      if (!cancelled) {
        setViews(Object.fromEntries(matchIds.map(id => [id, globalViewsCache.get(id) ?? 0])));
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [matchIds.join(",")]);

  return { views, loading };
}
