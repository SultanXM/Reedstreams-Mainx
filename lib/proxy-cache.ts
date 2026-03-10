/**
 * Edge proxy cache utilities
 * Routes video segment requests through Cloudflare worker for edge caching
 */

const WORKER_BASE_URL = "https://edge-proxy-cache-worker.reedstreams000.workers.dev";

/**
 * Wraps a segment URL to go through the worker cache
 */
export function getProxiedSegmentUrl(originalUrl: string): string {
  // Already proxied, don't double-wrap
  if (originalUrl.includes("/api/v1/proxy")) {
    return originalUrl;
  }
  
  // Only proxy video segments (.ts, .mp4) not manifests (.m3u8)
  const isSegment = originalUrl.match(/\.(ts|mp4)(\?|$)/i);
  if (!isSegment) {
    return originalUrl;
  }

  const encodedUrl = encodeURIComponent(originalUrl);
  return `${WORKER_BASE_URL}/api/v1/proxy?schema=sports&url=${encodedUrl}`;
}

/**
 * Check if a URL is a video segment that should be proxied
 */
export function isVideoSegment(url: string): boolean {
  return /\.(ts|mp4)(\?|$)/i.test(url) && !url.includes("/api/v1/proxy");
}

/**
 * Get the original stream URL wrapped for proxy
 * This wraps the m3u8 URL so subsequent segment requests go through worker
 */
export function getProxiedStreamUrl(originalStreamUrl: string): string {
  // If it's already a proxied URL, return as-is
  if (originalStreamUrl.includes("/api/v1/proxy")) {
    return originalStreamUrl;
  }
  
  // Wrap the stream URL through the worker
  const encodedUrl = encodeURIComponent(originalStreamUrl);
  return `${WORKER_BASE_URL}/api/v1/proxy?schema=sports&url=${encodedUrl}`;
}
