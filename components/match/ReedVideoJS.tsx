"use client";

import React, { useEffect, useRef } from 'react';
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function ReedVideoJS({ src }: { src: string }) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered");
            videoElement.style.width = "100%";
            videoElement.style.height = "100%";
            
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, {
                autoplay: true,
                controls: true,
                responsive: true,
                fluid: true,
                liveui: true,
                sources: [{ src, type: "application/x-mpegURL"}],
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

            player.on('ready', () => {
                console.log("Uplink = 200 OK");
            });
            
            player.on('error', () => {
                console.error("VideoJS Error:", player.error());
            });
        } else {
            const player = playerRef.current;
            player.src({ src, type: "application/x-mpegURL"});
        }
    }, [src]);
    
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
        <div data-vjs-player style={{ width: "100%", height: "100%" }}>
            <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
}
