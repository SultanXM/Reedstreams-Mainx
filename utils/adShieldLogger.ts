/**
 * 🛡️ REEDSTREAMS AD SHIELD - LOGGING & ANALYTICS
 * 
 * Production-ready logging system for ad blocking events
 * Tracks breakthroughs, blocks, and errors for monitoring
 */

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Event types for tracking
export type AdEventType = 'blocked' | 'breakthrough' | 'error' | 'layer_activated' | 'cleanup';

export interface AdEvent {
    type: AdEventType;
    layer: 'universal' | 'safari' | 'ios' | 'android' | 'chrome';
    action: string;
    target?: string;
    url?: string;
    timestamp: number;
    userAgent?: string;
    platform?: string;
}

// In-memory event buffer for batching
const eventBuffer: AdEvent[] = [];
const MAX_BUFFER_SIZE = 50;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeoutId: ReturnType<typeof setTimeout>;
    return ((...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
}

// Throttle helper
export function throttle<T extends (...args: any[]) => void>(fn: T, limit: number): T {
    let inThrottle = false;
    return ((...args: any[]) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => { inThrottle = false; }, limit);
        }
    }) as T;
}

/**
 * Log an ad-related event
 * In development: Console output with emoji
 * In production: Batched and sent to analytics
 */
export function logAdEvent(
    type: AdEventType,
    layer: AdEvent['layer'],
    action: string,
    details?: { target?: string; url?: string }
) {
    const event: AdEvent = {
        type,
        layer,
        action,
        target: details?.target,
        url: details?.url,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        platform: typeof navigator !== 'undefined' ? navigator.platform : undefined
    };

    // Development: Console logging
    if (isDevelopment) {
        const emoji = {
            blocked: '🛡️',
            breakthrough: '🚨',
            error: '❌',
            layer_activated: '✅',
            cleanup: '🧹'
        }[type];

        console.log(`${emoji} [${layer.toUpperCase()}] ${action}`, details || '');
    }

    // Production: Buffer events for batch sending
    if (isProduction) {
        eventBuffer.push(event);

        // Flush if buffer is full
        if (eventBuffer.length >= MAX_BUFFER_SIZE) {
            flushEvents();
        }
    }

    // Always track breakthroughs immediately (critical event)
    if (type === 'breakthrough') {
        trackBreakthrough(event);
    }
}

/**
 * Flush buffered events to analytics backend
 */
const flushEvents = debounce(() => {
    if (eventBuffer.length === 0) return;

    const eventsToSend = [...eventBuffer];
    eventBuffer.length = 0; // Clear buffer

    // Send to your analytics endpoint
    // Replace with actual analytics service (Vercel Analytics, Sentry, etc.)
    if (typeof window !== 'undefined' && isProduction) {
        try {
            // Navigator.sendBeacon for reliable background sending
            const data = JSON.stringify({
                events: eventsToSend,
                sessionId: getSessionId(),
                timestamp: Date.now()
            });

            // Use sendBeacon for production - doesn't block page unload
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics/ad-events', data);
            }
        } catch (e) {
            // Silently fail - don't break user experience
        }
    }
}, 1000);

/**
 * Track ad breakthrough (critical - sent immediately)
 */
function trackBreakthrough(event: AdEvent) {
    if (typeof window === 'undefined') return;

    // In production, send breakthrough events immediately
    if (isProduction) {
        try {
            fetch('/api/analytics/breakthrough', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
                keepalive: true // Ensures request completes even if page unloads
            }).catch(() => { }); // Silently fail
        } catch (e) {
            // Silently fail
        }
    }
}

/**
 * Get or create session ID for tracking
 */
function getSessionId(): string {
    if (typeof sessionStorage === 'undefined') return 'unknown';

    let sessionId = sessionStorage.getItem('rs_session_id');
    if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('rs_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Error boundary helper for ad shield
 * Wraps risky operations to prevent app crashes
 */
export function safeExecute<T>(
    fn: () => T,
    fallback: T,
    errorContext: string
): T {
    try {
        return fn();
    } catch (error) {
        logAdEvent('error', 'universal', errorContext, {
            target: error instanceof Error ? error.message : String(error)
        });
        return fallback;
    }
}

/**
 * Performance monitoring for ad shield operations
 */
export function measurePerformance(operationName: string, fn: () => void): void {
    if (isDevelopment && typeof performance !== 'undefined') {
        const start = performance.now();
        fn();
        const duration = performance.now() - start;

        if (duration > 10) { // Only log slow operations (>10ms)
            console.warn(`⏱️ [Performance] ${operationName} took ${duration.toFixed(2)}ms`);
        }
    } else {
        fn();
    }
}

// Auto-flush events periodically
if (typeof window !== 'undefined') {
    setInterval(flushEvents, FLUSH_INTERVAL);

    // Flush on page unload
    window.addEventListener('beforeunload', flushEvents);
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushEvents();
        }
    });
}
