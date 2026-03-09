"use client";

import { Eye } from "lucide-react";
import { useViews } from "@/hooks/useViews";
import { useEffect } from "react";

interface ViewsCounterProps {
  matchId: string;
  compact?: boolean;
  recordOnMount?: boolean;
}

function formatViews(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

export default function ViewsCounter({
  matchId,
  compact = false,
  recordOnMount = false,
}: ViewsCounterProps) {
  const { views, loading, recordView } = useViews(matchId);

  // Record view when component mounts if enabled
  useEffect(() => {
    if (recordOnMount) {
      recordView();
    }
  }, [recordOnMount, recordView]);

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "11px",
          color: "#666",
        }}
      >
        <Eye size={12} />
        <span>{loading ? "-" : formatViews(views)}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        color: "#888",
        background: "#111",
        padding: "4px 8px",
        borderRadius: 0,
      }}
    >
      <Eye size={14} />
      <span>{loading ? "Loading..." : `${formatViews(views)} views`}</span>
    </div>
  );
}

// Compact version for lists/cards
export function ViewsBadge({ matchId }: { matchId: string }) {
  const { views, loading } = useViews(matchId);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "10px",
        color: "#555",
      }}
    >
      <Eye size={10} />
      {loading ? "-" : formatViews(views)}
    </span>
  );
}
