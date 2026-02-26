"use client";

import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";

interface ShakaPlayerProps {
  src: string;
  matchId?: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export default function ShakaPlayer({ src, matchId, onError, onSuccess }: ShakaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const uiRef = useRef<shaka.ui.Overlay | null>(null);
  const cleanupFunctions = useRef<{ saveInterval?: NodeJS.Timeout }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const video = videoRef.current;
    const container = containerRef.current;

    // Playback position helpers
    const getStorageKey = () => `video_position_match_${matchId || 'unknown'}`;

    const savePosition = (currentTime: number) => {
      if (!matchId) return;
      try {
        localStorage.setItem(getStorageKey(), currentTime.toString());
      } catch (err) {
        console.warn("Failed to save playback position:", err);
      }
    };

    const loadPosition = (): number | null => {
      if (!matchId) return null;
      try {
        const saved = localStorage.getItem(getStorageKey());
        return saved ? parseFloat(saved) : null;
      } catch (err) {
        return null;
      }
    };

    // Install Shaka polyfills
    shaka.polyfill.installAll();

    const initPlayer = async () => {
      if (signal.aborted) return;
      setIsLoading(true);
      setError(null);

      try {
        if (!video || !container) {
          throw new Error("Video or container element not found");
        }

        // Check browser support
        if (!shaka.Player.isBrowserSupported()) {
          throw new Error("Your browser is not supported for video playback");
        }

        // Cleanup any existing player
        if (uiRef.current) {
          try {
            uiRef.current.destroy();
          } catch (err) {
            console.warn("Error destroying existing UI:", err);
          }
          uiRef.current = null;
          playerRef.current = null;
        }

        // Create new player and UI
        const player = new shaka.Player();
        playerRef.current = player;

        const ui = new shaka.ui.Overlay(player, container, video);
        uiRef.current = ui;

        // Attach player to video element
        await player.attach(video);
        if (signal.aborted) return;

        // Configure UI controls
        ui.configure({
          controlPanelElements: [
            "play_pause",
            "time_and_duration",
            "spacer",
            "mute",
            "volume",
            "fullscreen",
            "overflow_menu",
          ],
          addSeekBar: true,
          seekBarColors: {
            base: "rgba(255, 255, 255, 0.3)",
            buffered: "rgba(255, 255, 255, 0.54)",
            played: "rgb(141, 185, 2)", // Your brand green color
          },
        });

        // Configure player streaming settings
        player.configure({
          streaming: {
            safeSeekOffset: 30,
            bufferingGoal: 10,
            rebufferingGoal: 4,
            retryParameters: {
              timeout: 30000,
              maxAttempts: 3,
              baseDelay: 1000,
              backoffFactor: 2,
            },
          },
        });

        // Error handling
        player.addEventListener("error", (event) => {
          const shakaError = (event as any).detail;
          
          // Treat memory (1001) and minor network gaps (3016) as non-fatal
          const isRecoverable =
            shakaError.severity === shaka.util.Error.Severity.RECOVERABLE ||
            shakaError.code === 1001 ||
            shakaError.code === 3016;

          if (isRecoverable) {
            console.warn("Recoverable Shaka error:", shakaError.code);
            return;
          }

          if (!signal.aborted) {
            const errorMsg = `Playback Error (${shakaError.code})`;
            setError(errorMsg);
            onError?.(errorMsg);
          }
        });

        // Load the stream
        await player.load(src);
        if (signal.aborted) return;

        // Restore playback position for VOD (not live)
        const savedPosition = loadPosition();
        if (savedPosition && savedPosition > 0 && video.duration && !isNaN(video.duration)) {
          video.currentTime = savedPosition;
        }

        // Start playback
        try {
          await video.play();
        } catch (playErr) {
          console.warn("Autoplay blocked:", playErr);
        }

        // Save position every 5 seconds
        const saveInterval = setInterval(() => {
          if (video && video.currentTime > 0 && !video.paused && video.duration && !isNaN(video.duration)) {
            savePosition(video.currentTime);
          }
        }, 5000);

        cleanupFunctions.current.saveInterval = saveInterval;

        if (!signal.aborted) {
          setIsLoading(false);
          onSuccess?.();
        }
      } catch (err) {
        if (signal.aborted) return;
        const errorMsg = err instanceof Error ? err.message : "Failed to load video";
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
      }
    };

    initPlayer();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear save interval
      if (cleanupFunctions.current.saveInterval) {
        clearInterval(cleanupFunctions.current.saveInterval);
      }

      // Save final position before destroying
      if (video && matchId && video.currentTime > 0) {
        try {
          localStorage.setItem(
            `video_position_match_${matchId}`,
            video.currentTime.toString()
          );
        } catch (e) {
          console.warn("Failed to save final position:", e);
        }
      }

      // Destroy UI and player
      const ui = uiRef.current;
      if (ui) {
        try {
          ui.destroy();
        } catch (err) {
          console.warn("Error destroying UI:", err);
        }
        uiRef.current = null;
        playerRef.current = null;
      }

      // Clear video source
      if (video) {
        video.src = "";
        video.load();
      }
    };
  }, [src, matchId, onError, onSuccess]);

  if (error) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-red-500 font-semibold mb-2">Playback Error</div>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black"
      data-shaka-player-container
      data-shaka-player-cast-receiver-id="930DEB06"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8db902]/30 border-t-[#8db902]" />
        </div>
      )}
      <video
        ref={videoRef}
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        playsInline
        autoPlay
        muted
        data-shaka-player
      />
    </div>
  );
}
