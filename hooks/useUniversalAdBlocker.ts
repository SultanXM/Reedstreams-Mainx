'use client';

import { useEffect } from 'react';
import { initAdaptiveAdShield } from '../utils/universalAdShield';

/**
 * 🛡️ Universal Ad Blocker Hook
 * 
 * Activates the Nuclear Ad Shield.
 * The shield runs immediately via IIFE, this hook just ensures it's loaded.
 */
export function useUniversalAdBlocker(): void {
    useEffect(() => {
        // The shield already runs on import, but call init to be sure
        initAdaptiveAdShield();

        // Additional protection: Block window.open directly in React context
        try {
            const blockOpen = () => {
                console.log('🛡️ [React Hook] Blocked window.open');
                return null;
            };
            Object.defineProperty(window, 'open', {
                get: () => blockOpen,
                set: () => { },
                configurable: true
            });
        } catch (e) { }

    }, []);
}
