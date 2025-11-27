"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  competition?: string;
}

interface Stream {
  embedUrl: string;
}

export default function MatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  useEffect(() => {
    const matchDataString = sessionStorage.getItem("currentMatch");
    let initialSourceId: string | null = null;

    if (matchDataString) {
      try {
        const matchData = JSON.parse(matchDataString);
        // Ensure the data from sessionStorage corresponds to the current match ID
        if (matchData.id === id) {
          setMatch(matchData);
          // Set the first source as the default selected one
          if (matchData.sources && matchData.sources.length > 0) {
            initialSourceId = matchData.sources[0].id;
            setSelectedSourceId(initialSourceId);
          }
        }
      } catch (error) {
        console.error("Failed to parse match data from sessionStorage", error);
      }
    }
    setLoading(false);

    // If we have a source, fetch its stream URL
    if (initialSourceId) {
      handleSourceClick(initialSourceId);
    }
  }, [id]);

  const handleSourceClick = async (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setStreamLoading(true);
    setStreamUrl(null);
    try {
      // This assumes an API route at /api/stream/[sourceId] exists
      // to fetch the stream details.
      const res = await fetch(`/api/stream/${sourceId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch stream data: ${res.statusText}`);
      }
      const streamData: Stream = await res.json();
      if (streamData.embedUrl) {
        setStreamUrl(streamData.embedUrl);
      }
    } catch (error) {
      console.error("Error fetching stream URL:", error);
    } finally {
      setStreamLoading(false);
    }
  };

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
      <div className="lm-matches-grid" style={{ padding: '1rem' }}>
        {/* Video Player Section */}
        <div className="col-span-full">
          <div className="video-player-container">
            {streamLoading && <div className="stream-loading">Loading Stream...</div>}
            {!streamLoading && streamUrl && (
              <iframe
                src={streamUrl}
                allowFullScreen
                scrolling="no"
                frameBorder="0"
                className="video-iframe"
              ></iframe>
            )}
            {!streamLoading && !streamUrl && (
              <div className="stream-placeholder">
                <p>Select a stream source to start watching.</p>
              </div>
            )}
          </div>
        </div>

        {/* Stream Source Buttons */}
        <div className="col-span-full">
          <div className="lm-filter-buttons" style={{ justifyContent: 'center', margin: '1rem 0' }}>
            {match.sources && match.sources.length > 0 ? (
              match.sources.map((source) => (
                <button
                  key={source.id}
                  className={`lm-filter-btn ${selectedSourceId === source.id ? "active" : ""}`}
                  onClick={() => handleSourceClick(source.id)}
                >
                  {source.source}
                </button>
              ))
            ) : (
              <p>No stream sources available for this match.</p>
            )}
          </div>
        </div>

        {/* Match Info Card */}
        <div className="col-span-full">
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
      </div>
    </>
  );
}
