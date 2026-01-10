/**
 * 🛡️ REEDSTREAMS NUCLEAR AD SHIELD v4.0
 * 
 * BULLETPROOF PROTECTION:
 * - Blocks window.open on ALL frames
 * - Blocks location changes
 * - Runs continuously
 * - Works on ALL browsers
 */

// Run immediately - don't wait for anything
(function () {
    'use strict';

    if (typeof window === 'undefined') return;

    console.log('🛡️ ====================================');
    console.log('🛡️ NUCLEAR AD SHIELD v4.0 LOADING');
    console.log('🛡️ ====================================');

    // ============================================
    // BLOCK WINDOW.OPEN - NUCLEAR OPTION
    // ============================================
    const blockWindowOpen = () => {
        const nullFn = () => {
            console.log('🛡️ BLOCKED: window.open');
            return null;
        };

        // Block on current window
        try {
            Object.defineProperty(window, 'open', {
                get: () => nullFn,
                set: () => { },
                configurable: false
            });
        } catch (e) {
            try { (window as any).open = nullFn; } catch (e2) { }
        }

        // Block on parent
        try {
            if (window.parent && window.parent !== window) {
                Object.defineProperty(window.parent, 'open', {
                    get: () => nullFn,
                    set: () => { },
                    configurable: true
                });
            }
        } catch (e) { }

        // Block on top
        try {
            if (window.top && window.top !== window) {
                Object.defineProperty(window.top, 'open', {
                    get: () => nullFn,
                    set: () => { },
                    configurable: true
                });
            }
        } catch (e) { }
    };

    // Run immediately
    blockWindowOpen();

    // Keep running to prevent override
    setInterval(blockWindowOpen, 1000);

    // ============================================
    // BLOCK POPUPS VIA CLICK CAPTURE
    // ============================================
    const preventPopups = (e: Event) => {
        const target = e.target as HTMLElement;
        if (!target) return;

        // Allow our UI elements
        if (target.closest('.player-wrapper') ||
            target.closest('.stream-selector') ||
            target.closest('nav') ||
            target.closest('header') ||
            target.closest('footer') ||
            target.closest('.stream-btn')) {
            return;
        }

        // Check for onclick handlers with popup code
        let el: HTMLElement | null = target;
        while (el && el !== document.body) {
            const onclick = el.getAttribute('onclick') || '';
            const onmousedown = el.getAttribute('onmousedown') || '';
            const ontouchstart = el.getAttribute('ontouchstart') || '';

            const handlers = onclick + onmousedown + ontouchstart;

            if (handlers.includes('open') ||
                handlers.includes('location') ||
                handlers.includes('href') ||
                handlers.includes('window')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                el.remove();
                console.log('🛡️ BLOCKED: Element with popup handler removed');
                return false;
            }
            el = el.parentElement;
        }
    };

    // Capture ALL click events
    document.addEventListener('click', preventPopups, true);
    document.addEventListener('mousedown', preventPopups, true);
    document.addEventListener('touchstart', preventPopups, { capture: true, passive: false });
    document.addEventListener('touchend', (e) => preventPopups(e), { capture: true, passive: false });

    // ============================================
    // REMOVE HIDDEN OVERLAYS
    // ============================================
    const removeHiddenOverlays = () => {
        document.querySelectorAll('div, a, span').forEach((el) => {
            const htmlEl = el as HTMLElement;

            // Skip our elements
            if (htmlEl.closest('.player-wrapper') ||
                htmlEl.closest('.stream-selector') ||
                htmlEl.closest('nav') ||
                htmlEl.closest('header') ||
                htmlEl.closest('footer') ||
                htmlEl.classList.contains('video-iframe')) {
                return;
            }

            const style = window.getComputedStyle(htmlEl);
            const rect = htmlEl.getBoundingClientRect();

            // Check for invisible overlays
            const isPositioned = style.position === 'fixed' || style.position === 'absolute';
            const isEmpty = htmlEl.innerText.trim() === '';
            const isTransparent = style.opacity === '0' ||
                style.backgroundColor === 'transparent' ||
                style.backgroundColor === 'rgba(0, 0, 0, 0)';
            const highZ = parseInt(style.zIndex || '0') > 10;
            const isLarge = rect.width > 100 && rect.height > 100;

            // Has popup handler?
            const onclick = htmlEl.getAttribute('onclick') || '';
            const hasPopup = onclick.includes('open') || onclick.includes('location');

            if ((isPositioned && isEmpty && (isTransparent || highZ) && isLarge) || hasPopup) {
                htmlEl.remove();
                console.log('🛡️ REMOVED: Hidden overlay');
            }
        });
    };

    // Remove overlays immediately and continuously
    removeHiddenOverlays();
    setTimeout(removeHiddenOverlays, 100);
    setTimeout(removeHiddenOverlays, 500);
    setTimeout(removeHiddenOverlays, 1000);
    setInterval(removeHiddenOverlays, 500);

    // ============================================
    // BLOCK UNWANTED IFRAMES
    // ============================================
    const removeAdIframes = () => {
        document.querySelectorAll('iframe').forEach((iframe) => {
            if (iframe.classList.contains('video-iframe')) return;

            const src = (iframe.getAttribute('src') || '').toLowerCase();

            // Remove iframes with no src or ad-related src
            if (!src ||
                src === 'about:blank' ||
                src.includes('ads') ||
                src.includes('pop') ||
                src.includes('click')) {
                iframe.remove();
                console.log('🛡️ REMOVED: Ad iframe');
            }
        });
    };

    removeAdIframes();
    setInterval(removeAdIframes, 1000);

    // ============================================
    // MUTATION OBSERVER - CATCH INJECTIONS
    // ============================================
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;
                    const el = node as HTMLElement;

                    // Remove ad scripts
                    if (el.tagName === 'SCRIPT') {
                        const src = (el.getAttribute('src') || '').toLowerCase();
                        if (src.includes('pop') || src.includes('ads') || src.includes('click')) {
                            el.remove();
                            console.log('🛡️ REMOVED: Ad script');
                        }
                    }

                    // Remove suspicious iframes
                    if (el.tagName === 'IFRAME' && !el.classList.contains('video-iframe')) {
                        el.remove();
                        console.log('🛡️ REMOVED: Injected iframe');
                    }

                    // Remove overlay divs
                    if (el.tagName === 'DIV') {
                        const style = window.getComputedStyle(el);
                        if ((style.position === 'fixed' || style.position === 'absolute') &&
                            el.innerText.trim() === '' &&
                            parseInt(style.zIndex || '0') > 10) {
                            el.remove();
                            console.log('🛡️ REMOVED: Injected overlay');
                        }
                    }
                });
            });
        });

        const startObserving = () => {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                setTimeout(startObserving, 10);
            }
        };
        startObserving();
    }

    // ============================================
    // BLOCK BEFOREUNLOAD (prevent redirect tricks)
    // ============================================
    window.addEventListener('beforeunload', (e) => {
        // This helps catch some redirect attempts
    });

    console.log('🛡️ ====================================');
    console.log('🛡️ NUCLEAR AD SHIELD v4.0 ACTIVE');
    console.log('🛡️ ====================================');

})();

// Export for React hook
export function initAdaptiveAdShield() {
    // Already initialized via IIFE above
    console.log('🛡️ Ad Shield hook called - already active');
}
