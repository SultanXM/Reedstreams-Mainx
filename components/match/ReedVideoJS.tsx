"use client";

import React, { useEffect, useRef } from 'react';
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface ReedVideoJSProps {
  src: string;
  matchId?: string;
  startTime?: number;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onReady?: () => void;
  onSuccess?: () => void;
}

export default function ReedVideoJS({ 
  src, 
  matchId, 
  startTime,
  autoPlay = true,
  onError, 
  onReady,
  onSuccess 
}: ReedVideoJSProps) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const hasSeekedRef = useRef(false);

    useEffect(() => {
        if (!videoRef.current) return;
        
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoElement.style.width = "100%";
            videoElement.style.height = "100%";
            
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, {
                autoplay: autoPlay,
                controls: true,
                responsive: true,
                fluid: true,
                liveui: true,
                sources: [{ src, type: "application/x-mpegURL" }],
                html5: {
                    vhs: {
                        overrideNative: true,
                        enableLowInitialPlaylist: true,
                        smoothQualityChange: true,
                    },
                    nativeAudioTracks: false,
                    nativeVideoTracks: false,
                }
            }));

            player.on('loadedmetadata', () => {
                console.log("[VideoJS] Metadata loaded, seeking to:", startTime);
                
                // Seek to start time if provided
                if (startTime && startTime > 0 && !hasSeekedRef.current) {
                    hasSeekedRef.current = true;
                    player.currentTime(startTime);
                }
                
                onReady?.();
                onSuccess?.();
            });
            
            player.on('error', () => {
                const error = player.error();
                console.error("[VideoJS] Error:", error);
                onError?.(error?.message || 'Video.js playback error');
            });
            
            player.on('playing', () => {
                onSuccess?.();
            });

            // If already loaded and startTime comes in later
            if (startTime && startTime > 0 && player.readyState() >= 1) {
                hasSeekedRef.current = true;
                player.currentTime(startTime);
            }
        } else {
            const player = playerRef.current;
            player.src({ src, type: "application/x-mpegURL" });
            
            // Reset seek flag for new source
            hasSeekedRef.current = false;
        }
    }, [src]);

    // Handle startTime updates
    useEffect(() => {
        const player = playerRef.current;
        if (player && startTime && startTime > 0 && !hasSeekedRef.current) {
            hasSeekedRef.current = true;
            if (player.readyState() >= 1) {
                player.currentTime(startTime);
            }
        }
    }, [startTime]);
    
    useEffect(() => {
        return () => {
            const player = playerRef.current;
            if (player && !player.isDisposed()) {
                player.dispose(); 
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player style={{ width: "100%", height: "100%", borderRadius: 0 }}>
            <div ref={videoRef} style={{ width: "100%", height: "100%", borderRadius: 0 }} />
        </div>
    );
}
