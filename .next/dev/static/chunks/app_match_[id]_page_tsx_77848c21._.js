(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/match/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchPlayerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
/* STYLES */ const globalCss = `
  body { background-color: #020305 !important; margin: 0; color: white; font-family: 'Inter', sans-serif; }
  .snow-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 99; pointer-events: none; }
  .snow-layer { position: absolute; top: -100vh; left: 0; right: 0; bottom: 0; background: transparent; border-radius: 50%; animation: snowfall linear infinite; }
  .layer-1 { width: 3px; height: 3px; opacity: 0.8; animation-duration: 20s; box-shadow: 10vw 10vh #fff, 60vw 40vh #fff, 15vw 80vh #fff; }
  @keyframes snowfall { 100% { transform: translateY(100vh); } }
  .container { max-width: 1200px; margin: 0 auto; padding: 20px; position: relative; z-index: 1; }
  .match-info-card { background: #1a1a1a; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border: 1px solid #333; }
  .team-name { font-weight: bold; font-size: 1.2rem; }
  .vs { color: #8db902; font-weight: 900; font-size: 1.5rem; }
  .player-box { width: 100%; aspect-ratio: 16/9; background: #000; border: 1px solid #333; display: flex; align-items: center; justify-content: center; }
  .stream-list { display: flex; gap: 10px; overflow-x: auto; padding: 15px 0; }
  .btn { background: #222; color: #fff; border: 1px solid #333; padding: 10px 15px; cursor: pointer; white-space: nowrap; }
  .btn.active { background: #8db902; color: #000; font-weight: bold; }
  .back-btn { background: #333; border: none; padding: 8px 12px; color: white; border-radius: 4px; cursor: pointer; margin-bottom: 15px; }
`;
function MatchPlayerContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const sportName = searchParams.get("sportName");
    // --- THE FIX: EXTRACT ID FROM SLUG ---
    // Input: "team-a-vs-team-b-12345" -> Output: "12345"
    const rawId = String(params.id);
    const idParts = rawId.split('-');
    const realId = idParts[idParts.length - 1];
    const [matchData, setMatchData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [streams, setStreams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStream, setSelectedStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchPlayerContent.useEffect": ()=>{
            async function init() {
                try {
                    setLoading(true);
                    setError(null);
                    console.log(`[DEBUG] Raw URL ID: ${rawId}`);
                    console.log(`[DEBUG] Extracted Real ID: ${realId}`);
                    // 1. Session Storage
                    let match = null;
                    const stored = sessionStorage.getItem("currentMatch");
                    if (stored) {
                        try {
                            const parsed = JSON.parse(stored);
                            // Check against BOTH raw ID and extracted ID
                            if (String(parsed.id) === rawId || String(parsed.id) === realId) {
                                match = parsed;
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    // 2. API Fallback
                    if (!match) {
                        const res = await fetch("/api/matches");
                        if (!res.ok) throw new Error("API Error");
                        const list = await res.json();
                        // FIND MATCH: Check if API ID matches our Real ID
                        match = list.find({
                            "MatchPlayerContent.useEffect.init": (m)=>String(m.id) === realId
                        }["MatchPlayerContent.useEffect.init"]);
                    }
                    if (!match) {
                        setError(`Match ID ${realId} not found in database.`);
                        setLoading(false);
                        return;
                    }
                    setMatchData(match);
                    // 3. Load Streams
                    if (!match.sources || match.sources.length === 0) {
                        setError("No sources available.");
                        setLoading(false);
                        return;
                    }
                    const promises = match.sources.map({
                        "MatchPlayerContent.useEffect.init.promises": (src)=>fetch(`/api/stream/${src.source}/${src.id}`).then({
                                "MatchPlayerContent.useEffect.init.promises": (r)=>r.json()
                            }["MatchPlayerContent.useEffect.init.promises"]).catch({
                                "MatchPlayerContent.useEffect.init.promises": ()=>[]
                            }["MatchPlayerContent.useEffect.init.promises"])
                    }["MatchPlayerContent.useEffect.init.promises"]);
                    const results = await Promise.all(promises);
                    const allStreams = [];
                    match.sources.forEach({
                        "MatchPlayerContent.useEffect.init": (src, i)=>{
                            const res = results[i];
                            if (Array.isArray(res)) res.forEach({
                                "MatchPlayerContent.useEffect.init": (s)=>allStreams.push({
                                        ...s,
                                        sourceIdentifier: src.source
                                    })
                            }["MatchPlayerContent.useEffect.init"]);
                        }
                    }["MatchPlayerContent.useEffect.init"]);
                    if (allStreams.length === 0) {
                        setError("Streams offline.");
                    } else {
                        setStreams(allStreams);
                        // Priority
                        const isBasketball = sportName?.toLowerCase().includes("basketball");
                        let best = null;
                        if (isBasketball) best = allStreams.find({
                            "MatchPlayerContent.useEffect.init": (s)=>s.sourceIdentifier === "bravo #2"
                        }["MatchPlayerContent.useEffect.init"]);
                        if (!best) best = allStreams.find({
                            "MatchPlayerContent.useEffect.init": (s)=>s.sourceIdentifier === "admin" && s.streamNo === 1
                        }["MatchPlayerContent.useEffect.init"]);
                        if (!best) best = allStreams.find({
                            "MatchPlayerContent.useEffect.init": (s)=>s.hd
                        }["MatchPlayerContent.useEffect.init"]);
                        setSelectedStream(best || allStreams[0]);
                    }
                } catch (e) {
                    setError("Connection failed.");
                } finally{
                    setLoading(false);
                }
            }
            init();
        }
    }["MatchPlayerContent.useEffect"], [
        rawId,
        realId,
        sportName
    ]);
    // FIX: BADGE 404 SILENCER
    const getBadge = (path)=>{
        if (!path) return "";
        return path.startsWith("http") ? path : `https://crests.football-data.org/${path}`;
    };
    const home = matchData?.teams?.home?.name || "Home";
    const away = matchData?.teams?.away?.name || "Away";
    const homeBadge = getBadge(matchData?.teams?.home?.badge);
    const awayBadge = getBadge(matchData?.teams?.away?.badge);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                dangerouslySetInnerHTML: {
                    __html: globalCss
                }
            }, void 0, false, {
                fileName: "[project]/app/match/[id]/page.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "snow-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "snow-layer layer-1"
                }, void 0, false, {
                    fileName: "[project]/app/match/[id]/page.tsx",
                    lineNumber: 155,
                    columnNumber: 37
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/match/[id]/page.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "back-btn",
                        children: "← Back"
                    }, void 0, false, {
                        fileName: "[project]/app/match/[id]/page.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "match-info-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    homeBadge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: homeBadge,
                                        style: {
                                            height: '50px',
                                            display: 'block',
                                            margin: '0 auto'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/match/[id]/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "team-name",
                                        children: home
                                    }, void 0, false, {
                                        fileName: "[project]/app/match/[id]/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "vs",
                                children: "VS"
                            }, void 0, false, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    awayBadge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: awayBadge,
                                        style: {
                                            height: '50px',
                                            display: 'block',
                                            margin: '0 auto'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/match/[id]/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "team-name",
                                        children: away
                                    }, void 0, false, {
                                        fileName: "[project]/app/match/[id]/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/match/[id]/page.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "player-box",
                        children: [
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#8db902'
                                },
                                children: "CONNECTING..."
                            }, void 0, false, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 173,
                                columnNumber: 25
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'red'
                                },
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 174,
                                columnNumber: 23
                            }, this),
                            !loading && !error && selectedStream && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                                src: selectedStream.embedUrl,
                                width: "100%",
                                height: "100%",
                                frameBorder: "0",
                                allowFullScreen: true,
                                allow: "autoplay; encrypted-media"
                            }, void 0, false, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 176,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/match/[id]/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    streams.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "stream-list",
                        children: streams.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${selectedStream === s ? 'active' : ''}`,
                                onClick: ()=>setSelectedStream(s),
                                children: [
                                    s.sourceIdentifier,
                                    " #",
                                    s.streamNo
                                ]
                            }, i, true, {
                                fileName: "[project]/app/match/[id]/page.tsx",
                                lineNumber: 187,
                                columnNumber: 21
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/match/[id]/page.tsx",
                        lineNumber: 185,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/match/[id]/page.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(MatchPlayerContent, "dZ1dHtXl9QEHm1gTiB/pG8rAtbg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = MatchPlayerContent;
function MatchPlayerPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '20px',
                color: 'white'
            },
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/app/match/[id]/page.tsx",
            lineNumber: 204,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MatchPlayerContent, {}, void 0, false, {
            fileName: "[project]/app/match/[id]/page.tsx",
            lineNumber: 205,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/match/[id]/page.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_c1 = MatchPlayerPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "MatchPlayerContent");
__turbopack_context__.k.register(_c1, "MatchPlayerPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_match_%5Bid%5D_page_tsx_77848c21._.js.map