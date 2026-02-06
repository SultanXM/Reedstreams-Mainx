"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useUniversalAdBlocker } from "@/hooks/useUniversalAdBlocker";
import { Loader, AlertTriangle, Play } from 'lucide-react';
import ReedVideoJS from "./ReedVideoJS";
import "@/styles/match.css";

// --- Constants & Configuration ---
const REED_API_BASE = "https://reedstreams-edge-v1.fly.dev";
const AGGREGATOR_URL = "https://reedstreams-aggregator.fly.dev/api/merged";

// --- Type Definitions ---
interface Stream {
    embedUrl: string;
    streamNo: number;
    language: string;
    hd: boolean;
    sourceIdentifier: string;
}

interface MatchSource {
    source: string;
    id: string;
}

interface Match {
    id: string;
    title: string;
    date: string;
    sources?: MatchSource[];
}

// --- Custom Hook for Data Fetching ---
// This hook encapsulates all the complex logic for fetching and merging streams.
const useMatchStreams = (matchId: string) => {
    const [match, setMatch] = useState<Match | null>(null);
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPremiumSource = useCallback(async (adminSource: MatchSource): Promise<Stream | null> => {
        try {
            const oracleRes = await fetch(AGGREGATOR_URL);
            if (!oracleRes.ok) return null;

            const mergedMatches = await oracleRes.json();
            const matchedEntry = mergedMatches.find((m: any) =>
                m.sources.some((s: any) => s.url.trim().toLowerCase() === adminSource.id.trim().toLowerCase())
            );

            if (!matchedEntry) return null;

            const reedSource = matchedEntry.sources.find((s: any) => s.name.toLowerCase().includes("reeds") || s.is_direct === true);
            if (!reedSource) return null;
            
            const signRes = await fetch(`/api/premium-sign?id=${reedSource.url}`);
            if (!signRes.ok) return null;

            const signedData = await signRes.json();
            const finalPath = signedData.signed_url || signedData.proxy_url || signedData.url;

            if (finalPath) {
                return {
                    embedUrl: finalPath.startsWith('http') ? finalPath : `${REED_API_BASE}${finalPath}`,
                    streamNo: 1,
                    language: "English",
                    hd: true,
                    sourceIdentifier: "REEDSTREAMS-OFFICIAL",
                };
            }
        } catch (err) {
            console.error("Premium source fetch failed:", err);
        }
        return null;
    }, []);

    const fetchStandardSources = useCallback(async (matchSources: MatchSource[]): Promise<Stream[]> => {
        const promises = matchSources.map(src =>
            fetch(`/api/stream/${src.source}/${src.id}`)
                .then(r => r.ok ? r.json() : [])
                .then(streams => streams.map((s: any) => ({ ...s, sourceIdentifier: src.source })))
                .catch(() => [])
        );
        const results = await Promise.all(promises);
        return results.flat();
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Get Match Details
                let foundMatch: Match | null = null;
                try {
                    const stored = sessionStorage.getItem("currentMatch");
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (String(parsed.id) === String(matchId)) foundMatch = parsed;
                    }
                } catch {}

                if (!foundMatch) {
                    const res = await fetch("/api/matches");
                    if (res.ok) {
                        const list = await res.json();
                        foundMatch = list.find((m: Match) => String(m.id) === String(matchId));
                    }
                }

                if (!foundMatch) {
                    throw new Error("Match details not found.");
                }
                setMatch(foundMatch);

                // 2. Check if match is live
                if (new Date(foundMatch.date).getTime() > Date.now()) {
                    setLoading(false);
                    return; // Countdown will be shown
                }

                // 3. Fetch all sources in parallel
                const sourcePromises: Promise<Stream | Stream[] | null>[] = [];
                const adminSource = foundMatch.sources?.find(s => s.source === 'admin');
                const standardSources = foundMatch.sources?.filter(s => s.source !== 'admin') || [];

                if (adminSource) {
                    sourcePromises.push(fetchPremiumSource(adminSource));
                }
                if (standardSources.length > 0) {
                    sourcePromises.push(fetchStandardSources(standardSources));
                }

                if (sourcePromises.length === 0) {
                    throw new Error("No sources available for this match.");
                }

                const results = await Promise.all(sourcePromises);
                const allStreams = results.flat().filter((s): s is Stream => s !== null);

                if (allStreams.length === 0) {
                    throw new Error("No working streams could be found at this moment.");
                }

                setStreams(allStreams);

            } catch (e: any) {
                setError(e.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [matchId, fetchPremiumSource, fetchStandardSources]);

    return { match, streams, loading, error };
};


// --- UI Components ---

const PlayerLoader: React.FC = () => (
    <div className="player-container loading-state" style={{ 
        width: '100%', 
        aspectRatio: '16/9', 
        minHeight: '400px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#09090b', 
        borderRadius: '12px', 
        color: '#8db902' 
    }}>
        <Loader className="spinner" size={48} />
        <span style={{ marginTop: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>ESTABLISHING UPLINK...</span>
    </div>
);

const PlayerError: React.FC<{ message: string }> = ({ message }) => (
    <div className="player-container error-state" style={{ 
        width: '100%', 
        aspectRatio: '16/9', 
        minHeight: '400px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#09090b', 
        borderRadius: '12px', 
        color: '#ef4444' 
    }}>
        <AlertTriangle size={48} />
        <span style={{ marginTop: '1rem', textAlign: 'center', padding: '0 1rem' }}>{message}</span>
    </div>
);

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = new Date(targetDate).getTime() - Date.now();
            if (diff <= 0) {
                clearInterval(timer);
                window.location.reload(); // Reload to fetch streams
            } else {
                setTimeLeft({
                    h: Math.floor(diff / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="player-wrapper">
            <div className="player-container countdown-state">
                <div className="countdown-content">
                    <div className="timer-display">
                        <div className="timer-unit">{String(timeLeft.h).padStart(2, '0')}</div>:
                        <div className="timer-unit">{String(timeLeft.m).padStart(2, '0')}</div>:
                        <div className="timer-unit">{String(timeLeft.s).padStart(2, '0')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IframePlayer: React.FC<{ embedUrl: string }> = ({ embedUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Robustness: Force loader to hide after 10s if iframe doesn't trigger load
        const timeout = setTimeout(() => setIsLoading(false), 10000);
        return () => clearTimeout(timeout);
    }, [embedUrl]);

    return (
        <div className="video-iframe-wrapper" style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            {isLoading && (
                <div className="overlay-loading" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    background: '#09090b',
                    color: '#8db902',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Loader className="spinner" size={48} />
                    <span style={{ marginTop: '12px', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.05em', opacity: 0.8 }}>ESTABLISHING SECURE CONNECTION</span>
                </div>
            )}
            <iframe
                src={embedUrl}
                className="video-iframe"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="no-referrer"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

const StreamSelector: React.FC<{
    streams: Stream[];
    selected: Stream;
    onSelect: (stream: Stream) => void;
}> = ({ streams, selected, onSelect }) => (
    <div className="stream-selector">
        <div className="stream-header">AVAILABLE SIGNALS ({streams.length})</div>
        <div className="stream-list">
            {streams.map((s) => (
                <button
                    key={s.embedUrl}
                    className={`stream-btn ${selected.embedUrl === s.embedUrl ? "active" : ""}`}
                    onClick={() => onSelect(s)}
                >
                    <span className="signal-icon"></span>
                    {s.sourceIdentifier} {s.streamNo > 0 ? `#${s.streamNo}` : ""}
                </button>
            ))}
        </div>
    </div>
);


// --- Main Player Component ---

export default function MatchPlayer({ matchId }: { matchId: string }) {
    useUniversalAdBlocker();

    const { match, streams, loading, error } = useMatchStreams(matchId);
    
    // Select the best stream initially, or fallback to the first
    const bestStream = useMemo(() => {
        if (streams.length === 0) return null;
        return streams.find(s => s.sourceIdentifier === "REEDSTREAMS-OFFICIAL") || streams[0];
    }, [streams]);
    
    const [selectedStream, setSelectedStream] = useState<Stream | null>(bestStream);

    useEffect(() => {
        // When bestStream is calculated, update the selected stream
        if (bestStream && !selectedStream) {
            setSelectedStream(bestStream);
        }
    }, [bestStream, selectedStream]);

    if (loading) return <PlayerLoader />;
    if (error) return <PlayerError message={error} />;

    // Countdown for upcoming matches
    if (match && new Date(match.date).getTime() > Date.now()) {
        return <Countdown targetDate={match.date} />;
    }

    if (!selectedStream) {
        return <PlayerError message="No streams available to play." />;
    }

    return (
        <div className="player-wrapper">
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spinner { animation: spin 1s linear infinite; }
            `}</style>
            <div className="player-container" key={selectedStream.embedUrl}>
                {selectedStream.sourceIdentifier === "REEDSTREAMS-OFFICIAL" ? (
                    <ReedVideoJS src={selectedStream.embedUrl} />
                ) : (
                    <IframePlayer embedUrl={selectedStream.embedUrl} />
                )}
            </div>
            {streams.length > 1 && (
                <StreamSelector streams={streams} selected={selectedStream} onSelect={setSelectedStream} />
            )}
        </div>
    );
}