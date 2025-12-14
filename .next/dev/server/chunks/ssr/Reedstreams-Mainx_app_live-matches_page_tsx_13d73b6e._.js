module.exports = [
"[project]/Reedstreams-Mainx/app/live-matches/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchesList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
// 🔥 IMPORT LANGUAGE HOOK
var __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Reedstreams-Mainx/context/language-context.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
/* =========================================
   1. CSS ENGINE (Now includes Filter Bar Styles)
   ========================================= */ const globalCss = `
  /* GLOBAL SETTINGS */
  body { background-color: #020305 !important; margin: 0; overflow-x: hidden; }

  /* SNOW WRAPPER */
  .snow-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none; background: radial-gradient(circle at 50% 100%, #0f1c30 0%, #020305 70%); }
  .snow-layer { position: absolute; top: -100vh; left: 0; right: 0; bottom: 0; background: transparent; border-radius: 50%; animation: snowfall linear infinite; }

  /* LAYERS */
  .layer-1 { width: 2px; height: 2px; opacity: 0.6; animation-duration: 20s; box-shadow: 10vw 10vh #fff, 60vw 40vh #fff, 15vw 80vh #fff, 80vw 10vh #fff, 30vw 20vh #fff, 90vw 90vh #fff, 40vw 50vh #fff, 50vw 10vh #fff, 20vw 30vh #fff, 70vw 60vh #fff, 10vw 90vh #fff, 95vw 30vh #fff, 25vw 70vh #fff, 75vw 20vh #fff, 05vw 40vh #fff, 55vw 80vh #fff, 35vw 50vh #fff, 85vw 60vh #fff, 45vw 10vh #fff, 65vw 90vh #fff; }
  .layer-2 { width: 3px; height: 3px; opacity: 0.8; animation-duration: 12s; box-shadow: 5vw 5vh rgba(255,255,255,0.8), 55vw 55vh rgba(255,255,255,0.8), 25vw 25vh rgba(255,255,255,0.8), 75vw 75vh rgba(255,255,255,0.8), 15vw 45vh rgba(255,255,255,0.8), 65vw 15vh rgba(255,255,255,0.8), 35vw 85vh rgba(255,255,255,0.8), 85vw 35vh rgba(255,255,255,0.8); }
  .layer-3 { width: 6px; height: 6px; opacity: 0.9; filter: blur(2px); animation-duration: 7s; box-shadow: 10vw 20vh #fff, 80vw 10vh #fff, 30vw 50vh #fff, 90vw 80vh #fff, 50vw 90vh #fff, 20vw 40vh #fff, 70vw 30vh #fff, 40vw 70vh #fff; }
  
  @keyframes snowfall { 0% { transform: translateY(0); } 100% { transform: translateY(100vh); } }
  @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }

  /* FILTER BAR STYLES */
  .filters-section { margin-bottom: 25px; position: relative; z-index: 50; }
  .filters-bar { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 12px; backdrop-filter: blur(5px); }
  .sports-scroll-area { display: flex; gap: 8px; overflow-x: auto; flex: 1; padding-bottom: 4px; scrollbar-width: none; }
  .sports-scroll-area::-webkit-scrollbar { display: none; }
  
  .filter-pill {
    background: transparent; border: 1px solid #333; color: #888;
    padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;
    white-space: nowrap; cursor: pointer; transition: all 0.2s;
    text-transform: uppercase;
  }
  .filter-pill:hover { border-color: #666; color: #fff; }
  .filter-pill.active { background: #8db902; border-color: #8db902; color: #000; font-weight: 800; }

  .separator { width: 1px; height: 24px; background: #333; margin: 0 5px; }
  
  .source-filter-btn {
    display: flex; alignItems: center; gap: 6px;
    background: transparent; border: 1px solid #333; color: #888;
    padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .source-filter-btn:hover { color: #fff; border-color: #666; }
  .source-filter-btn.active { color: #8db902; border-color: #8db902; background: rgba(141, 185, 2, 0.1); }
`;
const STREAMED_API_BASE = process.env.NEXT_PUBLIC_STREAMED_API_BASE_URL || 'https://streamed.pk/api';
// 🔥 MAP TRANSLATED KEYS TO API IDS
const SPORT_ID_MAP = {
    "1": "Football",
    "2": "Basketball",
    "3": "Cricket",
    "4": "Tennis",
    "5": "Rugby",
    "6": "Ice Hockey",
    "7": "American Football",
    "8": "Baseball",
    "9": "Motorsport",
    "10": "Fighting",
    "12": "Volleyball"
};
function getBadgeUrl(badgeId) {
    if (!badgeId) return '/placeholder-badge.webp';
    return `${STREAMED_API_BASE}/images/badge/${badgeId}.webp`;
}
function getCardShade(matchId) {
    let hash = 0;
    for(let i = 0; i < matchId.length; i++){
        hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash) % 15 + 1;
    return `card-shade-${seed}`;
}
function MatchesList() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { t, lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$context$2f$language$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const sportId = searchParams.get("sportId");
    const rawSportName = searchParams.get("sportName") || (sportId ? SPORT_ID_MAP[sportId] : "Matches") || "Matches";
    const displaySportName = rawSportName === "Matches" ? t.matches_fallback : rawSportName;
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredMatches, setFilteredMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("live");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 NEW STATE FOR SOURCES FILTER
    const [filterSources, setFilterSources] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔥 SPORTS LIST MAPPING
    const sportsList = [
        {
            label: t.filter_all,
            id: null,
            name: 'All'
        },
        {
            label: t.soccer,
            id: '1',
            name: 'Football'
        },
        {
            label: t.nba,
            id: '2',
            name: 'Basketball'
        },
        {
            label: t.nfl,
            id: '7',
            name: 'American Football'
        },
        {
            label: t.cricket,
            id: '3',
            name: 'Cricket'
        },
        {
            label: t.f1,
            id: '9',
            name: 'Motorsport'
        },
        {
            label: t.mma,
            id: '10',
            name: 'Fighting'
        },
        {
            label: t.tennis,
            id: '4',
            name: 'Tennis'
        },
        {
            label: t.rugby,
            id: '5',
            name: 'Rugby'
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        async function fetchMatches() {
            try {
                setLoading(true);
                setError(false);
                const url = sportId ? `${STREAMED_API_BASE}/matches/${sportId}` : `${STREAMED_API_BASE}/matches/all-today`;
                const res = await fetch(url, {
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error("API_ERROR");
                const data = await res.json();
                const dataArray = Array.isArray(data) ? data : [];
                const validMatches = dataArray;
                validMatches.sort((a, b)=>(a.date ? new Date(a.date).getTime() : 0) - (b.date ? new Date(b.date).getTime() : 0));
                if (isMounted) setMatches(validMatches);
            } catch (err) {
                console.error(err);
                if (isMounted) setError(true);
            } finally{
                if (isMounted) setLoading(false);
            }
        }
        fetchMatches();
        return ()=>{
            isMounted = false;
        };
    }, [
        sportId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const now = new Date();
        const result = matches.filter((match)=>{
            if (!match.date) return filter === "all";
            const matchDate = new Date(match.date);
            const isLive = matchDate <= now && matchDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
            const isUpcoming = matchDate > now;
            // 🔥 SOURCE FILTER LOGIC (If enabled, only show matches with sources)
            if (filterSources && (!match.sources || match.sources.length === 0)) {
                return false;
            }
            if (filter === 'all') return true;
            if (filter === 'upcoming') return isUpcoming;
            if (filter === 'live') return isLive;
            return false;
        });
        setFilteredMatches(result);
    }, [
        filter,
        matches,
        filterSources
    ]); // Added filterSources dependency
    const grouped = filteredMatches.reduce((acc, match)=>{
        if (!match.date) return acc;
        const d = new Date(match.date);
        if (isNaN(d.getTime())) return acc;
        const dateKey = d.toLocaleDateString(lang === 'ur' ? 'en-US' : lang, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(match);
        return acc;
    }, {});
    // --- HANDLER FOR SPORT CLICK ---
    const handleSportClick = (item)=>{
        if (item.id) {
            router.push(`/live-matches?sportId=${item.id}&sportName=${encodeURIComponent(item.name)}`);
        } else {
            router.push(`/live-matches`);
        }
    };
    // --- STYLES ---
    const s = {
        container: {
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '20px',
            minHeight: '100vh',
            position: 'relative',
            zIndex: 10
        },
        headerWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '15px',
            flexWrap: 'wrap',
            gap: '15px',
            position: 'relative',
            zIndex: 50
        },
        titleGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        },
        titleText: {
            fontSize: '24px',
            fontWeight: 900,
            color: '#fff',
            textTransform: 'uppercase',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            lineHeight: 1
        },
        greenBar: {
            width: '4px',
            height: '24px',
            background: '#8db902',
            borderRadius: '2px'
        },
        homeLink: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#888',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            textDecoration: 'none'
        },
        filterBar: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 50
        },
        btn: (active)=>({
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: active ? 800 : 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                minWidth: '100px',
                background: active ? '#8db902' : 'transparent',
                color: active ? '#000' : '#ffffff',
                border: active ? '1px solid #8db902' : '1px solid #ffffff',
                boxShadow: active ? '0 0 10px rgba(141, 185, 2, 0.4)' : 'none'
            }),
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '15px'
        },
        card: {
            background: '#050505',
            border: '1px solid #1a1a1a',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '110px'
        },
        matchSkeletonCard: {
            background: 'linear-gradient(to right, #161920 4%, #20242e 25%, #161920 36%)',
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear',
            borderRadius: '10px',
            border: '1px solid #222',
            height: '110px',
            width: '100%'
        },
        shimmer: {
            background: 'linear-gradient(to right, #161920 4%, #20242e 25%, #161920 36%)',
            backgroundSize: '1000px 100%',
            animation: 'shimmer 2s infinite linear'
        }
    };
    const PageWrapper = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    dangerouslySetInnerHTML: {
                        __html: globalCss
                    }
                }, void 0, false, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "snow-wrapper",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "snow-layer layer-1"
                        }, void 0, false, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 208,
                            columnNumber: 39
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "snow-layer layer-2"
                        }, void 0, false, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 208,
                            columnNumber: 81
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "snow-layer layer-3"
                        }, void 0, false, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 208,
                            columnNumber: 123
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: s.container,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageWrapper, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: s.headerWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '15px',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '4px',
                                    height: '24px',
                                    background: '#222',
                                    borderRadius: '2px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                lineNumber: 217,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...s.shimmer,
                                    width: '200px',
                                    height: '30px',
                                    borderRadius: '4px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                lineNumber: 218,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...s.shimmer,
                            width: '120px',
                            height: '20px',
                            borderRadius: '4px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: s.filterBar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...s.shimmer,
                            width: '100px',
                            height: '40px',
                            borderRadius: '8px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...s.shimmer,
                            width: '120px',
                            height: '40px',
                            borderRadius: '8px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...s.shimmer,
                            width: '100px',
                            height: '40px',
                            borderRadius: '8px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: s.grid,
                children: [
                    ...Array(12)
                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: s.matchSkeletonCard
                    }, i, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 227,
                        columnNumber: 57
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageWrapper, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: 'center',
                color: '#ff4444'
            },
            children: [
                t.server_error,
                " ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>window.location.reload(),
                    children: "Retry"
                }, void 0, false, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 231,
                    columnNumber: 104
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
            lineNumber: 231,
            columnNumber: 36
        }, this)
    }, void 0, false, {
        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
        lineNumber: 231,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageWrapper, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: s.headerWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: s.titleGroup,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: s.titleText,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: s.greenBar
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 236,
                                    columnNumber: 63
                                }, this),
                                displaySportName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 236,
                            columnNumber: 39
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        style: s.homeLink,
                        children: [
                            t.back_to_home,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                lineNumber: 237,
                                columnNumber: 64
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 237,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 235,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filters-section",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "filters-bar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sports-scroll-area",
                            children: sportsList.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `filter-pill ${!sportId && !item.id || sportId === item.id ? 'active' : ''}`,
                                    onClick: ()=>handleSportClick(item),
                                    children: item.label
                                }, item.name, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 245,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 243,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "separator"
                        }, void 0, false, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 254,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `source-filter-btn ${filterSources ? 'active' : ''}`,
                            onClick: ()=>setFilterSources(!filterSources),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 259,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: t.filter_sources
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 255,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 242,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 241,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: s.filterBar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: s.btn(filter === 'live'),
                        onClick: ()=>setFilter('live'),
                        children: t.live
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 267,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: s.btn(filter === 'upcoming'),
                        onClick: ()=>setFilter('upcoming'),
                        children: t.upcoming
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 268,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        style: s.btn(filter === 'all'),
                        onClick: ()=>setFilter('all'),
                        children: t.filter_all
                    }, void 0, false, {
                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                        lineNumber: 269,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, this),
            Object.keys(grouped).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#fff'
                    },
                    children: filter === 'live' ? t.no_live_matches : t.no_matches_found
                }, void 0, false, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 274,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                lineNumber: 273,
                columnNumber: 13
            }, this) : Object.entries(grouped).map(([date, dateMatches])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                margin: '30px 0 15px 0',
                                color: '#fff'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    size: 16,
                                    color: "#8db902"
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        textTransform: 'uppercase'
                                    },
                                    children: date
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 283,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1,
                                        height: '1px',
                                        background: 'linear-gradient(90deg, #8db902 0%, rgba(255,255,255,0.05) 100%)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 281,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: s.grid,
                            children: dateMatches.map((match)=>{
                                const now = new Date();
                                const mDate = new Date(match.date);
                                const isLive = mDate <= now && mDate >= new Date(now.getTime() - 4 * 60 * 60 * 1000);
                                const shade = getCardShade(match.id);
                                const bgStyle = shade.includes('1') ? 'repeating-linear-gradient(45deg, #050505, #050505 10px, #0d0d0d 10px, #0d0d0d 20px)' : '#050505';
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/match/${match.id}?sportName=${encodeURIComponent(displaySportName)}`,
                                    style: {
                                        textDecoration: 'none',
                                        display: 'block'
                                    },
                                    onClick: ()=>{
                                        sessionStorage.setItem("currentMatch", JSON.stringify({
                                            ...match,
                                            id: String(match.id)
                                        }));
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            ...s.card,
                                            background: bgStyle
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '8px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            width: '40%'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: getBadgeUrl(match.teams?.home?.badge),
                                                                style: {
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    objectFit: 'contain'
                                                                },
                                                                alt: "Home"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                                lineNumber: 309,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '11px',
                                                                    color: '#eee',
                                                                    marginTop: '4px',
                                                                    fontWeight: 600
                                                                },
                                                                children: match.teams?.home?.name || t.team_home
                                                            }, void 0, false, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                        lineNumber: 308,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '10px',
                                                            fontWeight: 900,
                                                            color: '#444',
                                                            fontStyle: 'italic'
                                                        },
                                                        children: t.vs_badge
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            width: '40%'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: getBadgeUrl(match.teams?.away?.badge),
                                                                style: {
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    objectFit: 'contain'
                                                                },
                                                                alt: "Away"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '11px',
                                                                    color: '#eee',
                                                                    marginTop: '4px',
                                                                    fontWeight: 600
                                                                },
                                                                children: match.teams?.away?.name || t.team_away
                                                            }, void 0, false, {
                                                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                                lineNumber: 317,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                        lineNumber: 315,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                lineNumber: 307,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderTop: '1px solid #222',
                                                    paddingTop: '8px',
                                                    marginTop: 'auto'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '11px',
                                                            color: '#fff',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '65%'
                                                        },
                                                        children: match.title || match.competition || 'Match'
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: isLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                background: '#8db902',
                                                                color: '#000',
                                                                fontSize: '9px',
                                                                fontWeight: 800,
                                                                padding: '2px 6px',
                                                                borderRadius: '4px'
                                                            },
                                                            children: t.live
                                                        }, void 0, false, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                            lineNumber: 324,
                                                            columnNumber: 53
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Reedstreams$2d$Mainx$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                background: '#111',
                                                                color: '#888',
                                                                fontSize: '9px',
                                                                fontWeight: 600,
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #222'
                                                            },
                                                            children: new Date(match.date).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                                lineNumber: 320,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                        lineNumber: 306,
                                        columnNumber: 37
                                    }, this)
                                }, match.id, false, {
                                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                                    lineNumber: 295,
                                    columnNumber: 33
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                            lineNumber: 286,
                            columnNumber: 21
                        }, this)
                    ]
                }, date, true, {
                    fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
                    lineNumber: 280,
                    columnNumber: 17
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/Reedstreams-Mainx/app/live-matches/page.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Reedstreams-Mainx_app_live-matches_page_tsx_13d73b6e._.js.map