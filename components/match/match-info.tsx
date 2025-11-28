"use client";

import '@/styles/match-info.css';
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
        <section className="match-info-section">
            <h1 className="match-info-title">
                {match.teams?.home?.name || "Home"} <span>vs</span> {match.teams?.away?.name || "Away"}
            </h1>
            <div className="match-info-details">
                {/* Home Team */}
                <div className="match-info-team">
                    <img 
                        src={homeBadgeUrl || '/images/placeholder-badge.png'} 
                        alt={match.teams?.home?.name || 'Home Team'} 
                        className="match-info-badge"
                    />
                    <span className="match-info-team-name">
                        {match.teams?.home?.name || "HOME"}
                    </span>
                </div>
    
                {/* Match Time Info */}
                <div className="match-info-time-section">
                    <div className="match-info-time">{timeStr}</div>
                    <div className="match-info-date">{dateStr}</div>
                </div>
    
                {/* Away Team */}
                <div className="match-info-team">
                    <img 
                        src={awayBadgeUrl || '/images/placeholder-badge.png'} 
                        alt={match.teams?.away?.name || 'Away Team'} 
                        className="match-info-badge"
                    />
                    <span className="match-info-team-name">
                        {match.teams?.away?.name || "AWAY"}
                    </span>
                </div>
            </div>
        </section>
    );
}