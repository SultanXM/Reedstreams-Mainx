"use client";

import { useEffect, useRef, useState } from "react";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css";

interface ShakaPlayerProps {
  src: string;
  matchId?: string;
  startTime?: number;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onReady?: () => void;
  onSuccess?: () => void;
}

export default function ShakaPlayer({ 
  src, 
  matchId, 
  startTime,
  autoPlay = true,
  onError, 
  onReady,
  onSuccess 
}: ShakaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const uiRef = useRef<shaka.ui.Overlay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasSeekedRef = useRef(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const video = videoRef.current;
    const container = containerRef.current;

    shaka.polyfill.installAll();

    const initPlayer = async () => {
      if (signal.aborted) return;
      setIsLoading(true);
      setError(null);

      try {
        if (!video || !container) {
          throw new Error("Video or container element not found");
        }

        if (!shaka.Player.isBrowserSupported()) {
          throw new Error("Your browser is not supported for video playback");
        }

        // Cleanup existing
        if (uiRef.current) {
          try {
            uiRef.current.destroy();
          } catch (err) {
            console.warn("Error destroying existing UI:", err);
          }
          uiRef.current = null;
          playerRef.current = null;
        }

        const player = new shaka.Player();
        playerRef.current = player;

        const ui = new shaka.ui.Overlay(player, container, video);
        uiRef.current = ui;

        await player.attach(video);
        if (signal.aborted) return;

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
            played: "rgb(141, 185, 2)",
          },
        });

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

        player.addEventListener("error", (event) => {
          const shakaError = (event as any).detail;
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

        await player.load(src);
        if (signal.aborted) return;

        console.log("[ShakaPlayer] Loaded, seeking to:", startTime);
        
        // Seek to start time if provided
        if (startTime && startTime > 0 && !hasSeekedRef.current) {
          hasSeekedRef.current = true;
          video.currentTime = startTime;
        }

        if (autoPlay) {
          try {
            await video.play();
          } catch (playErr) {
            console.warn("Autoplay blocked:", playErr);
          }
        }

        setIsLoading(false);
        onReady?.();
        onSuccess?.();
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

      if (video) {
        video.src = "";
        video.load();
      }
    };
  }, [src]); // Only re-run on src change

  // Handle startTime updates
  useEffect(() => {
    const video = videoRef.current;
    if (video && startTime && startTime > 0 && !hasSeekedRef.current) {
      hasSeekedRef.current = true;
      video.currentTime = startTime;
    }
  }, [startTime]);

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#c44', fontWeight: 600, marginBottom: 8 }}>Playback Error</div>
          <p style={{ color: '#666', fontSize: 12 }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#000', position: 'relative', borderRadius: 0 }}
      data-shaka-player-container
    >
      {isLoading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, background: 'rgba(0,0,0,0.8)'
        }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 0 }}
        playsInline
        autoPlay={autoPlay}
        muted={isLoading}
        data-shaka-player
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
