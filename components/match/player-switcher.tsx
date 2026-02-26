"use client";

import { PlayerType } from "@/hooks/usePlayerPreference";
import HLSPlayer from "./HLSPlayer";
import ReedVideoJS from "./ReedVideoJS";
import ShakaPlayer from "./ShakaPlayer";

interface PlayerSwitcherProps {
  playerType: PlayerType;
  src: string;
  matchId?: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export default function PlayerSwitcher({
  playerType,
  src,
  matchId,
  onError,
  onSuccess,
}: PlayerSwitcherProps) {
  switch (playerType) {
    case "videojs":
      return <ReedVideoJS src={src} matchId={matchId} onError={onError} onSuccess={onSuccess} />;
    case "shaka":
      return <ShakaPlayer src={src} matchId={matchId} onError={onError} onSuccess={onSuccess} />;
    case "hls":
    default:
      return <HLSPlayer src={src} matchId={matchId} onError={onError} onSuccess={onSuccess} />;
  }
}
