/**
 * 🛡️ REEDSTREAMS AD SHIELD - SERVICE WORKER
 *
 * Network-level ad blocking for ultimate protection.
 * Intercepts fetch requests before they reach the page.
 *
 * VERSION: 1.0.0
 */

const CACHE_NAME = 'reedstreams-adshield-v1';

// Ad domain patterns to block
const AD_PATTERNS = [
    /popads\./i,
    /popcash\./i,
    /propellerads\./i,
    /adsterra\./i,
    /exoclick\./i,
    /juicyads\./i,
    /trafficjunky\./i,
    /doubleclick\./i,
    /googlesyndication\./i,
    /clickadu\./i,
    /admaven\./i,
    /adcash\./i,
    /zeroredirect\./i,
    /hilltopads\./i,
    /popunder\./i,
    /\bads\b/i,
    /\bpop\b/i,
    /\bclick\b.*\btrack/i,
    /syndication/i,
    /adserver/i
];

// URLs that should NEVER be blocked (whitelist)
const WHITELIST_PATTERNS = [
    /reedstreams/i,
    /localhost/i,
    /127\.0\.0\.1/i,
    /192\.168\./i,
    /10\.\d+\./i,
    /vercel/i,
    /streamed\.pk/i,
    /strmd\.link/i,
    /embedstream/i,
    /sportshub/i,
    /google-analytics/i,
    /googleapis/i,
    /gstatic/i,
    /fonts\./i,
    /cloudflare/i,
    /jsdelivr/i,
    /cdnjs/i,
    /\/api\//i
];

/**
 * Check if URL should be blocked
 */
function shouldBlockUrl(url) {
    const urlStr = url.toString().toLowerCase();

    // Never block whitelisted URLs
    for (const pattern of WHITELIST_PATTERNS) {
        if (pattern.test(urlStr)) {
            return false;
        }
    }

    // Check against ad patterns
    for (const pattern of AD_PATTERNS) {
        if (pattern.test(urlStr)) {
            return true;
        }
    }

    return false;
}

/**
 * Service Worker Install Event
 */
self.addEventListener('install', (event) => {
    console.log('🛡️ [AdShield SW] Installing...');
    self.skipWaiting(); // Activate immediately
});

/**
 * Service Worker Activate Event
 */
self.addEventListener('activate', (event) => {
    console.log('🛡️ [AdShield SW] Activated');
    event.waitUntil(clients.claim()); // Take control of all pages
});

/**
 * Fetch Event - Intercept and block ad requests
 */
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Check if this request should be blocked
    if (shouldBlockUrl(url)) {
        console.log('🛡️ [AdShield SW] BLOCKED:', url.substring(0, 50));

        // Return empty response
        event.respondWith(
            new Response('', {
                status: 204,
                statusText: 'Blocked by ReedStreams AdShield'
            })
        );
        return;
    }

    // Allow the request to proceed normally
});

/**
 * Message handler for communication with main thread
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_STATUS') {
        event.ports[0].postMessage({
            status: 'active',
            version: '1.0.0',
            patterns: AD_PATTERNS.length
        });
    }

    if (event.data && event.data.type === 'ADD_PATTERN') {
        try {
            const newPattern = new RegExp(event.data.pattern, 'i');
            AD_PATTERNS.push(newPattern);
            event.ports[0].postMessage({ success: true });
        } catch (e) {
            event.ports[0].postMessage({ success: false, error: e.message });
        }
    }
});
