module.exports = [
"[project]/Reedstreams-Mainx/components/match/match-player.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function MatchPlayer({ matchId }) {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const sportName = searchParams.get("sportName");
    const [streams, setStreams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStream, setSelectedStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [match, setMatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shieldActive, setShieldActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // COUNTDOWN STATE
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLive, setIsLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 1. INITIAL LOAD
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
                        foundMatch = list.find((m)=>String(m.id) === String(matchId));
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
                const promises = foundMatch.sources.map((src)=>fetch(`/api/stream/${src.source}/${src.id}`).then((r)=>r.json()).catch(()=>[]));
                const results = await Promise.all(promises);
                const allStreams = [];
                foundMatch.sources.forEach((src, i)=>{
                    if (Array.isArray(results[i])) {
                        results[i].forEach((s)=>allStreams.push({
                                ...s,
                                sourceIdentifier: src.source
                            }));
                    }
                });
                if (allStreams.length === 0) {
                    setError("Streams are offline.");
                } else {
                    setStreams(allStreams);
                    // Priority Logic
                    const isBasketball = sportName?.toLowerCase().includes("basketball");
                    let best = null;
                    if (isBasketball) best = allStreams.find((s)=>s.sourceIdentifier === "bravo #2");
                    if (!best) best = allStreams.find((s)=>s.sourceIdentifier === "admin" && s.streamNo === 1);
                    if (!best) best = allStreams.find((s)=>s.hd);
                    setSelectedStream(best || allStreams[0]);
                }
            } catch (e) {
                setError("System Error.");
            } finally{
                setLoading(false);
            }
        }
        init();
    }, [
        matchId,
        sportName
    ]);
    // 2. COUNTDOWN TIMER INTERVAL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!match || isLive) return;
        const timer = setInterval(()=>{
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
        }, 1000);
        return ()=>clearInterval(timer);
    }, [
        match,
        isLive
    ]);
    // RESET SHIELD ON STREAM CHANGE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setShieldActive(true);
    }, [
        selectedStream
    ]);
    // RENDER: LOADING
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "player-container loading-state",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "spinner"
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "player-container error-state",
        children: error
    }, void 0, false, {
        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
        lineNumber: 148,
        columnNumber: 21
    }, this);
    // RENDER: COUNTDOWN (If not started)
    if (!isLive && timeLeft) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "player-wrapper",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "player-wrapper",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "player-container",
                children: [
                    shieldActive && selectedStream && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shield-overlay",
                        onClick: ()=>setShieldActive(false)
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 180,
                        columnNumber: 17
                    }, this),
                    selectedStream ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        src: selectedStream.embedUrl,
                        className: "video-iframe",
                        frameBorder: "0",
                        allowFullScreen: true,
                        allow: "autoplay; encrypted-media; picture-in-picture"
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                        lineNumber: 186,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            streams.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stream-selector",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stream-list",
                        children: streams.map((stream, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `stream-btn ${selectedStream?.embedUrl === stream.embedUrl ? "active" : ""}`,
                                onClick: ()=>setSelectedStream(stream),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "signal-icon"
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/components/match/match-player.tsx",
                                        lineNumber: 209,
                                        columnNumber: 29
                                    }, this),
                                    stream.sourceIdentifier,
                                    " #",
                                    stream.streamNo,
                                    stream.hd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/Reedstreams-Mainx/components/match/match-info.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function MatchInfo({ matchId }) {
    const [match, setMatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function load() {
            try {
                // 1. Check Session Storage first (Speed)
                const stored = sessionStorage.getItem("currentMatch");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (String(parsed.id) === String(matchId)) {
                        setMatch(parsed);
                        setLoading(false);
                        return;
                    }
                }
                // 2. Fetch from API if needed
                const res = await fetch("/api/matches");
                if (res.ok) {
                    const list = await res.json();
                    const found = list.find((m)=>String(m.id) === String(matchId));
                    if (found) setMatch(found);
                }
            } catch (e) {
                console.error("Info Load Error", e);
            } finally{
                setLoading(false);
            }
        }
        load();
    }, [
        matchId
    ]);
    if (loading || !match) return null; // Hide if loading/error to keep UI clean
    // Helper to format date nicely
    const dateObj = new Date(match.date);
    const time = dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    const dayDate = dateObj.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    // PARSING TEAMS (If your API just gives a "Title" string like "Team A vs Team B")
    // If your API gives real team objects, use those instead.
    const teams = match.title.split(' vs ');
    const homeName = teams[0] || "Home Team";
    const awayName = teams[1] || "Away Team";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "match-info-strip",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "info-time-block",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "info-time",
                        children: time
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "info-date",
                        children: dayDate
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                        lineNumber: 67,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "info-teams-block",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "team-side home",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "team-name",
                                children: homeName
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                                lineNumber: 73,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "team-logo-placeholder",
                                children: homeName[0]
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                                lineNumber: 75,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                        lineNumber: 72,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "vs-tag",
                        children: "VS"
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                        lineNumber: 78,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "team-side away",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "team-logo-placeholder",
                                children: awayName[0]
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                                lineNumber: 81,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "team-name",
                                children: awayName
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                                lineNumber: 82,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "info-status-block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "live-badge",
                    children: "LIVE EVENT"
                }, void 0, false, {
                    fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                    lineNumber: 88,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Reedstreams-Mainx/components/match/match-info.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/Reedstreams-Mainx/app/match/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$components$2f$match$2f$match$2d$player$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/components/match/match-player.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$components$2f$match$2f$match$2d$info$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/components/match/match-info.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/maximize.js [app-ssr] (ecmascript) <export default as Maximize>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-ssr] (ecmascript) <export default as Minimize>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-ssr] (ecmascript) <export default as Twitter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-ssr] (ecmascript) <export default as Facebook>");
// 🔥 IMPORT LANGUAGE HOOK
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/context/language-context.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function MatchPageContent() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const matchId = String(params.id);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    // --- STATES ---
    const [cinemaMode, setCinemaMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatAgreed, setChatAgreed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEmbed, setShowEmbed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // --- EMBED CODE GENERATOR ---
    const embedCode = `<iframe src="https://reedstreams.com/embed/${matchId}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
    const handleCopy = ()=>{
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: cinemaMode ? '#000' : '#050505',
            paddingBottom: '40px',
            transition: 'background 0.5s ease'
        },
        children: [
            !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: '1600px',
                    margin: '0 auto',
                    padding: '20px 20px 10px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        style: {
                            background: 'transparent',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            transition: 'color 0.2s'
                        },
                        onMouseEnter: (e)=>e.currentTarget.style.color = '#fff',
                        onMouseLeave: (e)=>e.currentTarget.style.color = '#888',
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 81,
                                columnNumber: 15
                            }, this),
                            " ",
                            t.back_to_home || "Back"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '10px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://discord.gg/yourlink",
                            target: "_blank",
                            style: {
                                background: '#5865F2',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                    lineNumber: 90,
                                    columnNumber: 16
                                }, this),
                                " Discord"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                            lineNumber: 86,
                            columnNumber: 14
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `match-grid ${cinemaMode ? 'cinema-active' : ''}`,
                style: {
                    display: 'grid',
                    gridTemplateColumns: cinemaMode ? '1fr' : '1fr 340px',
                    gap: '20px',
                    maxWidth: '1600px',
                    margin: '0 auto',
                    padding: '0 20px',
                    transition: 'all 0.4s ease'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "player-section",
                        style: {
                            maxWidth: cinemaMode ? '1200px' : '100%',
                            margin: cinemaMode ? '0 auto' : '0'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginBottom: '10px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCinemaMode(!cinemaMode),
                                    style: {
                                        background: cinemaMode ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: cinemaMode ? '#8db902' : '#666',
                                        border: '1px solid #333',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    },
                                    children: [
                                        cinemaMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize$3e$__["Minimize"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 31
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize$3e$__["Maximize"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 55
                                        }, this),
                                        cinemaMode ? "Exit Cinema" : "Cinema Mode"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$components$2f$match$2f$match$2d$player$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                matchId: matchId
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$components$2f$match$2f$match$2d$info$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                matchId: matchId
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this),
                            !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '20px',
                                    background: '#0a0a0a',
                                    border: '1px solid #1a1a1a',
                                    borderRadius: '8px',
                                    padding: '15px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '15px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '10px',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#666',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase'
                                                        },
                                                        children: "Share:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: {
                                                            background: '#1DA1F2',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '6px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Twitter$3e$__["Twitter"], {
                                                            size: 16,
                                                            color: "#fff"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                            lineNumber: 148,
                                                            columnNumber: 128
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: {
                                                            background: '#25D366',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '6px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                            size: 16,
                                                            color: "#fff"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 128
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        style: {
                                                            background: '#1877F2',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '6px',
                                                            cursor: 'pointer'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Facebook$3e$__["Facebook"], {
                                                            size: 16,
                                                            color: "#fff"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                            lineNumber: 150,
                                                            columnNumber: 128
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowEmbed(!showEmbed),
                                                style: {
                                                    background: '#222',
                                                    border: '1px solid #333',
                                                    color: '#ccc',
                                                    padding: '6px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    gap: '6px',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Embed Stream"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, this),
                                    showEmbed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '15px',
                                            background: '#000',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: '1px solid #222',
                                            display: 'flex',
                                            gap: '10px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                readOnly: true,
                                                value: embedCode,
                                                style: {
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#888',
                                                    width: '100%',
                                                    fontSize: '11px',
                                                    fontFamily: 'monospace'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleCopy,
                                                style: {
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: copied ? '#8db902' : '#fff'
                                                },
                                                children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 33
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 61
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 164,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 142,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    !cinemaMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chat-panel",
                        style: {
                            height: '600px',
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#0a0a0a',
                            border: '1px solid #1a1a1a',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-header",
                                style: {
                                    padding: '10px 15px',
                                    borderBottom: '1px solid #222',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#0f0f0f'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '13px'
                                        },
                                        children: "Live Chat"
                                    }, void 0, false, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 185,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "live-indicator",
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '11px',
                                            color: '#888'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "live-dot",
                                                style: {
                                                    width: '6px',
                                                    height: '6px',
                                                    background: 'red',
                                                    borderRadius: '50%'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 187,
                                                columnNumber: 21
                                            }, this),
                                            "1.2k Online"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    position: 'relative',
                                    background: '#050505'
                                },
                                children: [
                                    !chatAgreed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'rgba(5,5,5,0.85)',
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 32,
                                                color: "#8db902",
                                                style: {
                                                    marginBottom: '10px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    margin: '0 0 5px 0'
                                                },
                                                children: "Community Rules"
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#888',
                                                    fontSize: '11px',
                                                    lineHeight: '1.4',
                                                    marginBottom: '15px'
                                                },
                                                children: [
                                                    "1. No hate speech or abuse.",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 50
                                                    }, this),
                                                    "2. Respect other users.",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 46
                                                    }, this),
                                                    "3. Don't spam links."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setChatAgreed(true),
                                                style: {
                                                    background: '#8db902',
                                                    color: '#000',
                                                    border: 'none',
                                                    padding: '8px 20px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                },
                                                children: "I Agree"
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 209,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 197,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "chat-messages",
                                        style: {
                                            padding: '15px',
                                            height: '100%',
                                            overflowY: 'auto'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "chat-msg system",
                                                style: {
                                                    color: '#444',
                                                    fontSize: '11px',
                                                    marginBottom: '8px',
                                                    fontStyle: 'italic'
                                                },
                                                children: "Welcome to the chat room."
                                            }, void 0, false, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 223,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "chat-msg",
                                                style: {
                                                    marginBottom: '6px',
                                                    fontSize: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#8db902',
                                                            fontWeight: 'bold',
                                                            marginRight: '6px'
                                                        },
                                                        children: "User192:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 91
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#ccc'
                                                        },
                                                        children: "Stream looks clean today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 176
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 224,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "chat-msg",
                                                style: {
                                                    marginBottom: '6px',
                                                    fontSize: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#4a9eff',
                                                            fontWeight: 'bold',
                                                            marginRight: '6px'
                                                        },
                                                        children: "Alex:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 91
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#ccc'
                                                        },
                                                        children: "Lets go team!!"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 173
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 225,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "chat-msg",
                                                style: {
                                                    marginBottom: '6px',
                                                    fontSize: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#ff4444',
                                                            fontWeight: 'bold',
                                                            marginRight: '6px'
                                                        },
                                                        children: "Mod:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 91
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: '#ccc'
                                                        },
                                                        children: "No spamming links please."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 172
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 193,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chat-input-area",
                                style: {
                                    padding: '10px',
                                    borderTop: '1px solid #222',
                                    background: '#0f0f0f'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "chat-input",
                                    placeholder: chatAgreed ? "Type a message..." : "Agree to rules to chat",
                                    disabled: !chatAgreed,
                                    style: {
                                        width: '100%',
                                        background: '#050505',
                                        border: '1px solid #222',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        color: '#fff',
                                        fontSize: '12px',
                                        outline: 'none'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                    lineNumber: 233,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                                lineNumber: 232,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
function MatchPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                color: '#444',
                textAlign: 'center',
                marginTop: '50px'
            },
            children: "Initializing Arena..."
        }, void 0, false, {
            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
            lineNumber: 251,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MatchPageContent, {}, void 0, false, {
            fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
            lineNumber: 252,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/Reedstreams-Mainx/app/match/[id]/page.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const ArrowLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("ArrowLeft", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/maximize.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Maximize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Maximize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Maximize", [
    [
        "path",
        {
            d: "M8 3H5a2 2 0 0 0-2 2v3",
            key: "1dcmit"
        }
    ],
    [
        "path",
        {
            d: "M21 8V5a2 2 0 0 0-2-2h-3",
            key: "1e4gt3"
        }
    ],
    [
        "path",
        {
            d: "M3 16v3a2 2 0 0 0 2 2h3",
            key: "wsl5sc"
        }
    ],
    [
        "path",
        {
            d: "M16 21h3a2 2 0 0 0 2-2v-3",
            key: "18trek"
        }
    ]
]);
;
 //# sourceMappingURL=maximize.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/maximize.js [app-ssr] (ecmascript) <export default as Maximize>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Maximize",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/maximize.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Minimize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Minimize", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-ssr] (ecmascript) <export default as Minimize>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Minimize",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/minimize.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Share2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Share2", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Share2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Copy", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>MessageSquare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const MessageSquare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("MessageSquare", [
    [
        "path",
        {
            d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
            key: "1lielz"
        }
    ]
]);
;
 //# sourceMappingURL=message-square.js.map
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageSquare",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("TriangleAlert", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const CircleCheckBig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("CircleCheckBig", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckCircle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Twitter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Twitter", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-ssr] (ecmascript) <export default as Twitter>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Twitter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$twitter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/twitter.js [app-ssr] (ecmascript)");
}),
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Facebook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Facebook", [
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
"[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-ssr] (ecmascript) <export default as Facebook>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Facebook",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$facebook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/facebook.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Reedstreams-Mainx_3fa5109a._.js.map