# 🛡️ REEDSTREAMS AD-BLOCKING SYSTEM DOCUMENTATION

```
PROJECT: ReedStreams Adaptive Ad-Blocking System
STATUS: ⚠️ PARTIALLY WORKING
LAST UPDATED: 2026-01-06 14:29 PKT
AUTHOR: Development Team
```

---

## 📊 CURRENT STATUS SUMMARY

| Platform | Status | Notes |
|----------|--------|-------|
| **Chrome Desktop (Mac)** | ✅ Working | Hydration warning fixed with suppressHydrationWarning |
| **Safari Desktop (Mac)** | ✅ Fixed | All window.open assignments now use Object.defineProperty |
| **iOS Safari** | ⚠️ Needs Testing | Touch events implemented |
| **Android Chrome** | ⚠️ Needs Testing | Touch + click events implemented |
| **Firefox** | ⚠️ Needs Testing | Falls back to Safari layer |
| **Edge** | ⚠️ Needs Testing | Falls back to Safari layer |

---

## 📁 FILE STRUCTURE

```
/Reedstreams-Mainx/
├── app/
│   ├── layout.tsx                        # Root layout (suppressHydrationWarning added)
│   ├── match/[id]/page.tsx               # Match viewing page
│   └── api/
│       ├── matches/route.ts              # Matches list API
│       └── stream/[source]/[id]/route.ts # Stream extraction API
│
├── components/
│   └── match/
│       └── match-player.tsx              # 🎯 Main player component (uses ad shield)
│
├── hooks/
│   └── useUniversalAdBlocker.ts          # React hook - entry point for ad shield
│
├── utils/
│   └── universalAdShield.ts              # 🛡️ CORE AD BLOCKING LOGIC (534 lines)
│
├── styles/
│   └── match.css                         # Player styling (includes .shield-overlay)
│
└── public/
    └── scripts/                          # [REMOVED] Old ad-blocker.js deleted
```

---

## 🔄 USER FLOW: CLICK TO PLAY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                    │
└─────────────────────────────────────────────────────────────────────────┘

1️⃣ USER → Navigates to /match/[id]?sportName=Football
           │
           ▼
2️⃣ NEXT.JS → Renders match-player.tsx component
           │
           ▼
3️⃣ useUniversalAdBlocker() → Hook activates on component mount
           │
           ▼
4️⃣ initAdaptiveAdShield() → Runs in universalAdShield.ts
           │
           ├─── detectDevice() → Identifies browser/platform
           │         │
           │         ├── isSafari? → /Safari/.test(ua) && !/Chrome/.test(ua)
           │         ├── isIOS?    → /iPad|iPhone|iPod/.test(ua)
           │         ├── isAndroid?→ /Android/.test(ua)
           │         └── isChrome? → /Chrome/.test(ua)
           │
           ├─── initUniversalLayer() → ALWAYS runs (base protection)
           │         │
           │         ├── Object.defineProperty(window, 'open', ...) 
           │         └── MutationObserver for DOM injection
           │
           ├─── initSafariLayer() → IF isSafari (NUCLEAR layer)
           │         │
           │         ├── Getter/setter trap for window.open
           │         ├── Touch event interception
           │         ├── Click event interception
           │         ├── Link blocking
           │         └── setInterval cleanup every 1s
           │
           ├─── initIOSLayer() → IF isIOS
           │         │
           │         ├── touchstart capture
           │         ├── touchend capture
           │         └── gesturestart handling
           │
           ├─── initAndroidLayer() → IF isAndroid
           │         │
           │         ├── touchstart capture
           │         ├── touchend capture
           │         ├── click capture
           │         └── MutationObserver
           │
           └─── initChromeLayer() → IF isChrome && !isMobile
                     │
                     ├── click capture
                     └── mousedown capture
           │
           ▼
5️⃣ API CALL → /api/stream/[source]/[id] fetches stream URLs
           │
           ▼
6️⃣ STREAM LOADS → iframe renders with selectedStream.embedUrl
           │
           ▼
7️⃣ SHIELD OVERLAY → .shield-overlay div sits on top of iframe
           │              │
           │              └── First click → setShieldActive(false) → removes overlay
           │
           ▼
8️⃣ USER CLICKS PLAY → Event captured by ad shield layers
           │
           ├── IF invisible overlay detected → REMOVE + block event
           ├── IF onclick has window.open → block event
           ├── IF suspicious link clicked → block event
           └── IF legitimate play button → ALLOW through to iframe
           │
           ▼
9️⃣ VIDEO PLAYS → Stream starts, ad blocking continues monitoring
```

---

## 🎯 BROWSER HANDLING MATRIX

```
┌──────────────────┬─────────────────────────────────────────────────────────┐
│ Browser/Platform │ Active Layers & Techniques                              │
├──────────────────┼─────────────────────────────────────────────────────────┤
│                  │                                                         │
│ CHROME DESKTOP   │ ✓ Universal Layer                                       │
│ (Mac/Windows)    │ ✓ Chrome Layer (click + mousedown capture)              │
│                  │ ✓ window.open = null via Object.defineProperty          │
│                  │ ✓ MutationObserver for script injection                 │
│                  │                                                         │
├──────────────────┼─────────────────────────────────────────────────────────┤
│                  │                                                         │
│ SAFARI DESKTOP   │ ✓ Universal Layer                                       │
│ (Mac)            │ ✓ Safari NUCLEAR Layer                                  │
│                  │ ✓ Getter/setter trap for window.open                    │
│                  │ ✓ touchstart + click capture                            │
│                  │ ✓ Link blocking (pop, ads, click, redirect, track)     │
│                  │ ✓ setInterval(1s) continuous cleanup                    │
│                  │                                                         │
├──────────────────┼─────────────────────────────────────────────────────────┤
│                  │                                                         │
│ iOS SAFARI       │ ✓ Universal Layer                                       │
│ (iPhone/iPad)    │ ✓ Safari NUCLEAR Layer                                  │
│                  │ ✓ iOS Layer (touch event handling)                      │
│                  │ ✓ touchstart + touchend + gesturestart                  │
│                  │ ✓ Re-applies window.open block after each touch         │
│                  │                                                         │
├──────────────────┼─────────────────────────────────────────────────────────┤
│                  │                                                         │
│ ANDROID CHROME   │ ✓ Universal Layer                                       │
│                  │ ✓ Android Layer                                         │
│                  │ ✓ touchstart + touchend + click capture                 │
│                  │ ✓ MutationObserver (scripts + iframes + divs)          │
│                  │ ✓ Full-screen overlay detection                        │
│                  │                                                         │
├──────────────────┼─────────────────────────────────────────────────────────┤
│                  │                                                         │
│ FIREFOX/EDGE     │ ✓ Universal Layer                                       │
│ (Any platform)   │ ✓ Safari Layer (used as fallback)                       │
│                  │                                                         │
└──────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 🛡️ AD BLOCKING TECHNIQUES USED

### Layer 1: Universal Base (All Browsers)
```javascript
// Technique: Object.defineProperty to block window.open
Object.defineProperty(window, 'open', {
    value: () => null,
    writable: false,
    configurable: true
});

// Technique: MutationObserver for DOM injection blocking
observer.observe(document.body, { childList: true, subtree: true });
```

### Layer 2: Safari Nuclear (Safari/iOS)
```javascript
// Technique: Getter/setter trap (Safari-specific)
Object.defineProperty(window, 'open', {
    get: () => function() { return null; },
    set: () => {}, // Empty setter ignores overrides
    configurable: false
});

// Technique: Event capture phase blocking
document.addEventListener('touchstart', handler, { capture: true, passive: false });
document.addEventListener('click', handler, true);

// Technique: Continuous cleanup
setInterval(() => { /* remove overlays */ }, 1000);
```

### Layer 3: Mobile Touch (iOS/Android)
```javascript
// Technique: Touch event interception
document.addEventListener('touchstart', (e) => {
    if (isOverlay(target)) {
        target.remove();
        e.preventDefault();
    }
}, { capture: true, passive: false });
```

### Layer 4: Visual Shield (React Component)
```jsx
// Technique: CSS overlay to absorb first click
{shieldActive && (
    <div className="shield-overlay" onClick={() => setShieldActive(false)} />
)}
```

---

## 🐛 KNOWN ISSUES & FIXES APPLIED

### ✅ FIXED ISSUES

| Issue | Location | Root Cause | Fix Applied |
|-------|----------|------------|-------------|
| TypeError: readonly property | universalAdShield.ts:118 | Direct `window.open =` on Safari | Removed all direct assignments, use only Object.defineProperty |
| Chrome hydration mismatch | layout.tsx | Browser extensions adding attributes | Added `suppressHydrationWarning` to `<html>` |
| 404 for ad-blocker.js | layout.tsx | Old script reference | Removed Script import |
| iOS touchend error | universalAdShield.ts | Direct window.open assignment | Wrapped in try-catch with Object.defineProperty |

### ⚠️ POTENTIAL ISSUES TO MONITOR

| Issue | Risk Level | When It Occurs | Mitigation |
|-------|------------|----------------|------------|
| Ads bypass blocking | Medium | Third-party iframe internal scripts | Cannot control cross-origin iframe content |
| Stream player breaks | Low | Overly aggressive blocking | Whitelist `.player-wrapper`, `.video-iframe` |
| Navigation blocked | Low | Safari link interception | Whitelist `nav`, `header`, `footer` |

---

## 📋 TESTING PROTOCOL

### Desktop Testing

| Step | Action | Expected | Console Check |
|------|--------|----------|---------------|
| 1 | Open Chrome, go to match page | Page loads | `🛡️ [Base] Universal layer ACTIVE` |
| 2 | Check console for errors | No TypeError | No red errors |
| 3 | Click on video player once | Shield overlay disappears | - |
| 4 | Click to play video | Video plays, NO new tabs | `🛡️ [Chrome]` messages if ads blocked |
| 5 | Repeat on Safari | Same behavior | `🛡️ [Safari] Safari NUCLEAR layer ACTIVE` |

### Mobile Testing

| Step | Device | Action | Expected |
|------|--------|--------|----------|
| 1 | iPhone Safari | Connect to http://192.168.100.5:3000 | Page loads |
| 2 | iPhone Safari | Tap video player | No popup, video plays |
| 3 | Android Chrome | Connect to same URL | Page loads |
| 4 | Android Chrome | Tap video player | No popup, video plays |

---

## 📊 SUCCESS METRICS

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUCCESS CRITERIA                             │
├─────────────────────────────────────────────────────────────────┤
│ ☐ 100% ad-free on Chrome Desktop                                │
│ ☐ 100% ad-free on Safari Desktop                                │
│ ☐ 100% ad-free on iOS Safari                                    │
│ ☐ 100% ad-free on Android Chrome                                │
│ ☐ Zero console errors on all platforms                          │
│ ☐ Video playback works on all platforms                         │
│ ☐ Load time < 3 seconds                                         │
│ ☐ Survives npm run dev restart                                  │
│ ☐ Works on any port (3000, 3001, etc.)                         │
│ ☐ Works in production build                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔮 RECOMMENDED FUTURE IMPROVEMENTS

### Short-term (This Week)
1. **Add Error Logging**: Implement tracking when ads appear
2. **Create Test Suite**: Automated tests for each browser
3. **Add Metrics Dashboard**: Track ad breakthrough rate

### Medium-term (This Month)
1. **Service Worker**: Network-level request blocking
2. **Ad Script Fingerprinting**: Detect by behavior, not just URL
3. **Popup Trap**: Catch popups that bypass window.open

### Long-term (Architecture)
1. **Server-side Proxy**: Strip ad scripts before sending to client
2. **Content Security Policy**: Block external scripts via headers
3. **WebAssembly Blocker**: Faster, harder to bypass

---

## ⚠️ CRITICAL RULES (DO NOT VIOLATE)

```
1. ❌ NEVER use iframe sandbox attribute (breaks Chrome player)
2. ❌ NEVER assign window.open = directly (Safari readonly error)
3. ❌ NEVER block events on .player-wrapper (breaks video controls)
4. ✅ ALWAYS use Object.defineProperty for window.open
5. ✅ ALWAYS wrap defineProperty in try-catch
6. ✅ ALWAYS whitelist our UI elements in event handlers
7. ✅ ALWAYS test on actual devices, not just simulators
```

---

## 📝 QUICK REFERENCE COMMANDS

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Test on network (mobile)
# Access via: http://192.168.100.5:3000

# Check for errors
# Chrome: Cmd+Option+J
# Safari: Cmd+Option+C (Enable Developer menu first)
```

---

## 🚨 URGENT ACTION ITEMS

| Priority | Action | Owner | Status |
|----------|--------|-------|--------|
| P0 | Test Safari Mac after readonly fix | Dev | ⏳ Pending |
| P0 | Test iOS Safari on physical device | Dev | ⏳ Pending |
| P0 | Test Android Chrome on physical device | Dev | ⏳ Pending |
| P1 | Add console logging for ad breakthroughs | Dev | ⏳ Pending |
| P1 | Document exact ad domains observed | Dev | ⏳ Pending |
| P2 | Consider Service Worker implementation | Dev | ⏳ Backlog |

---

*Document generated: 2026-01-06 14:29 PKT*
*Next review: After mobile testing complete*
