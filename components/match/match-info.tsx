"use client";

import { getTeamBadgeUrl } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Match {
    id: string;
    title: string;
    date: string;
    competition?: string;
    teams?: {
      home?: { name: string; badge?: string };
      away?: { name: string; badge?: string };
    };
    sources?: Array<{ source: string; id: string }>;
}

export default function MatchInfo({ matchId }: { matchId: string }) {
    const [match, setMatch] = useState<Match | null>(null);

    useEffect(() => {
        // Read match data from sessionStorage, which is set when a user clicks a match.
        const storedMatch = sessionStorage.getItem("currentMatch");
        if (storedMatch) {
            const matchData: Match = JSON.parse(storedMatch);
            // Ensure the stored match is the one for this page
            if (matchData.id === matchId) {
                setMatch(matchData);
            }
        }
    }, [matchId]);

    if (!match) {
        return <div className="lm-no-matches">Match information is currently unavailable.</div>;
    }

    const homeBadgeUrl = getTeamBadgeUrl(match.teams?.home?.badge);
    const awayBadgeUrl = getTeamBadgeUrl(match.teams?.away?.badge);

    const matchDate = new Date(match.date);
    const timeStr = matchDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
    const dateStr = matchDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div style={{
            padding: '1.5rem',
            backgroundColor: '#1f1f1f',
            borderRadius: '12px',
            border: '1px solid #333',
            color: '#fff',
            fontFamily: 'sans-serif',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            textAlign: 'center',
            margin: '1rem 0'
        }}>
            {/* Home Team */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px' }}>
                <img 
                    src={homeBadgeUrl || '/images/placeholder-badge.png'} 
                    alt={match.teams?.home?.name || 'Home Team'} 
                    style={{ height: '80px', width: '80px', objectFit: 'contain', marginBottom: '0.5rem' }} 
                />
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {match.teams?.home?.name || "HOME"}
                </span>
            </div>

            {/* Match Time Info */}
            <div style={{ margin: '0 2rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#8db902' }}>
                    {timeStr}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.25rem' }}>
                    {dateStr}
                </div>
            </div>

            {/* Away Team */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px' }}>
                <img 
                    src={awayBadgeUrl || '/images/placeholder-badge.png'} 
                    alt={match.teams?.away?.name || 'Away Team'} 
                    style={{ height: '80px', width: '80px', objectFit: 'contain', marginBottom: '0.5rem' }} 
                />
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {match.teams?.away?.name || "AWAY"}
                </span>
            </div>
        </div>
    );
}