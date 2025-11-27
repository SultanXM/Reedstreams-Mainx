"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/header";
import { getTeamBadgeUrl } from "@/lib/utils";

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

export default function MatchPage() {
  const params = useParams();
  const { id } = params;

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const matchDataString = sessionStorage.getItem("currentMatch");
    if (matchDataString) {
      try {
        const matchData = JSON.parse(matchDataString);
        // Ensure the data from sessionStorage corresponds to the current match ID
        if (matchData.id === id) {
          setMatch(matchData);
        }
      } catch (error) {
        console.error("Failed to parse match data from sessionStorage", error);
      }
    }
    setLoading(false);
    // We could also add a fallback to fetch the match data from the API if it's not in sessionStorage
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="lm-loading-message">Loading match details...</div>
      </>
    );
  }

  if (!match) {
    return (
      <>
        <Header />
        <div className="lm-no-matches">
          Match details not found. Please go back to the list and select a match.
        </div>
      </>
    );
  }

  const homeBadgeUrl = getTeamBadgeUrl(match.teams?.home?.badge);
  const awayBadgeUrl = getTeamBadgeUrl(match.teams?.away?.badge);

  return (
    <>
      <Header />
      <div className="watch-page-container">
        <h1>{match.title}</h1>
        <div className="watch-teams-header">
          <div className="watch-team">
            {homeBadgeUrl ? (
              <img src={homeBadgeUrl} alt={match.teams?.home?.name} className="watch-team-logo" />
            ) : (
              <div className="watch-team-placeholder">?</div>
            )}
            <h2>{match.teams?.home?.name || "Home Team"}</h2>
          </div>
          <div className="watch-vs">VS</div>
          <div className="watch-team">
            {awayBadgeUrl ? (
              <img src={awayBadgeUrl} alt={match.teams?.away?.name} className="watch-team-logo" />
            ) : (
              <div className="watch-team-placeholder">?</div>
            )}
            <h2>{match.teams?.away?.name || "Away Team"}</h2>
          </div>
        </div>

        {/* Placeholder for the video player and stream links */}
        <div className="video-player-placeholder">
            <p>Video Player Area</p>
        </div>

        <div className="stream-links">
            <h3>Stream Sources:</h3>
            {match.sources && match.sources.length > 0 ? (
                <ul>
                    {match.sources.map(source => (
                        <li key={source.id}>{source.source}</li>
                    ))}
                </ul>
            ) : (
                <p>No stream sources available for this match.</p>
            )}
        </div>
      </div>
    </>
  );
}
