(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Reedstreams-Mainx/components/match/match-player.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function MatchPlayer({ matchId }) {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const sportName = searchParams.get("sportName");
    const [streams, setStreams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStream, setSelectedStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [match, setMatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shieldActive, setShieldActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // COUNTDOWN STATE
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLive, setIsLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 1. INITIAL LOAD
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchPlayer.useEffect": ()=>{
            async function init() {
                try {
                    setLoading(true);
                    setError(null);
                    // Load Match Data
                    let foundMatch = null;
                    const stored = sessionStorage.getItem("currentMatch");
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (String(parsed.id) === String(matchId)) foundMatch = parsed;
                    }
                    if (!foundMatch) {
                        const res = await fetch("/api/matches");
                        if (res.ok) {
                            const list = await res.json();
                            foundMatch = list.find({
                                "MatchPlayer.useEffect.init": (m)=>String(m.id) === String(matchId)
                            }["MatchPlayer.useEffect.init"]);
                        }
                    }
                    if (!foundMatch) {
                        setError("Match data unavailable.");
                        setLoading(false);
                        return;
                    }
                    setMatch(foundMatch);
                    // CHECK TIME LOGIC
                    const matchTime = new Date(foundMatch.date).getTime();
                    const now = Date.now();
                    if (matchTime > now) {
                        setIsLive(false); // Match hasn't started
                        setLoading(false); // Stop loading, show countdown
                        return;
                    } else {
                        setIsLive(true); // Match is live, proceed to load streams
                    }
                    // Load Streams (Only if live)
                    if (!foundMatch.sources || foundMatch.sources.length === 0) {
                        setError("No streams found.");
                        setLoading(false);
                        return;
                    }
                    const promises = foundMatch.sources.map({
                        "MatchPlayer.useEffect.init.promises": (src)=>fetch(`/api/stream/${src.source}/${src.id}`).then({
                                "MatchPlayer.useEffect.init.promises": (r)=>r.json()
                            }["MatchPlayer.useEffect.init.promises"]).catch({
                                "MatchPlayer.useEffect.init.promises": ()=>[]
                            }["MatchPlayer.useEffect.init.promises"])
                    }["MatchPlayer.useEffect.init.promises"]);
                    const results = await Promise.all(promises);
                    const allStreams = [];
                    foundMatch.sources.forEach({
                        "MatchPlayer.useEffect.init": (src, i)=>{
                            if (Array.isArray(results[i])) {
                                results[i].forEach({
                                    "MatchPlayer.useEffect.init": (s)=>allStreams.push({
                                            ...s,
                                            sourceIdentifier: src.source
                                        })
                                }["MatchPlayer.useEffect.init"]);
                            }
                        }
                    }["MatchPlayer.useEffect.init"]);
                    if (allStreams.length === 0) {
                        setError("Streams are offline.");
                    } else {
                        setStreams(allStreams);
                        // Priority Logic
                        const isBasketball = sportName?.toLowerCase().includes("basketball");
                        let best = null;
                        if (isBasketball) best = allStreams.find({
                            "MatchPlayer.useEffect.init": (s)=>s.sourceIdentifier === "bravo #2"
                        }["MatchPlayer.useEffect.init"]);
                        if (!best) best = allStreams.find({
                            "MatchPlayer.useEffect.init": (s)=>s.sourceIdentifier === "admin" && s.streamNo === 1
                        }["MatchPlayer.useEffect.init"]);
                        if (!best) best = allStreams.find({
                            "MatchPlayer.useEffect.init": (s)=>s.hd
                        }["MatchPlayer.useEffect.init"]);
                        setSelectedStream(best || allStreams[0]);
                    }
                } catch (e) {
                    setError("System Error.");
                } finally{
                    setLoading(false);
                }
            }
            init();
        }
    }["MatchPlayer.useEffect"], [
        matchId,
        sportName
    ]);
    // 2. COUNTDOWN TIMER INTERVAL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchPlayer.useEffect": ()=>{
            if (!match || isLive) return;
            const timer = setInterval({
                "MatchPlayer.useEffect.timer": ()=>{
                    const matchTime = new Date(match.date).getTime();
                    const now = Date.now();
                    const diff = matchTime - now;
                    if (diff <= 0) {
                        setIsLive(true); // Time's up! Reload to get streams
                        window.location.reload();
                        clearInterval(timer);
                    } else {
                        const h = Math.floor(diff / (1000 * 60 * 60));
                        const m = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
                        const s = Math.floor(diff % (1000 * 60) / 1000);
                        setTimeLeft({
                            h,
                            m,
                            s
                        });
                    }
                }
            }["MatchPlayer.useEffect.timer"], 1000);
            return ({
                "MatchPlayer.useEffect": ()=>clearInterval(timer)
            })["MatchPlayer.useEffect"];
        }
    }["MatchPlayer.useEffect"], [
        match,
        isLive
    ]);
    // RESET SHIELD ON STREAM CHANGE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchPlayer.useEffect": ()=>{
            setShieldActive(true);
        }
    }["MatchPlayer.useEffect"], [
        selectedStream
    ]);
    // RENDER: LOADING
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "player-container loading-state",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "spinner"
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "ESTABLISHING UPLINK..."
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
    // RENDER: ERROR
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "player-container error-state",
        children: error
    }, void 0, false, {
        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
        lineNumber: 148,
        columnNumber: 21
    }, this);
    // RENDER: COUNTDOWN (If not started)
    if (!isLive && timeLeft) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "player-wrapper",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "player-container countdown-state",
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#050505',
                    color: '#fff'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '12px',
                            color: '#666',
                            letterSpacing: '2px',
                            marginBottom: '15px'
                        },
                        children: "BROADCAST BEGINS IN"
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 158,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '40px',
                            fontWeight: '900',
                            color: '#8db902',
                            fontFamily: 'monospace',
                            textShadow: '0 0 20px rgba(141, 185, 2, 0.4)'
                        },
                        children: [
                            String(timeLeft.h).padStart(2, '0'),
                            " : ",
                            String(timeLeft.m).padStart(2, '0'),
                            " : ",
                            String(timeLeft.s).padStart(2, '0')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 159,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            color: '#444',
                            marginTop: '10px'
                        },
                        children: "WAITING FOR SATELLITE SIGNAL"
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 165,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                lineNumber: 154,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
            lineNumber: 153,
            columnNumber: 9
        }, this);
    }
    // RENDER: PLAYER (If Live)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "player-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "player-container",
                children: [
                    shieldActive && selectedStream && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shield-overlay",
                        onClick: ()=>setShieldActive(false)
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 180,
                        columnNumber: 17
                    }, this),
                    selectedStream ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        src: selectedStream.embedUrl,
                        className: "video-iframe",
                        frameBorder: "0",
                        allowFullScreen: true,
                        allow: "autoplay; encrypted-media; picture-in-picture"
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 186,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "no-signal",
                        children: "NO SIGNAL"
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 194,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this),
            streams.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stream-selector",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stream-header",
                        children: [
                            "AVAILABLE SIGNALS (",
                            streams.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 201,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stream-list",
                        children: streams.map((stream, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `stream-btn ${selectedStream?.embedUrl === stream.embedUrl ? "active" : ""}`,
                                onClick: ()=>setSelectedStream(stream),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "signal-icon"
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                                        lineNumber: 209,
                                        columnNumber: 29
                                    }, this),
                                    stream.sourceIdentifier,
                                    " #",
                                    stream.streamNo,
                                    stream.hd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hd-badge",
                                        children: "HD"
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                                        lineNumber: 211,
                                        columnNumber: 43
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                                lineNumber: 204,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 202,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                lineNumber: 200,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_s(MatchPlayer, "rUaYyQ94hhVlC4jZNQtLKGKNmr8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = MatchPlayer;
var _c;
__turbopack_context__.k.register(_c, "MatchPlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Reedstreams-Mainx/app/match/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$components$2f$match$2f$match$2d$player$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/components/match/match-player.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-client] (ecmascript) <export default as Minimize>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tv$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/tv.js [app-client] (ecmascript) <export default as Tv>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/context/language-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
// 🔥 RESPONSIVE CSS ENGINE
const pageStyles = `
  /* BASE RESET */
  .match-page-container {
    min-height: 100vh;
    width: 100%;
    background: #050505;
    padding-bottom: 40px;
    overflow-x: hidden;
  }

  /* TOP NAV */
  .top-nav {
    max-width: 1600px;
    margin: 0 auto;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nav-back-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .nav-back-icon {
    width: 32px;
    height: 32px;
    background: #1a1a1a;
    border-radius: 6px; 
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border: 1px solid #222;
  }

  /* GRID SYSTEM */
  .match-grid {
    display: grid;
    gap: 20px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  
  /* LAYOUTS */
  .layout-standard { grid-template-columns: 1fr 340px; }
  .layout-cinema { grid-template-columns: 1fr; max-width: 1400px; }

  /* PLAYER */
  .player-wrapper {
    width: 100%;
    background: #000;
    aspect-ratio: 16/9;
    position: relative;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    z-index: 2;
  }

  /* 🔥 INFO BAR (CONTROL DECK STYLE) */
  .info-bar {
    margin-top: 15px;
    background: #0a0a0a; /* Premium Dark Background */
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .match-title-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .match-main-title {
    color: #fff;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.1;
    font-family: sans-serif;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  /* PULSING LIVE TAG */
  @keyframes pulse-live {
    0% { box-shadow: 0 0 0 0 rgba(141, 185, 2, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(141, 185, 2, 0); }
    100% { box-shadow: 0 0 0 0 rgba(141, 185, 2, 0); }
  }
  .live-tag {
    background: #8db902;
    color: #000;
    font-size: 11px;
    font-weight: 900;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    animation: pulse-live 2s infinite;
  }

  .time-tag {
    color: #666;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    background: #111;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #222;
  }

  /* CONTROLS GROUP */
  .controls-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  /* CHAT PANEL */
  .chat-panel {
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 650px;
    overflow: hidden;
    border-radius: 8px;
  }

  /* 🔥 MOBILE OPTIMIZATIONS */
  @media (max-width: 1024px) {
    .match-grid {
      grid-template-columns: 100%;
      padding: 0;
      gap: 0;
    }
    .top-nav { padding: 10px 15px; }
    .nav-back-wrapper { gap: 10px; }
    .player-wrapper { width: 100vw; }
    
    .info-bar { 
      margin-top: 0px !important; /* 🔥 FORCE ZERO MARGIN */
      border: none;
      background: transparent;
      padding: 12px 15px; 
      flex-direction: column; 
      gap: 15px; 
      align-items: stretch;
      border-bottom: 1px solid #1a1a1a;
      border-radius: 0;
    }
    
    .match-main-title {
        font-size: 18px; /* Slightly smaller on mobile */
    }

    /* Force Controls into One Row on Mobile */
    .controls-group {
      justify-content: space-between;
      width: 100%;
    }
    
    /* Make buttons smaller on mobile */
    .action-btn {
      padding: 8px 10px !important;
      font-size: 10px !important;
    }
    
    .chat-panel {
      height: 500px;
      margin-top: 10px;
      border-radius: 0;
      border-left: none; 
      border-right: none;
    }
  }
`;
function MatchPageContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const matchId = String(params.id);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    // --- STATES ---
    const [cinemaMode, setCinemaMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatAgreed, setChatAgreed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEmbed, setShowEmbed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // MATCH DATA
    const [matchTitle, setMatchTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Loading Stream...");
    const [startTime, setStartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchPageContent.useEffect": ()=>{
            const stored = sessionStorage.getItem("currentMatch");
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    // Title Logic: Prefer competition if no specific title, fallback to teams
                    const displayTitle = data.title || `${data.teams?.home?.name || 'Home'} vs ${data.teams?.away?.name || 'Away'}`;
                    setMatchTitle(displayTitle);
                    // Time Logic
                    if (data.date) {
                        const dateObj = new Date(data.date);
                        setStartTime(dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }));
                    }
                } catch (e) {
                    setMatchTitle("Live Stream");
                }
            }
        }
    }["MatchPageContent.useEffect"], []);
    // SHARING
    const currentUrl = ("TURBOPACK compile-time truthy", 1) ? window.location.href : "TURBOPACK unreachable";
    const shareText = `Watch ${matchTitle} Live on ReedStreams!`;
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`
    };
    const openShare = (url)=>{
        window.open(url, '_blank', 'width=600,height=400');
    };
    const embedCode = `<iframe src="https://reedstreams.com/embed/${matchId}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
    const handleCopy = ()=>{
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: pageStyles.__hash,
                children: pageStyles
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: cinemaMode ? '#000' : '#050505'
                },
                className: "match-page-container",
                children: [
                    !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "top-nav",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.back(),
                                className: "nav-back-wrapper",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "nav-back-icon",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                            lineNumber: 288,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 900,
                                            letterSpacing: '-1px',
                                            fontFamily: 'sans-serif'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#fff'
                                                },
                                                children: "REED"
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 292,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#8db902'
                                                },
                                                children: "STREAMS"
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 296,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `match-grid ${cinemaMode ? 'layout-cinema' : 'layout-standard'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "player-section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "player-wrapper",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$components$2f$match$2f$match$2d$player$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            matchId: matchId
                                        }, void 0, false, {
                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                            lineNumber: 308,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "info-bar",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "match-title-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "meta-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "live-tag",
                                                                children: "LIVE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                lineNumber: 317,
                                                                columnNumber: 21
                                                            }, this),
                                                            startTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "time-tag",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 320,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " Starts ",
                                                                    startTime
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                lineNumber: 319,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "match-main-title",
                                                        children: matchTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 315,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-end',
                                                    gap: '10px',
                                                    width: '100%',
                                                    flex: '1',
                                                    maxWidth: '500px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "controls-group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setCinemaMode(!cinemaMode),
                                                                style: {
                                                                    background: '#111',
                                                                    border: '1px solid #222',
                                                                    color: cinemaMode ? '#8db902' : '#ccc',
                                                                    padding: '8px 12px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '11px',
                                                                    fontWeight: 700,
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    textTransform: 'uppercase',
                                                                    flex: 1,
                                                                    justifyContent: 'center'
                                                                },
                                                                className: "action-btn",
                                                                children: [
                                                                    cinemaMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize$3e$__["Minimize"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 342,
                                                                        columnNumber: 39
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tv$3e$__["Tv"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 342,
                                                                        columnNumber: 63
                                                                    }, this),
                                                                    cinemaMode ? "Exit" : "Cinema"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 23
                                                            }, this),
                                                            !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: '6px',
                                                                    flex: 1,
                                                                    justifyContent: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>openShare(shareLinks.twitter),
                                                                        style: {
                                                                            background: '#000',
                                                                            border: '1px solid #222',
                                                                            padding: '8px',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer'
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"], {
                                                                            size: 16,
                                                                            color: "#1DA1F2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                            lineNumber: 349,
                                                                            columnNumber: 189
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 349,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>openShare(shareLinks.facebook),
                                                                        style: {
                                                                            background: '#000',
                                                                            border: '1px solid #222',
                                                                            padding: '8px',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer'
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"], {
                                                                            size: 16,
                                                                            color: "#1877F2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                            lineNumber: 350,
                                                                            columnNumber: 190
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 350,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>openShare(shareLinks.whatsapp),
                                                                        style: {
                                                                            background: '#000',
                                                                            border: '1px solid #222',
                                                                            padding: '8px',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer'
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            width: "16",
                                                                            height: "16",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "#25D366",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                                lineNumber: 352,
                                                                                columnNumber: 129
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                            lineNumber: 352,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 351,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 26
                                                            }, this),
                                                            !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setShowEmbed(!showEmbed),
                                                                style: {
                                                                    background: showEmbed ? '#222' : '#111',
                                                                    border: '1px solid #222',
                                                                    color: '#ccc',
                                                                    padding: '8px 12px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '11px',
                                                                    fontWeight: 700,
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    textTransform: 'uppercase',
                                                                    flex: 1,
                                                                    justifyContent: 'center'
                                                                },
                                                                className: "action-btn",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 369,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " Embed"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                lineNumber: 359,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 20
                                                    }, this),
                                                    showEmbed && !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: '100%',
                                                            animation: 'fadeIn 0.3s'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                background: '#000',
                                                                padding: '10px',
                                                                borderRadius: '6px',
                                                                border: '1px solid #222',
                                                                display: 'flex',
                                                                gap: '8px',
                                                                alignItems: 'center'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    readOnly: true,
                                                                    value: embedCode,
                                                                    style: {
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                        color: '#888',
                                                                        width: '100%',
                                                                        fontSize: '11px',
                                                                        fontFamily: 'monospace',
                                                                        outline: 'none'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                    lineNumber: 381,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleCopy,
                                                                    style: {
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        color: copied ? '#8db902' : '#fff'
                                                                    },
                                                                    children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 387,
                                                                        columnNumber: 39
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                        size: 16
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 387,
                                                                        columnNumber: 67
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                    lineNumber: 386,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowEmbed(false),
                                                                    style: {
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        color: '#444'
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                        lineNumber: 390,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                    lineNumber: 389,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 328,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '12px 15px',
                                            borderBottom: '1px solid #222',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#0f0f0f'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    fontSize: '13px'
                                                },
                                                children: "Live Chat"
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '11px',
                                                    color: '#888'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: '6px',
                                                            height: '6px',
                                                            background: '#8db902',
                                                            borderRadius: '50%'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 23
                                                    }, this),
                                                    "1.2k"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 408,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 406,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            position: 'relative',
                                            background: '#050505'
                                        },
                                        children: [
                                            !chatAgreed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'rgba(5,5,5,0.9)',
                                                    backdropFilter: 'blur(4px)',
                                                    zIndex: 10,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '20px',
                                                    textAlign: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        size: 28,
                                                        color: "#8db902",
                                                        style: {
                                                            marginBottom: '10px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '800',
                                                            margin: '0 0 5px 0'
                                                        },
                                                        children: "Chat Rules"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            color: '#888',
                                                            fontSize: '11px',
                                                            lineHeight: '1.4',
                                                            marginBottom: '15px',
                                                            maxWidth: '180px'
                                                        },
                                                        children: "Be respectful. No hate speech. No spamming."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setChatAgreed(true),
                                                        style: {
                                                            background: '#8db902',
                                                            color: '#000',
                                                            border: 'none',
                                                            padding: '8px 24px',
                                                            borderRadius: '4px',
                                                            fontSize: '11px',
                                                            fontWeight: '800',
                                                            cursor: 'pointer',
                                                            textTransform: 'uppercase'
                                                        },
                                                        children: "I Agree"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 429,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '15px',
                                                    height: '100%',
                                                    overflowY: 'auto'
                                                },
                                                className: "chat-messages",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: '#444',
                                                            fontSize: '11px',
                                                            marginBottom: '10px',
                                                            textAlign: 'center',
                                                            borderBottom: '1px solid #111',
                                                            paddingBottom: '10px'
                                                        },
                                                        children: "Welcome to the chat room."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 21
                                                    }, this),
                                                    [
                                                        1,
                                                        2,
                                                        3,
                                                        4,
                                                        5
                                                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                marginBottom: '8px',
                                                                fontSize: '12px',
                                                                display: 'flex',
                                                                gap: '8px'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: i % 2 === 0 ? '#8db902' : '#4a9eff',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '11px'
                                                                    },
                                                                    children: [
                                                                        "User",
                                                                        i * 99,
                                                                        ":"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                    lineNumber: 449,
                                                                    columnNumber: 26
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: '#ccc'
                                                                    },
                                                                    children: "This stream is fire! 🔥"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                                    lineNumber: 450,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                            lineNumber: 448,
                                                            columnNumber: 24
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 443,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 415,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '12px',
                                            borderTop: '1px solid #222',
                                            background: '#0f0f0f'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: chatAgreed ? "Type a message..." : "Agree to rules first",
                                            disabled: !chatAgreed,
                                            style: {
                                                width: '100%',
                                                background: '#050505',
                                                border: '1px solid #222',
                                                padding: '10px 12px',
                                                borderRadius: '4px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                outline: 'none'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                            lineNumber: 459,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 458,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 403,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(MatchPageContent, "LWwqVwDBVB0lOr8camov8tF7n14=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = MatchPageContent;
function MatchPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: '#444',
                textAlign: 'center',
                marginTop: '50px'
            },
            children: "Loading Arena..."
        }, void 0, false, {
            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
            lineNumber: 480,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MatchPageContent, {}, void 0, false, {
            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
            lineNumber: 481,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
        lineNumber: 480,
        columnNumber: 5
    }, this);
}
_c1 = MatchPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "MatchPageContent");
__turbopack_context__.k.register(_c1, "MatchPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/Reedstreams-Mainx/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
__turbopack_context__.r("[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/client-only/index.js [app-client] (ecmascript)");
var React = __turbopack_context__.r("[project]/Reedstreams-Mainx/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
        'default': e
    };
}
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
/*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/ function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var isProd = typeof __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && ("TURBOPACK compile-time value", "development") === "production";
var isString = function(o) {
    return Object.prototype.toString.call(o) === "[object String]";
};
var StyleSheet = /*#__PURE__*/ function() {
    function StyleSheet(param) {
        var ref = param === void 0 ? {} : param, _name = ref.name, name = _name === void 0 ? "stylesheet" : _name, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? isProd : _optimizeForSpeed;
        invariant$1(isString(name), "`name` must be a string");
        this._name = name;
        this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
        invariant$1(typeof optimizeForSpeed === "boolean", "`optimizeForSpeed` must be a boolean");
        this._optimizeForSpeed = optimizeForSpeed;
        this._serverSheet = undefined;
        this._tags = [];
        this._injected = false;
        this._rulesCount = 0;
        var node = typeof window !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
        this._nonce = node ? node.getAttribute("content") : null;
    }
    var _proto = StyleSheet.prototype;
    _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
        invariant$1(typeof bool === "boolean", "`setOptimizeForSpeed` accepts a boolean");
        invariant$1(this._rulesCount === 0, "optimizeForSpeed cannot be when rules have already been inserted");
        this.flush();
        this._optimizeForSpeed = bool;
        this.inject();
    };
    _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
        return this._optimizeForSpeed;
    };
    _proto.inject = function inject() {
        var _this = this;
        invariant$1(!this._injected, "sheet already injected");
        this._injected = true;
        if (typeof window !== "undefined" && this._optimizeForSpeed) {
            this._tags[0] = this.makeStyleTag(this._name);
            this._optimizeForSpeed = "insertRule" in this.getSheet();
            if (!this._optimizeForSpeed) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.");
                }
                this.flush();
                this._injected = true;
            }
            return;
        }
        this._serverSheet = {
            cssRules: [],
            insertRule: function(rule, index) {
                if (typeof index === "number") {
                    _this._serverSheet.cssRules[index] = {
                        cssText: rule
                    };
                } else {
                    _this._serverSheet.cssRules.push({
                        cssText: rule
                    });
                }
                return index;
            },
            deleteRule: function(index) {
                _this._serverSheet.cssRules[index] = null;
            }
        };
    };
    _proto.getSheetForTag = function getSheetForTag(tag) {
        if (tag.sheet) {
            return tag.sheet;
        }
        // this weirdness brought to you by firefox
        for(var i = 0; i < document.styleSheets.length; i++){
            if (document.styleSheets[i].ownerNode === tag) {
                return document.styleSheets[i];
            }
        }
    };
    _proto.getSheet = function getSheet() {
        return this.getSheetForTag(this._tags[this._tags.length - 1]);
    };
    _proto.insertRule = function insertRule(rule, index) {
        invariant$1(isString(rule), "`insertRule` accepts only strings");
        if (typeof window === "undefined") {
            if (typeof index !== "number") {
                index = this._serverSheet.cssRules.length;
            }
            this._serverSheet.insertRule(rule, index);
            return this._rulesCount++;
        }
        if (this._optimizeForSpeed) {
            var sheet = this.getSheet();
            if (typeof index !== "number") {
                index = sheet.cssRules.length;
            }
            // this weirdness for perf, and chrome's weird bug
            // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                return -1;
            }
        } else {
            var insertionPoint = this._tags[index];
            this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
        }
        return this._rulesCount++;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
        if (this._optimizeForSpeed || typeof window === "undefined") {
            var sheet = typeof window !== "undefined" ? this.getSheet() : this._serverSheet;
            if (!rule.trim()) {
                rule = this._deletedRulePlaceholder;
            }
            if (!sheet.cssRules[index]) {
                // @TBD Should we throw an error?
                return index;
            }
            sheet.deleteRule(index);
            try {
                sheet.insertRule(rule, index);
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                }
                // In order to preserve the indices we insert a deleteRulePlaceholder
                sheet.insertRule(this._deletedRulePlaceholder, index);
            }
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "old rule at index `" + index + "` not found");
            tag.textContent = rule;
        }
        return index;
    };
    _proto.deleteRule = function deleteRule(index) {
        if (typeof window === "undefined") {
            this._serverSheet.deleteRule(index);
            return;
        }
        if (this._optimizeForSpeed) {
            this.replaceRule(index, "");
        } else {
            var tag = this._tags[index];
            invariant$1(tag, "rule at index `" + index + "` not found");
            tag.parentNode.removeChild(tag);
            this._tags[index] = null;
        }
    };
    _proto.flush = function flush() {
        this._injected = false;
        this._rulesCount = 0;
        if (typeof window !== "undefined") {
            this._tags.forEach(function(tag) {
                return tag && tag.parentNode.removeChild(tag);
            });
            this._tags = [];
        } else {
            // simpler on server
            this._serverSheet.cssRules = [];
        }
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        if (typeof window === "undefined") {
            return this._serverSheet.cssRules;
        }
        return this._tags.reduce(function(rules, tag) {
            if (tag) {
                rules = rules.concat(Array.prototype.map.call(_this.getSheetForTag(tag).cssRules, function(rule) {
                    return rule.cssText === _this._deletedRulePlaceholder ? null : rule;
                }));
            } else {
                rules.push(null);
            }
            return rules;
        }, []);
    };
    _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
        if (cssString) {
            invariant$1(isString(cssString), "makeStyleTag accepts only strings as second parameter");
        }
        var tag = document.createElement("style");
        if (this._nonce) tag.setAttribute("nonce", this._nonce);
        tag.type = "text/css";
        tag.setAttribute("data-" + name, "");
        if (cssString) {
            tag.appendChild(document.createTextNode(cssString));
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        if (relativeToTag) {
            head.insertBefore(tag, relativeToTag);
        } else {
            head.appendChild(tag);
        }
        return tag;
    };
    _createClass(StyleSheet, [
        {
            key: "length",
            get: function get() {
                return this._rulesCount;
            }
        }
    ]);
    return StyleSheet;
}();
function invariant$1(condition, message) {
    if (!condition) {
        throw new Error("StyleSheet: " + message + ".");
    }
}
function hash(str) {
    var _$hash = 5381, i = str.length;
    while(i){
        _$hash = _$hash * 33 ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */ return _$hash >>> 0;
}
var stringHash = hash;
var sanitize = function(rule) {
    return rule.replace(/\/style/gi, "\\/style");
};
var cache = {};
/**
 * computeId
 *
 * Compute and memoize a jsx id from a basedId and optionally props.
 */ function computeId(baseId, props) {
    if (!props) {
        return "jsx-" + baseId;
    }
    var propsToString = String(props);
    var key = baseId + propsToString;
    if (!cache[key]) {
        cache[key] = "jsx-" + stringHash(baseId + "-" + propsToString);
    }
    return cache[key];
}
/**
 * computeSelector
 *
 * Compute and memoize dynamic selectors.
 */ function computeSelector(id, css) {
    var selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
    // Sanitize SSR-ed CSS.
    // Client side code doesn't need to be sanitized since we use
    // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
    if (typeof window === "undefined") {
        css = sanitize(css);
    }
    var idcss = id + css;
    if (!cache[idcss]) {
        cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
    }
    return cache[idcss];
}
function mapRulesToStyle(cssRules, options) {
    if (options === void 0) options = {};
    return cssRules.map(function(args) {
        var id = args[0];
        var css = args[1];
        return /*#__PURE__*/ React__default["default"].createElement("style", {
            id: "__" + id,
            // Avoid warnings upon render with a key
            key: "__" + id,
            nonce: options.nonce ? options.nonce : undefined,
            dangerouslySetInnerHTML: {
                __html: css
            }
        });
    });
}
var StyleSheetRegistry = /*#__PURE__*/ function() {
    function StyleSheetRegistry(param) {
        var ref = param === void 0 ? {} : param, _styleSheet = ref.styleSheet, styleSheet = _styleSheet === void 0 ? null : _styleSheet, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? false : _optimizeForSpeed;
        this._sheet = styleSheet || new StyleSheet({
            name: "styled-jsx",
            optimizeForSpeed: optimizeForSpeed
        });
        this._sheet.inject();
        if (styleSheet && typeof optimizeForSpeed === "boolean") {
            this._sheet.setOptimizeForSpeed(optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    }
    var _proto = StyleSheetRegistry.prototype;
    _proto.add = function add(props) {
        var _this = this;
        if (undefined === this._optimizeForSpeed) {
            this._optimizeForSpeed = Array.isArray(props.children);
            this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);
            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
        }
        if (typeof window !== "undefined" && !this._fromServer) {
            this._fromServer = this.selectFromServer();
            this._instancesCounts = Object.keys(this._fromServer).reduce(function(acc, tagName) {
                acc[tagName] = 0;
                return acc;
            }, {});
        }
        var ref = this.getIdAndRules(props), styleId = ref.styleId, rules = ref.rules;
        // Deduping: just increase the instances count.
        if (styleId in this._instancesCounts) {
            this._instancesCounts[styleId] += 1;
            return;
        }
        var indices = rules.map(function(rule) {
            return _this._sheet.insertRule(rule);
        }) // Filter out invalid rules
        .filter(function(index) {
            return index !== -1;
        });
        this._indices[styleId] = indices;
        this._instancesCounts[styleId] = 1;
    };
    _proto.remove = function remove(props) {
        var _this = this;
        var styleId = this.getIdAndRules(props).styleId;
        invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
        this._instancesCounts[styleId] -= 1;
        if (this._instancesCounts[styleId] < 1) {
            var tagFromServer = this._fromServer && this._fromServer[styleId];
            if (tagFromServer) {
                tagFromServer.parentNode.removeChild(tagFromServer);
                delete this._fromServer[styleId];
            } else {
                this._indices[styleId].forEach(function(index) {
                    return _this._sheet.deleteRule(index);
                });
                delete this._indices[styleId];
            }
            delete this._instancesCounts[styleId];
        }
    };
    _proto.update = function update(props, nextProps) {
        this.add(nextProps);
        this.remove(props);
    };
    _proto.flush = function flush() {
        this._sheet.flush();
        this._sheet.inject();
        this._fromServer = undefined;
        this._indices = {};
        this._instancesCounts = {};
    };
    _proto.cssRules = function cssRules() {
        var _this = this;
        var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function(styleId) {
            return [
                styleId,
                _this._fromServer[styleId]
            ];
        }) : [];
        var cssRules = this._sheet.cssRules();
        return fromServer.concat(Object.keys(this._indices).map(function(styleId) {
            return [
                styleId,
                _this._indices[styleId].map(function(index) {
                    return cssRules[index].cssText;
                }).join(_this._optimizeForSpeed ? "" : "\n")
            ];
        }) // filter out empty rules
        .filter(function(rule) {
            return Boolean(rule[1]);
        }));
    };
    _proto.styles = function styles(options) {
        return mapRulesToStyle(this.cssRules(), options);
    };
    _proto.getIdAndRules = function getIdAndRules(props) {
        var css = props.children, dynamic = props.dynamic, id = props.id;
        if (dynamic) {
            var styleId = computeId(id, dynamic);
            return {
                styleId: styleId,
                rules: Array.isArray(css) ? css.map(function(rule) {
                    return computeSelector(styleId, rule);
                }) : [
                    computeSelector(styleId, css)
                ]
            };
        }
        return {
            styleId: computeId(id),
            rules: Array.isArray(css) ? css : [
                css
            ]
        };
    };
    /**
   * selectFromServer
   *
   * Collects style tags from the document with id __jsx-XXX
   */ _proto.selectFromServer = function selectFromServer() {
        var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
        return elements.reduce(function(acc, element) {
            var id = element.id.slice(2);
            acc[id] = element;
            return acc;
        }, {});
    };
    return StyleSheetRegistry;
}();
function invariant(condition, message) {
    if (!condition) {
        throw new Error("StyleSheetRegistry: " + message + ".");
    }
}
var StyleSheetContext = /*#__PURE__*/ React.createContext(null);
StyleSheetContext.displayName = "StyleSheetContext";
function createStyleRegistry() {
    return new StyleSheetRegistry();
}
function StyleRegistry(param) {
    var configuredRegistry = param.registry, children = param.children;
    var rootRegistry = React.useContext(StyleSheetContext);
    var ref = React.useState({
        "StyleRegistry.useState[ref]": function() {
            return rootRegistry || configuredRegistry || createStyleRegistry();
        }
    }["StyleRegistry.useState[ref]"]), registry = ref[0];
    return /*#__PURE__*/ React__default["default"].createElement(StyleSheetContext.Provider, {
        value: registry
    }, children);
}
function useStyleRegistry() {
    return React.useContext(StyleSheetContext);
}
// Opt-into the new `useInsertionEffect` API in React 18, fallback to `useLayoutEffect`.
// https://github.com/reactwg/react-18/discussions/110
var useInsertionEffect = React__default["default"].useInsertionEffect || React__default["default"].useLayoutEffect;
var defaultRegistry = typeof window !== "undefined" ? createStyleRegistry() : undefined;
function JSXStyle(props) {
    var registry = defaultRegistry ? defaultRegistry : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
        return null;
    }
    if (typeof window === "undefined") {
        registry.add(props);
        return null;
    }
    useInsertionEffect({
        "JSXStyle.useInsertionEffect": function() {
            registry.add(props);
            return ({
                "JSXStyle.useInsertionEffect": function() {
                    registry.remove(props);
                }
            })["JSXStyle.useInsertionEffect"];
        // props.children can be string[], will be striped since id is identical
        }
    }["JSXStyle.useInsertionEffect"], [
        props.id,
        String(props.dynamic)
    ]);
    return null;
}
JSXStyle.dynamic = function(info) {
    return info.map(function(tagInfo) {
        var baseId = tagInfo[0];
        var props = tagInfo[1];
        return computeId(baseId, props);
    }).join(" ");
};
exports.StyleRegistry = StyleRegistry;
exports.createStyleRegistry = createStyleRegistry;
exports.style = JSXStyle;
exports.useStyleRegistry = useStyleRegistry;
}),
"[project]/Reedstreams-Mainx/node_modules/styled-jsx/style.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/Reedstreams-Mainx/node_modules/styled-jsx/dist/index/index.js [app-client] (ecmascript)").style;
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>ArrowLeft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const ArrowLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ArrowLeft", [
    [
        "path",
        {
            d: "m12 19-7-7 7-7",
            key: "1l729n"
        }
    ],
    [
        "path",
        {
            d: "M19 12H5",
            key: "x3x0zl"
        }
    ]
]);
;
 //# sourceMappingURL=arrow-left.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Minimize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Minimize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Minimize", [
    [
        "path",
        {
            d: "M8 3v3a2 2 0 0 1-2 2H3",
            key: "hohbtr"
        }
    ],
    [
        "path",
        {
            d: "M21 8h-3a2 2 0 0 1-2-2V3",
            key: "5jw1f3"
        }
    ],
    [
        "path",
        {
            d: "M3 16h3a2 2 0 0 1 2 2v3",
            key: "198tvr"
        }
    ],
    [
        "path",
        {
            d: "M16 21v-3a2 2 0 0 1 2-2h3",
            key: "ph8mxp"
        }
    ]
]);
;
 //# sourceMappingURL=minimize.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-client] (ecmascript) <export default as Minimize>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Minimize",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Share2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Share2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Share2", [
    [
        "circle",
        {
            cx: "18",
            cy: "5",
            r: "3",
            key: "gq8acd"
        }
    ],
    [
        "circle",
        {
            cx: "6",
            cy: "12",
            r: "3",
            key: "w7nqdw"
        }
    ],
    [
        "circle",
        {
            cx: "18",
            cy: "19",
            r: "3",
            key: "1xt0gg"
        }
    ],
    [
        "line",
        {
            x1: "8.59",
            x2: "15.42",
            y1: "13.51",
            y2: "17.49",
            key: "47mynk"
        }
    ],
    [
        "line",
        {
            x1: "15.41",
            x2: "8.59",
            y1: "6.51",
            y2: "10.49",
            key: "1n3mei"
        }
    ]
]);
;
 //# sourceMappingURL=share-2.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Share2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Copy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Copy", [
    [
        "rect",
        {
            width: "14",
            height: "14",
            x: "8",
            y: "8",
            rx: "2",
            ry: "2",
            key: "17jyea"
        }
    ],
    [
        "path",
        {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
            key: "zix9uf"
        }
    ]
]);
;
 //# sourceMappingURL=copy.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>TriangleAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("TriangleAlert", [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
]);
;
 //# sourceMappingURL=triangle-alert.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>CircleCheckBig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const CircleCheckBig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("CircleCheckBig", [
    [
        "path",
        {
            d: "M21.801 10A10 10 0 1 1 17 3.335",
            key: "yps3ct"
        }
    ],
    [
        "path",
        {
            d: "m9 11 3 3L22 4",
            key: "1pflzl"
        }
    ]
]);
;
 //# sourceMappingURL=circle-check-big.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Twitter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Twitter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Twitter", [
    [
        "path",
        {
            d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
            key: "pff0z6"
        }
    ]
]);
;
 //# sourceMappingURL=twitter.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript) <export default as Twitter>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Twitter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Facebook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Facebook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Facebook", [
    [
        "path",
        {
            d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
            key: "1jg4f8"
        }
    ]
]);
;
 //# sourceMappingURL=facebook.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript) <export default as Facebook>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Facebook",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/tv.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Tv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Tv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Tv", [
    [
        "rect",
        {
            width: "20",
            height: "15",
            x: "2",
            y: "7",
            rx: "2",
            ry: "2",
            key: "10ag99"
        }
    ],
    [
        "polyline",
        {
            points: "17 2 12 7 7 2",
            key: "11pgbg"
        }
    ]
]);
;
 //# sourceMappingURL=tv.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/tv.js [app-client] (ecmascript) <export default as Tv>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tv",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/tv.js [app-client] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Clock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Clock", [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "polyline",
        {
            points: "12 6 12 12 16 14",
            key: "68esgv"
        }
    ]
]);
;
 //# sourceMappingURL=clock.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Clock",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Reedstreams-Mainx_348f64a3._.js.map