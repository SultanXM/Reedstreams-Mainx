module.exports=[12859,(a,b,c)=>{},24095,(a,b,c)=>{a.r(12859);var d=a.r(97438),e=d&&"object"==typeof d&&"default"in d?d:{default:d},f="undefined"!=typeof process&&process.env&&!0,g=function(a){return"[object String]"===Object.prototype.toString.call(a)},h=function(){function a(a){var b=void 0===a?{}:a,c=b.name,d=void 0===c?"stylesheet":c,e=b.optimizeForSpeed,h=void 0===e?f:e;i(g(d),"`name` must be a string"),this._name=d,this._deletedRulePlaceholder="#"+d+"-deleted-rule____{}",i("boolean"==typeof h,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=h,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0,this._nonce=null}var b,c=a.prototype;return c.setOptimizeForSpeed=function(a){i("boolean"==typeof a,"`setOptimizeForSpeed` accepts a boolean"),i(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=a,this.inject()},c.isOptimizeForSpeed=function(){return this._optimizeForSpeed},c.inject=function(){var a=this;i(!this._injected,"sheet already injected"),this._injected=!0,this._serverSheet={cssRules:[],insertRule:function(b,c){return"number"==typeof c?a._serverSheet.cssRules[c]={cssText:b}:a._serverSheet.cssRules.push({cssText:b}),c},deleteRule:function(b){a._serverSheet.cssRules[b]=null}}},c.getSheetForTag=function(a){if(a.sheet)return a.sheet;for(var b=0;b<document.styleSheets.length;b++)if(document.styleSheets[b].ownerNode===a)return document.styleSheets[b]},c.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},c.insertRule=function(a,b){return i(g(a),"`insertRule` accepts only strings"),"number"!=typeof b&&(b=this._serverSheet.cssRules.length),this._serverSheet.insertRule(a,b),this._rulesCount++},c.replaceRule=function(a,b){this._optimizeForSpeed;var c=this._serverSheet;if(b.trim()||(b=this._deletedRulePlaceholder),!c.cssRules[a])return a;c.deleteRule(a);try{c.insertRule(b,a)}catch(d){f||console.warn("StyleSheet: illegal rule: \n\n"+b+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),c.insertRule(this._deletedRulePlaceholder,a)}return a},c.deleteRule=function(a){this._serverSheet.deleteRule(a)},c.flush=function(){this._injected=!1,this._rulesCount=0,this._serverSheet.cssRules=[]},c.cssRules=function(){return this._serverSheet.cssRules},c.makeStyleTag=function(a,b,c){b&&i(g(b),"makeStyleTag accepts only strings as second parameter");var d=document.createElement("style");this._nonce&&d.setAttribute("nonce",this._nonce),d.type="text/css",d.setAttribute("data-"+a,""),b&&d.appendChild(document.createTextNode(b));var e=document.head||document.getElementsByTagName("head")[0];return c?e.insertBefore(d,c):e.appendChild(d),d},b=[{key:"length",get:function(){return this._rulesCount}}],function(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}(a.prototype,b),a}();function i(a,b){if(!a)throw Error("StyleSheet: "+b+".")}var j=function(a){for(var b=5381,c=a.length;c;)b=33*b^a.charCodeAt(--c);return b>>>0},k={};function l(a,b){if(!b)return"jsx-"+a;var c=String(b),d=a+c;return k[d]||(k[d]="jsx-"+j(a+"-"+c)),k[d]}function m(a,b){var c=a+(b=b.replace(/\/style/gi,"\\/style"));return k[c]||(k[c]=b.replace(/__jsx-style-dynamic-selector/g,a)),k[c]}var n=function(){function a(a){var b=void 0===a?{}:a,c=b.styleSheet,d=void 0===c?null:c,e=b.optimizeForSpeed,f=void 0!==e&&e;this._sheet=d||new h({name:"styled-jsx",optimizeForSpeed:f}),this._sheet.inject(),d&&"boolean"==typeof f&&(this._sheet.setOptimizeForSpeed(f),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var b=a.prototype;return b.add=function(a){var b=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(a.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed());var c=this.getIdAndRules(a),d=c.styleId,e=c.rules;if(d in this._instancesCounts){this._instancesCounts[d]+=1;return}var f=e.map(function(a){return b._sheet.insertRule(a)}).filter(function(a){return -1!==a});this._indices[d]=f,this._instancesCounts[d]=1},b.remove=function(a){var b=this,c=this.getIdAndRules(a).styleId;if(function(a,b){if(!a)throw Error("StyleSheetRegistry: "+b+".")}(c in this._instancesCounts,"styleId: `"+c+"` not found"),this._instancesCounts[c]-=1,this._instancesCounts[c]<1){var d=this._fromServer&&this._fromServer[c];d?(d.parentNode.removeChild(d),delete this._fromServer[c]):(this._indices[c].forEach(function(a){return b._sheet.deleteRule(a)}),delete this._indices[c]),delete this._instancesCounts[c]}},b.update=function(a,b){this.add(b),this.remove(a)},b.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},b.cssRules=function(){var a=this,b=this._fromServer?Object.keys(this._fromServer).map(function(b){return[b,a._fromServer[b]]}):[],c=this._sheet.cssRules();return b.concat(Object.keys(this._indices).map(function(b){return[b,a._indices[b].map(function(a){return c[a].cssText}).join(a._optimizeForSpeed?"":"\n")]}).filter(function(a){return!!a[1]}))},b.styles=function(a){var b,c;return b=this.cssRules(),void 0===(c=a)&&(c={}),b.map(function(a){var b=a[0],d=a[1];return e.default.createElement("style",{id:"__"+b,key:"__"+b,nonce:c.nonce?c.nonce:void 0,dangerouslySetInnerHTML:{__html:d}})})},b.getIdAndRules=function(a){var b=a.children,c=a.dynamic,d=a.id;if(c){var e=l(d,c);return{styleId:e,rules:Array.isArray(b)?b.map(function(a){return m(e,a)}):[m(e,b)]}}return{styleId:l(d),rules:Array.isArray(b)?b:[b]}},b.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(a,b){return a[b.id.slice(2)]=b,a},{})},a}(),o=d.createContext(null);function p(){return new n}function q(){return d.useContext(o)}function r(a){var b=q();return b&&b.add(a),null}o.displayName="StyleSheetContext",e.default.useInsertionEffect||e.default.useLayoutEffect,r.dynamic=function(a){return a.map(function(a){return l(a[0],a[1])}).join(" ")},c.StyleRegistry=function(a){var b=a.registry,c=a.children,f=d.useContext(o),g=d.useState(function(){return f||b||p()})[0];return e.default.createElement(o.Provider,{value:g},c)},c.createStyleRegistry=p,c.style=r,c.useStyleRegistry=q},482,(a,b,c)=>{b.exports=a.r(24095).style},41371,a=>{"use strict";var b=a.i(90106),c=a.i(482),d=a.i(97438),e=a.i(45690);function f({matchId:a}){let c=(0,e.useSearchParams)().get("sportName"),[f,g]=(0,d.useState)([]),[h,i]=(0,d.useState)(null),[j,k]=(0,d.useState)(null),[l,m]=(0,d.useState)(!0),[n,o]=(0,d.useState)(null),[p,q]=(0,d.useState)(!0),[r,s]=(0,d.useState)(null),[t,u]=(0,d.useState)(!1);return((0,d.useEffect)(()=>{!async function(){try{m(!0),o(null);let b=null,d=sessionStorage.getItem("currentMatch");if(d){let c=JSON.parse(d);String(c.id)===String(a)&&(b=c)}if(!b){let c=await fetch("/api/matches");c.ok&&(b=(await c.json()).find(b=>String(b.id)===String(a)))}if(!b){o("Match data unavailable."),m(!1);return}k(b);let e=new Date(b.date).getTime(),f=Date.now();if(e>f){u(!1),m(!1);return}if(u(!0),!b.sources||0===b.sources.length){o("No streams found."),m(!1);return}let h=b.sources.map(a=>fetch(`/api/stream/${a.source}/${a.id}`).then(a=>a.json()).catch(()=>[])),j=await Promise.all(h),l=[];if(b.sources.forEach((a,b)=>{Array.isArray(j[b])&&j[b].forEach(b=>l.push({...b,sourceIdentifier:a.source}))}),0===l.length)o("Streams are offline.");else{g(l);let a=c?.toLowerCase().includes("basketball"),b=null;a&&(b=l.find(a=>"bravo #2"===a.sourceIdentifier)),b||(b=l.find(a=>"admin"===a.sourceIdentifier&&1===a.streamNo)),b||(b=l.find(a=>a.hd)),i(b||l[0])}}catch(a){o("System Error.")}finally{m(!1)}}()},[a,c]),(0,d.useEffect)(()=>{if(!j||t)return;let a=setInterval(()=>{let b=new Date(j.date).getTime()-Date.now();if(b<=0)u(!0),window.location.reload(),clearInterval(a);else{let a=Math.floor(b/36e5);s({h:a,m:Math.floor(b%36e5/6e4),s:Math.floor(b%6e4/1e3)})}},1e3);return()=>clearInterval(a)},[j,t]),(0,d.useEffect)(()=>{q(!0)},[h]),l)?(0,b.jsxs)("div",{className:"player-container loading-state",children:[(0,b.jsx)("div",{className:"spinner"}),(0,b.jsx)("span",{children:"ESTABLISHING UPLINK..."})]}):n?(0,b.jsx)("div",{className:"player-container error-state",children:n}):!t&&r?(0,b.jsx)("div",{className:"player-wrapper",children:(0,b.jsxs)("div",{className:"player-container countdown-state",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#050505",color:"#fff"},children:[(0,b.jsx)("div",{style:{fontSize:"12px",color:"#666",letterSpacing:"2px",marginBottom:"15px"},children:"BROADCAST BEGINS IN"}),(0,b.jsxs)("div",{style:{fontSize:"40px",fontWeight:"900",color:"#8db902",fontFamily:"monospace",textShadow:"0 0 20px rgba(141, 185, 2, 0.4)"},children:[String(r.h).padStart(2,"0")," : ",String(r.m).padStart(2,"0")," : ",String(r.s).padStart(2,"0")]}),(0,b.jsx)("div",{style:{fontSize:"10px",color:"#444",marginTop:"10px"},children:"WAITING FOR SATELLITE SIGNAL"})]})}):(0,b.jsxs)("div",{className:"player-wrapper",children:[(0,b.jsxs)("div",{className:"player-container",children:[p&&h&&(0,b.jsx)("div",{className:"shield-overlay",onClick:()=>q(!1)}),h?(0,b.jsx)("iframe",{src:h.embedUrl,className:"video-iframe",frameBorder:"0",allowFullScreen:!0,allow:"autoplay; encrypted-media; picture-in-picture"}):(0,b.jsx)("div",{className:"no-signal",children:"NO SIGNAL"})]}),f.length>1&&(0,b.jsxs)("div",{className:"stream-selector",children:[(0,b.jsxs)("div",{className:"stream-header",children:["AVAILABLE SIGNALS (",f.length,")"]}),(0,b.jsx)("div",{className:"stream-list",children:f.map((a,c)=>(0,b.jsxs)("button",{className:`stream-btn ${h?.embedUrl===a.embedUrl?"active":""}`,onClick:()=>i(a),children:[(0,b.jsx)("span",{className:"signal-icon"}),a.sourceIdentifier," #",a.streamNo,a.hd&&(0,b.jsx)("span",{className:"hd-badge",children:"HD"})]},c))})]})]})}var g=a.i(96396);let h=(0,g.default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),i=(0,g.default)("Minimize",[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]]),j=(0,g.default)("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]),k=(0,g.default)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var l=a.i(42691);let m=(0,g.default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),n=(0,g.default)("Twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]),o=(0,g.default)("Facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]),p=(0,g.default)("Tv",[["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",ry:"2",key:"10ag99"}],["polyline",{points:"17 2 12 7 7 2",key:"11pgbg"}]]);var q=a.i(50967);let r=(0,g.default)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),s=(0,g.default)("Wifi",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]);var t=a.i(36524),u=a.i(40353),v=a.i(96647);let w=`
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
    padding: 20px;
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
    width: 36px;
    height: 36px;
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
    gap: 25px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 25px 20px;
    width: 100%;
    box-sizing: border-box;
  }
  
  /* LAYOUTS */
  .layout-standard { grid-template-columns: 1fr 380px; } 
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

  /* INFO BAR */
  .info-bar {
    margin-top: 20px;
    background: #0a0a0a; 
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 20px 25px; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .match-title-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .match-main-title {
    color: #fff;
    font-size: 26px; 
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
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    background: #111;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid #222;
  }

  /* CONTROLS GROUP */
  .controls-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  /* CHAT PANEL */
  .chat-panel {
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    display: flex;
    flex-direction: column;
    height: 700px;
    overflow: hidden;
    border-radius: 8px;
  }

  /* LOADING SCREEN */
  .loading-container {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8db902;
    font-family: monospace;
    letter-spacing: 2px;
    border: 1px solid #111;
  }
  .loading-text {
    font-size: 14px;
    font-weight: bold;
    margin-top: 15px;
    animation: blink 1.5s infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

  /* FEEDBACK MODAL */
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
    z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s;
  }
  .feedback-modal {
    background: #111;
    border: 1px solid #222;
    width: 90%; max-width: 400px;
    border-radius: 12px;
    padding: 25px;
    position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }
  .feedback-input {
    width: 100%;
    background: #050505;
    border: 1px solid #222;
    color: #fff;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 13px;
    outline: none;
  }
  .feedback-input:focus { border-color: #8db902; }
  .feedback-select {
    width: 100%;
    background: #050505;
    border: 1px solid #222;
    color: #fff;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
  }

  /* MOBILE OPTIMIZATIONS */
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
      margin-top: 0px !important; 
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
        font-size: 18px; 
    }

    .controls-group {
      justify-content: space-between;
      width: 100%;
    }
    
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
`;function x(){let{t:a}=(0,v.useLanguage)();return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c.default,{id:w.__hash,children:w}),(0,b.jsxs)("div",{className:"match-page-container",children:[(0,b.jsx)("div",{className:"top-nav",children:(0,b.jsxs)("div",{className:"nav-back-wrapper",children:[(0,b.jsx)("div",{className:"nav-back-icon",children:(0,b.jsx)(h,{size:16})}),(0,b.jsxs)("div",{style:{fontSize:"20px",fontWeight:900,letterSpacing:"-1px",fontFamily:"sans-serif"},children:[(0,b.jsx)("span",{style:{color:"#fff"},children:"REED"}),(0,b.jsx)("span",{style:{color:"#8db902"},children:"STREAMS"})]})]})}),(0,b.jsxs)("div",{className:"match-grid layout-standard",children:[(0,b.jsx)("div",{className:"player-section",children:(0,b.jsxs)("div",{className:"loading-container",children:[(0,b.jsx)(s,{size:40,className:"loading-text"}),(0,b.jsx)("div",{className:"loading-text",children:a.establishing_connection||"ESTABLISHING SECURE UPLINK..."})]})}),(0,b.jsx)("div",{style:{background:"#050505",border:"1px solid #111"},className:"chat-panel"})]})]})]})}function y(){let a=(0,e.useRouter)(),g=String((0,e.useParams)().id),{t:s}=(0,v.useLanguage)(),[x,y]=(0,d.useState)(!1),[z,A]=(0,d.useState)(!1),[B,C]=(0,d.useState)(!0),[D,E]=(0,d.useState)(!1),[F,G]=(0,d.useState)(!1),[H,I]=(0,d.useState)(!1),[J,K]=(0,d.useState)(""),[L,M]=(0,d.useState)("Stream Lag / Buffering"),[N,O]=(0,d.useState)("Loading Stream..."),[P,Q]=(0,d.useState)(null);(0,d.useEffect)(()=>{let a=sessionStorage.getItem("currentMatch");if(a)try{let b=JSON.parse(a),c=b.title||`${b.teams?.home?.name||"Home"} vs ${b.teams?.away?.name||"Away"}`;if(O(c),b.date){let a=new Date(b.date);Q(a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))}}catch(a){O("Live Stream")}},[]);let R="https://reedstreams.com",S=`Watch ${N} Live on ReedStreams!`,T={twitter:`https://twitter.com/intent/tweet?text=${encodeURIComponent(S)}&url=${encodeURIComponent(R)}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(R)}`,whatsapp:`https://wa.me/?text=${encodeURIComponent(S+" "+R)}`},U=a=>{window.open(a,"_blank","width=600,height=400")},V=`<iframe src="https://reedstreams.com/embed/${g}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c.default,{id:w.__hash,children:w}),F&&(0,b.jsx)("div",{className:"modal-overlay",children:(0,b.jsxs)("div",{className:"feedback-modal",children:[(0,b.jsx)("button",{onClick:()=>G(!1),style:{position:"absolute",top:"15px",right:"15px",background:"none",border:"none",color:"#666",cursor:"pointer"},children:(0,b.jsx)(q.X,{size:18})}),H?(0,b.jsxs)("div",{style:{textAlign:"center",padding:"30px 0"},children:[(0,b.jsx)(m,{size:48,color:"#8db902",style:{margin:"0 auto 15px auto"}}),(0,b.jsx)("h3",{style:{color:"#fff",margin:"0 0 5px 0"},children:s.report_sent||"Report Sent!"}),(0,b.jsx)("p",{style:{color:"#666",fontSize:"12px"},children:s.thank_you_report||"Thanks"})]}):(0,b.jsxs)("form",{onSubmit:a=>{a.preventDefault();let b=encodeURIComponent(`Issue Report: ${L}`),c=encodeURIComponent(`Match: ${N} (ID: ${g})
Details: ${J}`);window.location.href=`mailto:reedstreams000@gmail.com?subject=${b}&body=${c}`,I(!0),setTimeout(()=>{I(!1),G(!1),K("")},2e3)},children:[(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px"},children:[(0,b.jsx)(t.AlertOctagon,{size:24,color:"#8db902"}),(0,b.jsx)("h2",{style:{color:"#fff",fontSize:"18px",fontWeight:"800",margin:0},children:s.report||"Report Issue"})]}),(0,b.jsx)("label",{style:{color:"#888",fontSize:"11px",display:"block",marginBottom:"6px",fontWeight:"bold"},children:"ISSUE TYPE"}),(0,b.jsxs)("select",{value:L,onChange:a=>M(a.target.value),className:"feedback-select",children:[(0,b.jsx)("option",{children:s.stream_lag||"Stream Lag"}),(0,b.jsx)("option",{children:s.audio_sync||"Audio Sync"}),(0,b.jsx)("option",{children:s.stream_down||"Stream Down"}),(0,b.jsx)("option",{children:s.other_issue||"Other"})]}),(0,b.jsx)("label",{style:{color:"#888",fontSize:"11px",display:"block",marginBottom:"6px",fontWeight:"bold"},children:"DETAILS"}),(0,b.jsx)("textarea",{rows:3,placeholder:s.describe_issue||"Describe...",value:J,onChange:a=>K(a.target.value),className:"feedback-input"}),(0,b.jsxs)("button",{type:"submit",style:{width:"100%",background:"#8db902",color:"#000",border:"none",padding:"12px",borderRadius:"6px",fontWeight:"800",fontSize:"13px",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",gap:"8px"},children:[(0,b.jsx)(u.Send,{size:14})," ",s.submit_report||"Submit"]})]})]})}),(0,b.jsxs)("div",{style:{background:x?"#000":"#050505"},className:"match-page-container",children:[!x&&(0,b.jsxs)("div",{className:"top-nav",children:[(0,b.jsxs)("div",{onClick:()=>a.back(),className:"nav-back-wrapper",children:[(0,b.jsx)("div",{className:"nav-back-icon",children:(0,b.jsx)(h,{size:18})}),(0,b.jsxs)("div",{style:{fontSize:"22px",fontWeight:900,letterSpacing:"-1px",fontFamily:"sans-serif"},children:[(0,b.jsx)("span",{style:{color:"#fff"},children:"REED"}),(0,b.jsx)("span",{style:{color:"#8db902"},children:"STREAMS"})]})]}),(0,b.jsx)("div",{style:{display:"flex",gap:"10px"},children:(0,b.jsxs)("button",{onClick:()=>G(!0),style:{background:"#111",border:"1px solid #222",color:"#ccc",padding:"8px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},children:[(0,b.jsx)(t.AlertOctagon,{size:14,color:"#f00"})," ",(0,b.jsx)("span",{style:{display:"none",md:"inline"},children:s.report||"Report"})]})})]}),(0,b.jsxs)("div",{className:`match-grid ${x?"layout-cinema":"layout-standard"}`,children:[(0,b.jsxs)("div",{className:"player-section",children:[(0,b.jsx)("div",{className:"player-wrapper",children:(0,b.jsx)(f,{matchId:g})}),(0,b.jsxs)("div",{className:"info-bar",children:[(0,b.jsxs)("div",{className:"match-title-group",children:[(0,b.jsxs)("div",{className:"meta-row",children:[(0,b.jsx)("span",{className:"live-tag",children:s.live||"LIVE"}),P&&(0,b.jsxs)("span",{className:"time-tag",children:[(0,b.jsx)(r,{size:12})," ",P]})]}),(0,b.jsx)("h1",{className:"match-main-title",children:N})]}),(0,b.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"10px",width:"100%",flex:"1",maxWidth:"500px"},children:[(0,b.jsxs)("div",{className:"controls-group",children:[(0,b.jsxs)("button",{onClick:()=>y(!x),style:{background:"#111",border:"1px solid #222",color:x?"#8db902":"#ccc",padding:"10px 14px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",textTransform:"uppercase",flex:1,justifyContent:"center"},className:"action-btn",children:[x?(0,b.jsx)(i,{size:14}):(0,b.jsx)(p,{size:14}),x?s.exit_cinema||"Exit":s.cinema_mode||"Cinema"]}),!x&&(0,b.jsxs)("div",{style:{display:"flex",gap:"8px",flex:1,justifyContent:"center"},children:[(0,b.jsx)("button",{onClick:()=>U(T.twitter),style:{background:"#000",border:"1px solid #222",padding:"10px",borderRadius:"6px",cursor:"pointer"},children:(0,b.jsx)(n,{size:16,color:"#1DA1F2"})}),(0,b.jsx)("button",{onClick:()=>U(T.facebook),style:{background:"#000",border:"1px solid #222",padding:"10px",borderRadius:"6px",cursor:"pointer"},children:(0,b.jsx)(o,{size:16,color:"#1877F2"})}),(0,b.jsx)("button",{onClick:()=>U(T.whatsapp),style:{background:"#000",border:"1px solid #222",padding:"10px",borderRadius:"6px",cursor:"pointer"},children:(0,b.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"#25D366",children:(0,b.jsx)("path",{d:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"})})})]}),!x&&(0,b.jsxs)("button",{onClick:()=>C(!B),style:{background:B?"#222":"#111",border:"1px solid #222",color:"#ccc",padding:"10px 14px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",textTransform:"uppercase",flex:1,justifyContent:"center"},className:"action-btn",children:[(0,b.jsx)(j,{size:14})," ",s.embed||"Embed"]})]}),B&&!x&&(0,b.jsx)("div",{style:{width:"100%",animation:"fadeIn 0.3s"},children:(0,b.jsxs)("div",{style:{background:"#000",padding:"10px",borderRadius:"6px",border:"1px solid #222",display:"flex",gap:"8px",alignItems:"center"},children:[(0,b.jsx)("input",{readOnly:!0,value:V,style:{background:"transparent",border:"none",color:"#888",width:"100%",fontSize:"11px",fontFamily:"monospace",outline:"none"}}),(0,b.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(V),E(!0),setTimeout(()=>E(!1),2e3)},style:{background:"transparent",border:"none",cursor:"pointer",color:D?"#8db902":"#fff"},children:D?(0,b.jsx)(m,{size:16}):(0,b.jsx)(k,{size:16})}),(0,b.jsx)("button",{onClick:()=>C(!1),style:{background:"transparent",border:"none",cursor:"pointer",color:"#444"},children:(0,b.jsx)(q.X,{size:14})})]})})]})]})]}),!x&&(0,b.jsxs)("div",{className:"chat-panel",children:[(0,b.jsxs)("div",{style:{padding:"15px",borderBottom:"1px solid #222",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f0f0f"},children:[(0,b.jsx)("span",{style:{color:"#fff",fontWeight:"bold",fontSize:"13px"},children:s.live_chat||"Live Chat"}),(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"#888"},children:[(0,b.jsx)("div",{style:{width:"6px",height:"6px",background:"#8db902",borderRadius:"50%"}}),(0,b.jsx)("span",{style:{color:"#8db902",fontWeight:"bold"},children:s.online||"Online"})]})]}),(0,b.jsxs)("div",{style:{flex:1,position:"relative",background:"#050505"},children:[!z&&(0,b.jsxs)("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(5,5,5,0.95)",backdropFilter:"blur(4px)",zIndex:10,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"20px",textAlign:"center"},children:[(0,b.jsx)(l.AlertTriangle,{size:32,color:"#8db902",style:{marginBottom:"15px"}}),(0,b.jsx)("h3",{style:{color:"#fff",fontSize:"16px",fontWeight:"800",margin:"0 0 5px 0"},children:s.chat_rules_heading||"Rules"}),(0,b.jsxs)("p",{style:{color:"#888",fontSize:"12px",lineHeight:"1.5",marginBottom:"20px",maxWidth:"200px"},children:["1. ",s.chat_rule_1||"No hate speech.",(0,b.jsx)("br",{}),"2. ",s.chat_rule_2||"No spam.",(0,b.jsx)("br",{}),"3. ",s.chat_rule_3||"Respect all."]}),(0,b.jsx)("button",{onClick:()=>A(!0),style:{background:"#8db902",color:"#000",border:"none",padding:"10px 30px",borderRadius:"6px",fontSize:"12px",fontWeight:"800",cursor:"pointer",textTransform:"uppercase",letterSpacing:"1px"},children:s.i_agree||"I Agree"})]}),(0,b.jsx)("iframe",{src:"https://my.cbox.ws/Reedstreams",width:"100%",height:"100%",allow:"autoplay",frameBorder:"0",scrolling:"auto",style:{display:"block",width:"100%",height:"100%"}})]})]})]})]})]})}function z(){return(0,b.jsx)(d.Suspense,{fallback:(0,b.jsx)(x,{}),children:(0,b.jsx)(y,{})})}a.s(["default",()=>z],41371)}];

//# sourceMappingURL=Reedstreams-Mainx_e1c9adf2._.js.map