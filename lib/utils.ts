import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api';

// Helper to build the canonical badge URL (encode id)
export function getTeamBadgeUrl(badgeId?: string | null) {
  if (!badgeId) return null;
  const encoded = encodeURIComponent(badgeId);
  return `${STREAMED_API_BASE}/images/badge/${encoded}.webp`;
}