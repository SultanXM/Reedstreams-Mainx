"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, CalendarDays } from "lucide-react";
import { getTeamBadgeUrl } from "@/lib/utils";

// Define a robust interface that allows for missing data
interface Match {
  id: string;
  title?: string;
  date?: string;
  competition?: string;
  teams?: {
    home?: { name?: string; badge?: string };
    away?: { name?: string; badge?: string };
  };
}

export default function MatchesList() {
  const searchParams = useSearchParams();
  const sportId = searchParams.get("sportId");

  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState("live");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        setError(null);
        
        const url = sportId ? `/api/matches/${sportId}` : "/api/matches";
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("API did not return an array:", data);
          setMatches([]);
          setFilteredMatches([]);
          return;
        }

        // --- SAFE SORTING ---
        // We do NOT filter "???". We take everything.
        // We sort safely so undefined dates don't break the page.
        const sortedData = [...data].sort((a: Match, b: Match) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
        });

        console.log('✅ Matches loaded:', sortedData.length);
        setMatches(sortedData);

        // Pre-filter for the initial "live" state to prevent blink
        const now = new Date();
        const initialFiltered = sortedData.filter((match) => {
            if (!match.date) return false;
            const matchDate = new Date(match.date);
            if (isNaN(matchDate.getTime())) return false;
            const isLive = matchDate <= now && matchDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
            return isLive;
        });
        setFilteredMatches(initialFiltered);

      } catch (err: any) {
        console.error('❌ CRITICAL ERROR fetching matches:', err);
        setError(err.message || "Failed to load matches");
        setMatches([]);
        setFilteredMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [sportId]);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    if (!matches.length) return;

    const now = new Date();

    const filtered = matches.filter((match) => {
      // Safety check: if no date, show it in 'all' but treat as not live/upcoming
      if (!match.date) return filter === "all";

      const matchDate = new Date(match.date);
      // Safe check for Invalid Date
      if (isNaN(matchDate.getTime())) return filter === "all";

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

  // --- SAFE GROUPING LOGIC ---
  function groupMatchesByDate(matches: Match[]) {
    const grouped: { [key: string]: Match[] } = {};

    matches.forEach((match) => {
      // Fallback date if missing
      const dateStr = match.date || new Date().toISOString(); 
      const matchDate = new Date(dateStr);
      
      // Handle invalid dates safely
      if (isNaN(matchDate.getTime())) {
          const unknownKey = "Unknown Date";
          if (!grouped[unknownKey]) grouped[unknownKey] = [];
          grouped[unknownKey].push(match);
          return;
      }

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
    if (dateString === "Unknown Date") return { text: "Date TBD", icon: Calendar };

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

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

  if (error) {
      return <div className="lm-no-matches" style={{color: 'red'}}>Error: {error}</div>
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
            No matches currently live. Check upcoming matches{" "}
            <a
              href="#match-list"
              onClick={(e) => {
                e.preventDefault();
                setFilter("upcoming");
              }}
              style={{
                color: "var(--primary-color, #8db902)",
                textDecoration: "underline",
              }}
            >
              here
            </a>.
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
                      // --- SAFE DATE PARSING FOR INDIVIDUAL CARDS ---
                      const now = new Date();
                      const matchDate = match.date ? new Date(match.date) : new Date();
                      const isValidDate = !isNaN(matchDate.getTime());

                      let isLive = false;
                      let isUpcoming = false;
                      let dateStr = "TBD";
                      let timeStr = "TBD";

                      if (isValidDate && match.date) {
                          isLive = matchDate <= now && matchDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
                          isUpcoming = matchDate > now;
                          dateStr = matchDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                          timeStr = matchDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                      }

                      // --- SAFE DATA ACCESS ---
                      // We use "???" as fallback if names are missing
                      const homeName = match.teams?.home?.name?.substring(0, 10).toUpperCase() || "???";
                      const awayName = match.teams?.away?.name?.substring(0, 10).toUpperCase() || "???";
                      
                      // Badges
                      const homeBadge = match.teams?.home?.badge;
                      const awayBadge = match.teams?.away?.badge;

                      return (
                        <Link
                          key={match.id}
                          href={`/match/${match.id}`}
                          onClick={() => handleMatchClick(match)}
                        >
                          <div className={`lm-match-card ${isLive ? "lm-live" : ""}`}>
                            
                            {isLive && <div className="lm-live-tag">LIVE</div>}
                            {isUpcoming && (
                              <div className="lm-live-tag" style={{ background: "rgba(141, 185, 2, 0.7)" }}>
                                UPCOMING
                              </div>
                            )}

                            <div className="lm-teams-container">
                              
                              {/* HOME TEAM */}
                              <div className="lm-team">
                                <div className="lm-team-badge-container">
                                  {homeBadge ? (
                                    <img
                                      src={getTeamBadgeUrl(homeBadge) || undefined}
                                      alt={homeName}
                                      className="lm-team-logo"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        if (target.nextElementSibling) {
                                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="lm-team-placeholder"
                                    style={{ display: homeBadge ? "none" : "flex" }}
                                  >
                                    ?
                                  </div>
                                </div>
                                <span className="lm-team-abbr" title={match.teams?.home?.name || "Unknown"}>
                                  {homeName}
                                </span>
                              </div>

                              {/* CENTER INFO */}
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

                              {/* AWAY TEAM */}
                              <div className="lm-team">
                                <div className="lm-team-badge-container">
                                  {awayBadge ? (
                                    <img
                                      src={getTeamBadgeUrl(awayBadge) || undefined}
                                      alt={awayName}
                                      className="lm-team-logo"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        if (target.nextElementSibling) {
                                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="lm-team-placeholder"
                                    style={{ display: awayBadge ? "none" : "flex" }}
                                  >
                                    ?
                                  </div>
                                </div>
                                <span className="lm-team-abbr" title={match.teams?.away?.name || "Unknown"}>
                                  {awayName}
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