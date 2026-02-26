"use client";

import { useState, useEffect, useCallback } from "react";

export type PlayerType = "hls" | "videojs" | "shaka";

const STORAGE_KEY = "reedstreams_preferred_player";

export function usePlayerPreference() {
  const [preferredPlayer, setPreferredPlayerState] = useState<PlayerType>("hls");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ["hls", "videojs", "shaka"].includes(saved)) {
        setPreferredPlayerState(saved as PlayerType);
      }
    } catch (e) {
      console.warn("Failed to load player preference:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  const setPreferredPlayer = useCallback((player: PlayerType) => {
    try {
      localStorage.setItem(STORAGE_KEY, player);
      setPreferredPlayerState(player);
    } catch (e) {
      console.warn("Failed to save player preference:", e);
      setPreferredPlayerState(player);
    }
  }, []);

  return {
    preferredPlayer,
    setPreferredPlayer,
    isLoaded,
  };
}
