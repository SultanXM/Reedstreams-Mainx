/**
 * 🛡️ Service Worker Registration for Ad Shield
 * 
 * Registers the network-level ad blocking service worker.
 * Should be called once on app startup.
 */

export async function registerAdShieldServiceWorker(): Promise<boolean> {
    // Only run in browser
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.warn('🛡️ [AdShield] Service Workers not supported');
        return false;
    }

    try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/sw-adshield.js', {
            scope: '/'
        });

        console.log('🛡️ [AdShield] Service Worker registered:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('🛡️ [AdShield] New Service Worker available');
                        // Optionally notify user about update
                    }
                });
            }
        });

        return true;
    } catch (error) {
        console.error('🛡️ [AdShield] Service Worker registration failed:', error);
        return false;
    }
}

/**
 * Get status from the Service Worker
 */
export async function getServiceWorkerStatus(): Promise<{
    status: string;
    version: string;
    patterns: number;
} | null> {
    if (!navigator.serviceWorker?.controller) {
        return null;
    }

    return new Promise((resolve) => {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
            resolve(event.data);
        };

        navigator.serviceWorker.controller.postMessage(
            { type: 'GET_STATUS' },
            [messageChannel.port2]
        );

        // Timeout after 1 second
        setTimeout(() => resolve(null), 1000);
    });
}

/**
 * Add a custom blocking pattern to the Service Worker
 */
export async function addBlockingPattern(pattern: string): Promise<boolean> {
    if (!navigator.serviceWorker?.controller) {
        return false;
    }

    return new Promise((resolve) => {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
            resolve(event.data?.success ?? false);
        };

        navigator.serviceWorker.controller.postMessage(
            { type: 'ADD_PATTERN', pattern },
            [messageChannel.port2]
        );

        // Timeout after 1 second
        setTimeout(() => resolve(false), 1000);
    });
}
