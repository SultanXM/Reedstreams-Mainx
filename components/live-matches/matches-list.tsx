"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, CalendarDays } from "lucide-react";

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

export default function MatchesList() {
  const searchParams = useSearchParams();
  const sportId = searchParams.get("sportId");

  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const url = sportId ? `/api/matches/${sportId}` : "/api/matches";
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setMatches([]);
          setFilteredMatches([]);
          return;
        }

        // Filter out any match where home or away team is ??? or empty
        const validMatches = data.filter((match: Match) => {
          const homeTeamName = match.teams?.home?.name?.trim() || "";
          const awayTeamName = match.teams?.away?.name?.trim() || "";

          if (
            !homeTeamName ||
            !awayTeamName ||
            homeTeamName === "???" ||
            awayTeamName === "???"
          ) {
            return false;
          }

          return true;
        });

        // Sort by date ascending
        validMatches.sort(
          (a: Match, b: Match) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setMatches(validMatches);
        setFilteredMatches(validMatches);
      } catch (error) {
        console.error(error);
        setMatches([]);
        setFilteredMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [sportId]);

  useEffect(() => {
    const now = new Date();

    const filtered = matches.filter((match) => {
      const matchDate = new Date(match.date);
      const isLive =
        matchDate <= now &&
        matchDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
      const isUpcoming = matchDate > now;

      if (filter === "all") return true;
      if (filter === "live") return isLive;
      if (filter === "upcoming") return isUpcoming;

      return false;
    });

    setFilteredMatches(filtered);
  }, [filter, matches]);

  function handleMatchClick(match: Match) {
    sessionStorage.setItem("currentMatch", JSON.stringify(match));
  }

  function groupMatchesByDate(matches: Match[]) {
    const grouped: { [key: string]: Match[] } = {};

    matches.forEach((match) => {
      const matchDate = new Date(match.date);
      const normalizedDate = new Date(matchDate);
      normalizedDate.setHours(0, 0, 0, 0);
      const dateKey = normalizedDate.toISOString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(match);
    });

    return grouped;
  }

  function formatDateSeparator(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) {
      return null;
    } else if (date.getTime() === tomorrow.getTime()) {
      return { text: "Tomorrow's Matches", icon: CalendarDays };
    } else {
      const formatted = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      return { text: `${formatted} Matches`, icon: Calendar };
    }
  }

  if (loading) {
    return <div className="lm-loading-message">Loading matches...</div>;
  }

  const groupedMatches = groupMatchesByDate(filteredMatches);
  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <>
      <div className="lm-filter-buttons">
        <button
          className={`lm-filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Matches
        </button>
        <button
          className={`lm-filter-btn ${filter === "live" ? "active" : ""}`}
          onClick={() => setFilter("live")}
        >
          Live
        </button>
        <button
          className={`lm-filter-btn ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
      </div>

      <div className="lm-matches-grid" id="match-list">
        {filteredMatches.length === 0 ? (
          <div className="lm-no-matches">
            No matches available. Check back later!
          </div>
        ) : (
          <>
            {sortedDates.map((dateKey) => {
              const dateMatches = groupedMatches[dateKey];
              const separator = formatDateSeparator(dateKey);

              return (
                <div key={dateKey} className="col-span-full">
                  {separator && (
                    <div className="lm-date-separator">
                      <separator.icon
                        className="w-5 h-5"
                        style={{ color: "var(--primary-color, #8db902)" }}
                      />
                      <h3>{separator.text}</h3>
                    </div>
                  )}

                  <div className="lm-matches-grid" style={{ marginTop: "0" }}>
                    {dateMatches.map((match) => {
                      const now = new Date();
                      const matchDate = new Date(match.date);
                      const isLive =
                        matchDate <= now &&
                        matchDate >=
                          new Date(now.getTime() - 4 * 60 * 60 * 1000);
                      /* Check if match start time is in the future for upcoming badge */
                      const isUpcoming = matchDate > now;

                      const dateStr = matchDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });
                      const timeStr = matchDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });

                      return (
                        <Link
                          key={match.id}
                          href={`/match/${match.id}`}
                          onClick={() => handleMatchClick(match)}
                        >
                          <div
                            className={`lm-match-card ${
                              isLive ? "lm-live" : ""
                            }`}
                          >
                            {isLive && <div className="lm-live-tag">LIVE</div>}
                            {isUpcoming && (
                              <div
                                className="lm-live-tag"
                                style={{ background: "rgba(141, 185, 2, 0.7)" }}
                              >
                                UPCOMING
                              </div>
                            )}
                            <div className="lm-teams-container">
                              <div className="lm-team">
                                <div className="lm-team-badge-container">
                                  {match.teams?.home?.badge ? (
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL}/images/badge/${match.teams.home.badge}.webp`}
                                      alt={match.teams.home.name}
                                      className="lm-team-logo"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        if (target.nextElementSibling) {
                                          (
                                            target.nextElementSibling as HTMLElement
                                          ).style.display = "flex";
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="lm-team-placeholder"
                                    style={{
                                      display: match.teams?.home?.badge
                                        ? "none"
                                        : "flex",
                                    }}
                                  >
                                    ?
                                  </div>
                                </div>
                                <span
                                  className="lm-team-abbr"
                                  title={match.teams?.home?.name || "Unknown"}
                                >
                                  {match.teams?.home?.name
                                    ?.substring(0, 10)
                                    .toUpperCase() || "???"}
                                </span>
                              </div>
                              <div className="lm-match-center">
                                {match.competition && (
                                  <div className="lm-competition">
                                    {match.competition}
                                  </div>
                                )}
                                <div className="lm-date">{dateStr}</div>
                                <div className="lm-vs-line"></div>
                                <div className="lm-time">{timeStr}</div>
                              </div>
                              <div className="lm-team">
                                <div className="lm-team-badge-container">
                                  {match.teams?.away?.badge ? (
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL}/images/badge/${match.teams.away.badge}.webp`}
                                      alt={match.teams.away.name}
                                      className="lm-team-logo"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        if (target.nextElementSibling) {
                                          (
                                            target.nextElementSibling as HTMLElement
                                          ).style.display = "flex";
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="lm-team-placeholder"
                                    style={{
                                      display: match.teams?.away?.badge
                                        ? "none"
                                        : "flex",
                                    }}
                                  >
                                    ?
                                  </div>
                                </div>
                                <span
                                  className="lm-team-abbr"
                                  title={match.teams?.away?.name || "Unknown"}
                                >
                                  {match.teams?.away?.name
                                    ?.substring(0, 10)
                                    .toUpperCase() || "???"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
