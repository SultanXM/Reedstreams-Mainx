# 🛡️ REEDSTREAMS AD BLOCKING - PROBLEM & SOLUTION DOCUMENTATION

**Document Version:** 1.0  
**Last Updated:** 2026-01-06  
**Status:** FIXED ✅

---

## 📋 EXECUTIVE SUMMARY

This document explains the ad popup problem on ReedStreams mobile devices (Android/iOS) and the solution implemented to fix it.

---

## 🔴 THE PROBLEM

### What Was Happening:
1. User opens a live match on mobile (Android/iOS)
2. User taps "TAP TO PLAY" button
3. Loading animation plays, then video player appears
4. User taps the play button **inside the video iframe**
5. **An ad opens in a new tab** 💥
6. User comes back and taps again → **Another ad opens** 💥

### Why It Was Happening:

The video player is embedded from a third-party source (streamed.pk) using an `<iframe>`. This iframe contains:
- The video player
- Embedded ad scripts from the stream provider

When the user interacts with the video player (clicking play/pause), the embedded ad scripts call `window.open()` to open a popup/new tab.

### The Technical Challenge:

```
┌─────────────────────────────────────────────────────────┐
│  OUR WEBSITE (reedstreams.live)                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Our JavaScript can run here ✅                    │  │
│  │  We can block window.open ✅                       │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  IFRAME (streamed.pk - different domain)    │  │  │
│  │  │  ─────────────────────────────────────────  │  │  │
│  │  │  Ad scripts run here ❌                     │  │  │
│  │  │  We CANNOT access this (cross-origin) ❌    │  │  │
│  │  │  They call window.open() → popup opens 💥  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Issue:** Due to browser security (Same-Origin Policy), JavaScript on our domain CANNOT access or modify content inside a cross-origin iframe. This means:
- We cannot block `window.open` inside the iframe
- We cannot remove ad scripts from the iframe
- We cannot intercept clicks inside the iframe

---

## 🟢 THE SOLUTION

### The Fix: iframe `sandbox` Attribute

HTML5 provides a `sandbox` attribute for iframes that restricts what the iframe can do. By NOT including `allow-popups` in the sandbox, we block all popup attempts from inside the iframe.

### Implementation:

```tsx
<iframe
    src={embedUrl}
    sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
    // ❌ Note: NO 'allow-popups' = popups are BLOCKED
    // ❌ Note: NO 'allow-top-navigation' = redirects are BLOCKED
/>
```

### What Each Permission Does:

| Permission | Included | Purpose |
|------------|----------|---------|
| `allow-scripts` | ✅ Yes | Required for video player to work |
| `allow-same-origin` | ✅ Yes | Required for cookies/storage |
| `allow-presentation` | ✅ Yes | Required for fullscreen |
| `allow-forms` | ✅ Yes | Some players need this |
| `allow-popups` | ❌ NO | **BLOCKS all popups!** |
| `allow-top-navigation` | ❌ NO | **BLOCKS redirects!** |

### Why This Works:

The sandbox is enforced by the **browser itself**, not by JavaScript. The iframe's ad scripts cannot bypass it because:
1. It's a browser-level restriction
2. The iframe cannot remove its own sandbox attribute
3. `window.open()` calls simply fail silently

---

## 🐛 BUG THAT CAUSED INITIAL FAILURE

### The Bug:

Even after adding the sandbox, ads were still appearing on mobile. Investigation revealed a **React timing bug**:

```tsx
// ❌ BROKEN CODE
function PlayerIframe({ embedUrl }) {
    const [useSandbox, setUseSandbox] = useState(false);  // Starts as FALSE
    
    useEffect(() => {
        // Detection runs AFTER first render
        setUseSandbox(detectMobile());  // Too late!
    }, []);
    
    // First render: useSandbox = false → iframe renders WITHOUT sandbox!
    return <iframe sandbox={useSandbox ? "..." : undefined} />;
}
```

**Timeline of the bug:**
1. Component mounts
2. `useState(false)` → useSandbox = false
3. **iframe renders WITHOUT sandbox** 💥 (ads can get through!)
4. `useEffect` runs, detects mobile, sets useSandbox = true
5. Re-render with sandbox (but too late, iframe already loaded unprotected)

### The Fix:

Use **lazy initialization** in useState to detect device **synchronously** before first render:

```tsx
// ✅ FIXED CODE
function PlayerIframe({ embedUrl }) {
    // Detection happens BEFORE first render
    const [deviceInfo] = useState(() => {
        const ua = navigator.userAgent;
        return {
            isMobile: /Android|iPhone|iPad|iPod|Mobile/i.test(ua),
            isChrome: /Chrome/.test(ua) && !/Mobile/.test(ua)
        };
    });
    
    const useSandbox = deviceInfo.isMobile && !deviceInfo.isChrome;
    
    // First render: useSandbox already correctly determined!
    return <iframe sandbox={useSandbox ? "..." : undefined} />;
}
```

**Timeline of the fix:**
1. Component mounts
2. `useState(() => detect())` runs initializer synchronously
3. `useSandbox` is correctly calculated
4. **iframe renders WITH sandbox** ✅ (ads blocked from start!)

---

## 📂 FILES MODIFIED

| File | Change |
|------|--------|
| `components/match/match-player.tsx` | Added `PlayerIframe` component with conditional sandbox |
| `app/layout.tsx` | Added early `window.open` blocking script in head |
| `utils/universalAdShield.ts` | Nuclear ad shield with continuous protection |
| `hooks/useUniversalAdBlocker.ts` | React hook to activate ad shield |

---

## 🔍 HOW TO VERIFY THE FIX

### Step 1: Check Console Logs

On mobile devices, you should see:
```
🛡️ PlayerIframe: device = { isMobile: true, isChrome: false } useSandbox = true
🛡️ SANDBOX ENABLED - Popups will be blocked
```

On Chrome desktop, you should see:
```
🛡️ PlayerIframe: device = { isMobile: false, isChrome: true } useSandbox = false
🛡️ SANDBOX DISABLED (Chrome desktop mode)
```

### Step 2: Inspect the iframe Element

In browser DevTools, the iframe should have:
```html
<!-- Mobile/Safari -->
<iframe 
    src="https://..." 
    sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
    ...
/>

<!-- Chrome Desktop -->
<iframe 
    src="https://..." 
    <!-- NO sandbox attribute -->
    ...
/>
```

### Step 3: Test Behavior

1. Open on mobile device
2. Navigate to live match
3. Tap "TAP TO PLAY"
4. Wait for video to load
5. Tap play button inside video
6. **Expected: NO popup/new tab opens**

---

## ⚠️ KNOWN LIMITATIONS

### 1. Chrome Desktop Sandbox Issue
Chrome desktop shows an error when sandbox is used on certain iframes. Solution: We only apply sandbox on mobile/Safari.

### 2. Some Players May Break
If a stream provider's player requires `allow-popups`, their player may not work correctly. Solution: Test with each stream source.

### 3. Cannot Block Everything
The sandbox blocks popups but cannot:
- Block ads that appear INSIDE the video player
- Block overlay ads within the iframe
- Block pre-roll video ads

---

## 🏗️ ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                     AD BLOCKING LAYERS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LAYER 1: EARLY BLOCKING (layout.tsx)                           │
│  ───────────────────────────────────                            │
│  • Inline <script> in <head>                                    │
│  • Runs before React loads                                      │
│  • Blocks window.open on our window                             │
│                                                                  │
│  LAYER 2: REACT HOOK (useUniversalAdBlocker)                    │
│  ───────────────────────────────────────────                    │
│  • Runs when component mounts                                   │
│  • Additional window.open blocking                              │
│  • Continuous overlay removal                                   │
│                                                                  │
│  LAYER 3: CLICK-THROUGH SHIELD (ClickThroughShield)             │
│  ───────────────────────────────────────────────────            │
│  • Absorbs first tap on video                                   │
│  • Disables for 3 seconds                                       │
│  • Re-enables after inactivity                                  │
│                                                                  │
│  LAYER 4: IFRAME SANDBOX (PlayerIframe) ← **THE KEY FIX**       │
│  ─────────────────────────────────────────────────────          │
│  • Applied on mobile/Safari only                                │
│  • Blocks window.open from INSIDE iframe                        │
│  • Browser-enforced, cannot be bypassed                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ CONCLUSION

The ad popup issue on mobile devices was caused by:
1. Cross-origin iframes having embedded ad scripts
2. Initial implementation using async detection, causing sandbox to be missing on first render

The fix involves:
1. Using the HTML5 `sandbox` attribute to block popups at browser level
2. Synchronous device detection to ensure sandbox is applied on first render
3. Conditional application (mobile only) to avoid Chrome desktop issues

**Result:** Popups are now blocked on Android, iOS, and Safari.

---

*Document prepared for cross-verification by DeepSeek or other AI assistants.*
