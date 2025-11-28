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

    return (
        <div className="col-span-full p-4">
            <div className="lm-match-card" style={{ cursor: 'default' }}>
                <div className="lm-teams-container">
                    <div className="lm-team">
                        <div className="lm-team-badge-container">
                            {homeBadgeUrl && <img src={homeBadgeUrl} alt={match.teams?.home?.name} className="lm-team-logo" />}
                            {!homeBadgeUrl && <div className="lm-team-placeholder">?</div>}
                        </div>
                        <span className="lm-team-abbr" title={match.teams?.home?.name || "Unknown"}>
                            {match.teams?.home?.name?.toUpperCase() || "HOME"}
                        </span>
                    </div>
                    <div className="lm-match-center">
                        {match.competition && <div className="lm-competition">{match.competition}</div>}
                        <div className="lm-vs-line"></div>
                        <div className="lm-time">{match.title}</div>
                    </div>
                    <div className="lm-team">
                        <div className="lm-team-badge-container">
                            {awayBadgeUrl && <img src={awayBadgeUrl} alt={match.teams?.away?.name} className="lm-team-logo" />}
                            {!awayBadgeUrl && <div className="lm-team-placeholder">?</div>}
                        </div>
                        <span className="lm-team-abbr" title={match.teams?.away?.name || "Unknown"}>
                            {match.teams?.away?.name?.toUpperCase() || "AWAY"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}