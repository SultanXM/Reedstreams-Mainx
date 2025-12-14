(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,90992,e=>{"use strict";let t=(0,e.i(68320).default)("OctagonAlert",[["path",{d:"M12 16h.01",key:"1drbdi"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",key:"1fd625"}]]);e.s(["AlertOctagon",()=>t],90992)},12620,e=>{"use strict";let t=(0,e.i(68320).default)("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",()=>t],12620)},90037,e=>{"use strict";let t=(0,e.i(68320).default)("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",()=>t],90037)},88537,(e,t,i)=>{},83246,(e,t,i)=>{var n=e.i(43732);e.r(88537);var r=e.r(9017),s=r&&"object"==typeof r&&"default"in r?r:{default:r},a=void 0!==n.default&&n.default.env&&!0,o=function(e){return"[object String]"===Object.prototype.toString.call(e)},l=function(){function e(e){var t=void 0===e?{}:e,i=t.name,n=void 0===i?"stylesheet":i,r=t.optimizeForSpeed,s=void 0===r?a:r;d(o(n),"`name` must be a string"),this._name=n,this._deletedRulePlaceholder="#"+n+"-deleted-rule____{}",d("boolean"==typeof s,"`optimizeForSpeed` must be a boolean"),this._optimizeForSpeed=s,this._serverSheet=void 0,this._tags=[],this._injected=!1,this._rulesCount=0;var l="undefined"!=typeof window&&document.querySelector('meta[property="csp-nonce"]');this._nonce=l?l.getAttribute("content"):null}var t,i=e.prototype;return i.setOptimizeForSpeed=function(e){d("boolean"==typeof e,"`setOptimizeForSpeed` accepts a boolean"),d(0===this._rulesCount,"optimizeForSpeed cannot be when rules have already been inserted"),this.flush(),this._optimizeForSpeed=e,this.inject()},i.isOptimizeForSpeed=function(){return this._optimizeForSpeed},i.inject=function(){var e=this;if(d(!this._injected,"sheet already injected"),this._injected=!0,"undefined"!=typeof window&&this._optimizeForSpeed){this._tags[0]=this.makeStyleTag(this._name),this._optimizeForSpeed="insertRule"in this.getSheet(),this._optimizeForSpeed||(a||console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),this.flush(),this._injected=!0);return}this._serverSheet={cssRules:[],insertRule:function(t,i){return"number"==typeof i?e._serverSheet.cssRules[i]={cssText:t}:e._serverSheet.cssRules.push({cssText:t}),i},deleteRule:function(t){e._serverSheet.cssRules[t]=null}}},i.getSheetForTag=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]},i.getSheet=function(){return this.getSheetForTag(this._tags[this._tags.length-1])},i.insertRule=function(e,t){if(d(o(e),"`insertRule` accepts only strings"),"undefined"==typeof window)return"number"!=typeof t&&(t=this._serverSheet.cssRules.length),this._serverSheet.insertRule(e,t),this._rulesCount++;if(this._optimizeForSpeed){var i=this.getSheet();"number"!=typeof t&&(t=i.cssRules.length);try{i.insertRule(e,t)}catch(t){return a||console.warn("StyleSheet: illegal rule: \n\n"+e+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),-1}}else{var n=this._tags[t];this._tags.push(this.makeStyleTag(this._name,e,n))}return this._rulesCount++},i.replaceRule=function(e,t){if(this._optimizeForSpeed||"undefined"==typeof window){var i="undefined"!=typeof window?this.getSheet():this._serverSheet;if(t.trim()||(t=this._deletedRulePlaceholder),!i.cssRules[e])return e;i.deleteRule(e);try{i.insertRule(t,e)}catch(n){a||console.warn("StyleSheet: illegal rule: \n\n"+t+"\n\nSee https://stackoverflow.com/q/20007992 for more info"),i.insertRule(this._deletedRulePlaceholder,e)}}else{var n=this._tags[e];d(n,"old rule at index `"+e+"` not found"),n.textContent=t}return e},i.deleteRule=function(e){if("undefined"==typeof window)return void this._serverSheet.deleteRule(e);if(this._optimizeForSpeed)this.replaceRule(e,"");else{var t=this._tags[e];d(t,"rule at index `"+e+"` not found"),t.parentNode.removeChild(t),this._tags[e]=null}},i.flush=function(){this._injected=!1,this._rulesCount=0,"undefined"!=typeof window?(this._tags.forEach(function(e){return e&&e.parentNode.removeChild(e)}),this._tags=[]):this._serverSheet.cssRules=[]},i.cssRules=function(){var e=this;return"undefined"==typeof window?this._serverSheet.cssRules:this._tags.reduce(function(t,i){return i?t=t.concat(Array.prototype.map.call(e.getSheetForTag(i).cssRules,function(t){return t.cssText===e._deletedRulePlaceholder?null:t})):t.push(null),t},[])},i.makeStyleTag=function(e,t,i){t&&d(o(t),"makeStyleTag accepts only strings as second parameter");var n=document.createElement("style");this._nonce&&n.setAttribute("nonce",this._nonce),n.type="text/css",n.setAttribute("data-"+e,""),t&&n.appendChild(document.createTextNode(t));var r=document.head||document.getElementsByTagName("head")[0];return i?r.insertBefore(n,i):r.appendChild(n),n},t=[{key:"length",get:function(){return this._rulesCount}}],function(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(e.prototype,t),e}();function d(e,t){if(!e)throw Error("StyleSheet: "+t+".")}var c=function(e){for(var t=5381,i=e.length;i;)t=33*t^e.charCodeAt(--i);return t>>>0},p={};function u(e,t){if(!t)return"jsx-"+e;var i=String(t),n=e+i;return p[n]||(p[n]="jsx-"+c(e+"-"+i)),p[n]}function h(e,t){"undefined"==typeof window&&(t=t.replace(/\/style/gi,"\\/style"));var i=e+t;return p[i]||(p[i]=t.replace(/__jsx-style-dynamic-selector/g,e)),p[i]}var f=function(){function e(e){var t=void 0===e?{}:e,i=t.styleSheet,n=void 0===i?null:i,r=t.optimizeForSpeed,s=void 0!==r&&r;this._sheet=n||new l({name:"styled-jsx",optimizeForSpeed:s}),this._sheet.inject(),n&&"boolean"==typeof s&&(this._sheet.setOptimizeForSpeed(s),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),this._fromServer=void 0,this._indices={},this._instancesCounts={}}var t=e.prototype;return t.add=function(e){var t=this;void 0===this._optimizeForSpeed&&(this._optimizeForSpeed=Array.isArray(e.children),this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),this._optimizeForSpeed=this._sheet.isOptimizeForSpeed()),"undefined"==typeof window||this._fromServer||(this._fromServer=this.selectFromServer(),this._instancesCounts=Object.keys(this._fromServer).reduce(function(e,t){return e[t]=0,e},{}));var i=this.getIdAndRules(e),n=i.styleId,r=i.rules;if(n in this._instancesCounts){this._instancesCounts[n]+=1;return}var s=r.map(function(e){return t._sheet.insertRule(e)}).filter(function(e){return -1!==e});this._indices[n]=s,this._instancesCounts[n]=1},t.remove=function(e){var t=this,i=this.getIdAndRules(e).styleId;if(function(e,t){if(!e)throw Error("StyleSheetRegistry: "+t+".")}(i in this._instancesCounts,"styleId: `"+i+"` not found"),this._instancesCounts[i]-=1,this._instancesCounts[i]<1){var n=this._fromServer&&this._fromServer[i];n?(n.parentNode.removeChild(n),delete this._fromServer[i]):(this._indices[i].forEach(function(e){return t._sheet.deleteRule(e)}),delete this._indices[i]),delete this._instancesCounts[i]}},t.update=function(e,t){this.add(t),this.remove(e)},t.flush=function(){this._sheet.flush(),this._sheet.inject(),this._fromServer=void 0,this._indices={},this._instancesCounts={}},t.cssRules=function(){var e=this,t=this._fromServer?Object.keys(this._fromServer).map(function(t){return[t,e._fromServer[t]]}):[],i=this._sheet.cssRules();return t.concat(Object.keys(this._indices).map(function(t){return[t,e._indices[t].map(function(e){return i[e].cssText}).join(e._optimizeForSpeed?"":"\n")]}).filter(function(e){return!!e[1]}))},t.styles=function(e){var t,i;return t=this.cssRules(),void 0===(i=e)&&(i={}),t.map(function(e){var t=e[0],n=e[1];return s.default.createElement("style",{id:"__"+t,key:"__"+t,nonce:i.nonce?i.nonce:void 0,dangerouslySetInnerHTML:{__html:n}})})},t.getIdAndRules=function(e){var t=e.children,i=e.dynamic,n=e.id;if(i){var r=u(n,i);return{styleId:r,rules:Array.isArray(t)?t.map(function(e){return h(r,e)}):[h(r,t)]}}return{styleId:u(n),rules:Array.isArray(t)?t:[t]}},t.selectFromServer=function(){return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e,t){return e[t.id.slice(2)]=t,e},{})},e}(),x=r.createContext(null);function m(){return new f}function g(){return r.useContext(x)}x.displayName="StyleSheetContext";var y=s.default.useInsertionEffect||s.default.useLayoutEffect,b="undefined"!=typeof window?m():void 0;function v(e){var t=b||g();return t&&("undefined"==typeof window?t.add(e):y(function(){return t.add(e),function(){t.remove(e)}},[e.id,String(e.dynamic)])),null}v.dynamic=function(e){return e.map(function(e){return u(e[0],e[1])}).join(" ")},i.StyleRegistry=function(e){var t=e.registry,i=e.children,n=r.useContext(x),a=r.useState(function(){return n||t||m()})[0];return s.default.createElement(x.Provider,{value:a},i)},i.createStyleRegistry=m,i.style=v,i.useStyleRegistry=g},18607,(e,t,i)=>{t.exports=e.r(83246).style},84011,e=>{"use strict";var t=e.i(68262),i=e.i(18607),n=e.i(9017),r=e.i(10212);function s({matchId:e}){let i=(0,r.useSearchParams)().get("sportName"),[s,a]=(0,n.useState)([]),[o,l]=(0,n.useState)(null),[d,c]=(0,n.useState)(null),[p,u]=(0,n.useState)(!0),[h,f]=(0,n.useState)(null),[x,m]=(0,n.useState)(!0),[g,y]=(0,n.useState)(null),[b,v]=(0,n.useState)(!1);return((0,n.useEffect)(()=>{!async function(){try{u(!0),f(null);let t=null,n=sessionStorage.getItem("currentMatch");if(n){let i=JSON.parse(n);String(i.id)===String(e)&&(t=i)}if(!t){let i=await fetch("/api/matches");i.ok&&(t=(await i.json()).find(t=>String(t.id)===String(e)))}if(!t){f("Match data unavailable."),u(!1);return}c(t);let r=new Date(t.date).getTime(),s=Date.now();if(r>s){v(!1),u(!1);return}if(v(!0),!t.sources||0===t.sources.length){f("No streams found."),u(!1);return}let o=t.sources.map(e=>fetch(`/api/stream/${e.source}/${e.id}`).then(e=>e.json()).catch(()=>[])),d=await Promise.all(o),p=[];if(t.sources.forEach((e,t)=>{Array.isArray(d[t])&&d[t].forEach(t=>p.push({...t,sourceIdentifier:e.source}))}),0===p.length)f("Streams are offline.");else{a(p);let e=i?.toLowerCase().includes("basketball"),t=null;e&&(t=p.find(e=>"bravo #2"===e.sourceIdentifier)),t||(t=p.find(e=>"admin"===e.sourceIdentifier&&1===e.streamNo)),t||(t=p.find(e=>e.hd)),l(t||p[0])}}catch(e){f("System Error.")}finally{u(!1)}}()},[e,i]),(0,n.useEffect)(()=>{if(!d||b)return;let e=setInterval(()=>{let t=new Date(d.date).getTime()-Date.now();if(t<=0)v(!0),window.location.reload(),clearInterval(e);else{let e=Math.floor(t/36e5);y({h:e,m:Math.floor(t%36e5/6e4),s:Math.floor(t%6e4/1e3)})}},1e3);return()=>clearInterval(e)},[d,b]),(0,n.useEffect)(()=>{m(!0)},[o]),p)?(0,t.jsxs)("div",{className:"player-container loading-state",children:[(0,t.jsx)("div",{className:"spinner"}),(0,t.jsx)("span",{children:"ESTABLISHING UPLINK..."})]}):h?(0,t.jsx)("div",{className:"player-container error-state",children:h}):!b&&g?(0,t.jsx)("div",{className:"player-wrapper",children:(0,t.jsxs)("div",{className:"player-container countdown-state",style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#050505",color:"#fff"},children:[(0,t.jsx)("div",{style:{fontSize:"12px",color:"#666",letterSpacing:"2px",marginBottom:"15px"},children:"BROADCAST BEGINS IN"}),(0,t.jsxs)("div",{style:{fontSize:"40px",fontWeight:"900",color:"#8db902",fontFamily:"monospace",textShadow:"0 0 20px rgba(141, 185, 2, 0.4)"},children:[String(g.h).padStart(2,"0")," : ",String(g.m).padStart(2,"0")," : ",String(g.s).padStart(2,"0")]}),(0,t.jsx)("div",{style:{fontSize:"10px",color:"#444",marginTop:"10px"},children:"WAITING FOR SATELLITE SIGNAL"})]})}):(0,t.jsxs)("div",{className:"player-wrapper",children:[(0,t.jsxs)("div",{className:"player-container",children:[x&&o&&(0,t.jsx)("div",{className:"shield-overlay",onClick:()=>m(!1)}),o?(0,t.jsx)("iframe",{src:o.embedUrl,className:"video-iframe",frameBorder:"0",allowFullScreen:!0,allow:"autoplay; encrypted-media; picture-in-picture"}):(0,t.jsx)("div",{className:"no-signal",children:"NO SIGNAL"})]}),s.length>1&&(0,t.jsxs)("div",{className:"stream-selector",children:[(0,t.jsxs)("div",{className:"stream-header",children:["AVAILABLE SIGNALS (",s.length,")"]}),(0,t.jsx)("div",{className:"stream-list",children:s.map((e,i)=>(0,t.jsxs)("button",{className:`stream-btn ${o?.embedUrl===e.embedUrl?"active":""}`,onClick:()=>l(e),children:[(0,t.jsx)("span",{className:"signal-icon"}),e.sourceIdentifier," #",e.streamNo,e.hd&&(0,t.jsx)("span",{className:"hd-badge",children:"HD"})]},i))})]})]})}var a=e.i(68320);let o=(0,a.default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),l=(0,a.default)("Minimize",[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]]),d=(0,a.default)("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]),c=(0,a.default)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var p=e.i(90037);let u=(0,a.default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),h=(0,a.default)("Twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]),f=(0,a.default)("Facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]),x=(0,a.default)("Tv",[["rect",{width:"20",height:"15",x:"2",y:"7",rx:"2",ry:"2",key:"10ag99"}],["polyline",{points:"17 2 12 7 7 2",key:"11pgbg"}]]);var m=e.i(50918);let g=(0,a.default)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),y=(0,a.default)("Wifi",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]]);var b=e.i(90992),v=e.i(12620),S=e.i(43118);let j=`
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
`;function w(){let{t:e}=(0,S.useLanguage)();return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.default,{id:j.__hash,children:j}),(0,t.jsxs)("div",{className:"match-page-container",children:[(0,t.jsx)("div",{className:"top-nav",children:(0,t.jsxs)("div",{className:"nav-back-wrapper",children:[(0,t.jsx)("div",{className:"nav-back-icon",children:(0,t.jsx)(o,{size:16})}),(0,t.jsxs)("div",{style:{fontSize:"20px",fontWeight:900,letterSpacing:"-1px",fontFamily:"sans-serif"},children:[(0,t.jsx)("span",{style:{color:"#fff"},children:"REED"}),(0,t.jsx)("span",{style:{color:"#8db902"},children:"STREAMS"})]})]})}),(0,t.jsxs)("div",{className:"match-grid layout-standard",children:[(0,t.jsx)("div",{className:"player-section",children:(0,t.jsxs)("div",{className:"loading-container",children:[(0,t.jsx)(y,{size:40,className:"loading-text"}),(0,t.jsx)("div",{className:"loading-text",children:e.establishing_connection||"ESTABLISHING SECURE UPLINK..."})]})}),(0,t.jsx)("div",{style:{background:"#050505",border:"1px solid #111"},className:"chat-panel"})]})]})]})}function _(){let e=(0,r.useRouter)(),a=String((0,r.useParams)().id),{t:y}=(0,S.useLanguage)(),[w,_]=(0,n.useState)(!1),[k,z]=(0,n.useState)(!1),[R,N]=(0,n.useState)(!0),[C,I]=(0,n.useState)(!1),[A,T]=(0,n.useState)(!1),[E,F]=(0,n.useState)(!1),[O,L]=(0,n.useState)(""),[M,B]=(0,n.useState)("Stream Lag / Buffering"),[D,P]=(0,n.useState)("Loading Stream..."),[W,U]=(0,n.useState)(null);(0,n.useEffect)(()=>{let e=sessionStorage.getItem("currentMatch");if(e)try{let t=JSON.parse(e),i=t.title||`${t.teams?.home?.name||"Home"} vs ${t.teams?.away?.name||"Away"}`;if(P(i),t.date){let e=new Date(t.date);U(e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}))}}catch(e){P("Live Stream")}},[]);let $=window.location.href,G=`Watch ${D} Live on ReedStreams!`,H={twitter:`https://twitter.com/intent/tweet?text=${encodeURIComponent(G)}&url=${encodeURIComponent($)}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent($)}`,whatsapp:`https://wa.me/?text=${encodeURIComponent(G+" "+$)}`},V=e=>{window.open(e,"_blank","width=600,height=400")},q=`<iframe src="https://reedstreams.com/embed/${a}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.default,{id:j.__hash,children:j}),A&&(0,t.jsx)("div",{className:"modal-overlay",children:(0,t.jsxs)("div",{className:"feedback-modal",children:[(0,t.jsx)("button",{onClick:()=>T(!1),style:{position:"absolute",top:"15px",right:"15px",background:"none",border:"none",color:"#666",cursor:"pointer"},children:(0,t.jsx)(m.X,{size:18})}),E?(0,t.jsxs)("div",{style:{textAlign:"center",padding:"30px 0"},children:[(0,t.jsx)(u,{size:48,color:"#8db902",style:{margin:"0 auto 15px auto"}}),(0,t.jsx)("h3",{style:{color:"#fff",margin:"0 0 5px 0"},children:y.report_sent||"Report Sent!"}),(0,t.jsx)("p",{style:{color:"#666",fontSize:"12px"},children:y.thank_you_report||"Thanks"})]}):(0,t.jsxs)("form",{onSubmit:e=>{e.preventDefault();let t=encodeURIComponent(`Issue Report: ${M}`),i=encodeURIComponent(`Match: ${D} (ID: ${a})
Details: ${O}`);window.location.href=`mailto:reedstreams000@gmail.com?subject=${t}&body=${i}`,F(!0),setTimeout(()=>{F(!1),T(!1),L("")},2e3)},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px"},children:[(0,t.jsx)(b.AlertOctagon,{size:24,color:"#8db902"}),(0,t.jsx)("h2",{style:{color:"#fff",fontSize:"18px",fontWeight:"800",margin:0},children:y.report||"Report Issue"})]}),(0,t.jsx)("label",{style:{color:"#888",fontSize:"11px",display:"block",marginBottom:"6px",fontWeight:"bold"},children:"ISSUE TYPE"}),(0,t.jsxs)("select",{value:M,onChange:e=>B(e.target.value),className:"feedback-select",children:[(0,t.jsx)("option",{children:y.stream_lag||"Stream Lag"}),(0,t.jsx)("option",{children:y.audio_sync||"Audio Sync"}),(0,t.jsx)("option",{children:y.stream_down||"Stream Down"}),(0,t.jsx)("option",{children:y.other_issue||"Other"})]}),(0,t.jsx)("label",{style:{color:"#888",fontSize:"11px",display:"block",marginBottom:"6px",fontWeight:"bold"},children:"DETAILS"}),(0,t.jsx)("textarea",{rows:3,placeholder:y.describe_issue||"Describe...",value:O,onChange:e=>L(e.target.value),className:"feedback-input"}),(0,t.jsxs)("button",{type:"submit",style:{width:"100%",background:"#8db902",color:"#000",border:"none",padding:"12px",borderRadius:"6px",fontWeight:"800",fontSize:"13px",cursor:"pointer",display:"flex",justifyContent:"center",alignItems:"center",gap:"8px"},children:[(0,t.jsx)(v.Send,{size:14})," ",y.submit_report||"Submit"]})]})]})}),(0,t.jsxs)("div",{style:{background:w?"#000":"#050505"},className:"match-page-container",children:[!w&&(0,t.jsxs)("div",{className:"top-nav",children:[(0,t.jsxs)("div",{onClick:()=>e.back(),className:"nav-back-wrapper",children:[(0,t.jsx)("div",{className:"nav-back-icon",children:(0,t.jsx)(o,{size:18})}),(0,t.jsxs)("div",{style:{fontSize:"22px",fontWeight:900,letterSpacing:"-1px",fontFamily:"sans-serif"},children:[(0,t.jsx)("span",{style:{color:"#fff"},children:"REED"}),(0,t.jsx)("span",{style:{color:"#8db902"},children:"STREAMS"})]})]}),(0,t.jsx)("div",{style:{display:"flex",gap:"10px"},children:(0,t.jsxs)("button",{onClick:()=>T(!0),style:{background:"#111",border:"1px solid #222",color:"#ccc",padding:"8px 12px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},children:[(0,t.jsx)(b.AlertOctagon,{size:14,color:"#f00"})," ",(0,t.jsx)("span",{style:{display:"none",md:"inline"},children:y.report||"Report"})]})})]}),(0,t.jsxs)("div",{className:`match-grid ${w?"layout-cinema":"layout-standard"}`,children:[(0,t.jsxs)("div",{className:"player-section",children:[(0,t.jsx)("div",{className:"player-wrapper",children:(0,t.jsx)(s,{matchId:a})}),(0,t.jsxs)("div",{className:"info-bar",children:[(0,t.jsxs)("div",{className:"match-title-group",children:[(0,t.jsxs)("div",{className:"meta-row",children:[(0,t.jsx)("span",{className:"live-tag",children:y.live||"LIVE"}),W&&(0,t.jsxs)("span",{className:"time-tag",children:[(0,t.jsx)(g,{size:12})," ",W]})]}),(0,t.jsx)("h1",{className:"match-main-title",children:D})]}),(0,t.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"10px",width:"100%",flex:"1",maxWidth:"500px"},children:[(0,t.jsxs)("div",{className:"controls-group",children:[(0,t.jsxs)("button",{onClick:()=>_(!w),style:{background:"#111",border:"1px solid #222",color:w?"#8db902":"#ccc",padding:"10px 14px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",textTransform:"uppercase",flex:1,justifyContent:"center"},className:"action-btn",children:[w?(0,t.jsx)(l,{size:14}):(0,t.jsx)(x,{size:14}),w?y.exit_cinema||"Exit":y.cinema_mode||"Cinema"]}),!w&&(0,t.jsxs)("div",{style:{display:"flex",gap:"8px",flex:1,justifyContent:"center"},children:[(0,t.jsx)("button",{onClick:()=>V(H.twitter),style:{background:"#000",border:"1px solid #222",padding:"10px",borderRadius:"6px",cursor:"pointer"},children:(0,t.jsx)(h,{size:16,color:"#1DA1F2"})}),(0,t.jsx)("button",{onClick:()=>V(H.facebook),style:{background:"#000",border:"1px solid #222",padding:"10px",borderRadius:"6px",cursor:"pointer"},children:(0,t.jsx)(f,{size:16,color:"#1877F2"})}),(0,t.jsx)("button",{onClick:()=>V(H.whatsapp),style:{background:"#000",border:"1px solid #222",padding:"10px",borderRadius:"6px",cursor:"pointer"},children:(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"#25D366",children:(0,t.jsx)("path",{d:"M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"})})})]}),!w&&(0,t.jsxs)("button",{onClick:()=>N(!R),style:{background:R?"#222":"#111",border:"1px solid #222",color:"#ccc",padding:"10px 14px",borderRadius:"6px",fontSize:"11px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",textTransform:"uppercase",flex:1,justifyContent:"center"},className:"action-btn",children:[(0,t.jsx)(d,{size:14})," ",y.embed||"Embed"]})]}),R&&!w&&(0,t.jsx)("div",{style:{width:"100%",animation:"fadeIn 0.3s"},children:(0,t.jsxs)("div",{style:{background:"#000",padding:"10px",borderRadius:"6px",border:"1px solid #222",display:"flex",gap:"8px",alignItems:"center"},children:[(0,t.jsx)("input",{readOnly:!0,value:q,style:{background:"transparent",border:"none",color:"#888",width:"100%",fontSize:"11px",fontFamily:"monospace",outline:"none"}}),(0,t.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(q),I(!0),setTimeout(()=>I(!1),2e3)},style:{background:"transparent",border:"none",cursor:"pointer",color:C?"#8db902":"#fff"},children:C?(0,t.jsx)(u,{size:16}):(0,t.jsx)(c,{size:16})}),(0,t.jsx)("button",{onClick:()=>N(!1),style:{background:"transparent",border:"none",cursor:"pointer",color:"#444"},children:(0,t.jsx)(m.X,{size:14})})]})})]})]})]}),!w&&(0,t.jsxs)("div",{className:"chat-panel",children:[(0,t.jsxs)("div",{style:{padding:"15px",borderBottom:"1px solid #222",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f0f0f"},children:[(0,t.jsx)("span",{style:{color:"#fff",fontWeight:"bold",fontSize:"13px"},children:y.live_chat||"Live Chat"}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"#888"},children:[(0,t.jsx)("div",{style:{width:"6px",height:"6px",background:"#8db902",borderRadius:"50%"}}),(0,t.jsx)("span",{style:{color:"#8db902",fontWeight:"bold"},children:y.online||"Online"})]})]}),(0,t.jsxs)("div",{style:{flex:1,position:"relative",background:"#050505"},children:[!k&&(0,t.jsxs)("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"rgba(5,5,5,0.95)",backdropFilter:"blur(4px)",zIndex:10,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"20px",textAlign:"center"},children:[(0,t.jsx)(p.AlertTriangle,{size:32,color:"#8db902",style:{marginBottom:"15px"}}),(0,t.jsx)("h3",{style:{color:"#fff",fontSize:"16px",fontWeight:"800",margin:"0 0 5px 0"},children:y.chat_rules_heading||"Rules"}),(0,t.jsxs)("p",{style:{color:"#888",fontSize:"12px",lineHeight:"1.5",marginBottom:"20px",maxWidth:"200px"},children:["1. ",y.chat_rule_1||"No hate speech.",(0,t.jsx)("br",{}),"2. ",y.chat_rule_2||"No spam.",(0,t.jsx)("br",{}),"3. ",y.chat_rule_3||"Respect all."]}),(0,t.jsx)("button",{onClick:()=>z(!0),style:{background:"#8db902",color:"#000",border:"none",padding:"10px 30px",borderRadius:"6px",fontSize:"12px",fontWeight:"800",cursor:"pointer",textTransform:"uppercase",letterSpacing:"1px"},children:y.i_agree||"I Agree"})]}),(0,t.jsx)("iframe",{src:"https://my.cbox.ws/Reedstreams",width:"100%",height:"100%",allow:"autoplay",frameBorder:"0",scrolling:"auto",style:{display:"block",width:"100%",height:"100%"}})]})]})]})]})]})}function k(){return(0,t.jsx)(n.Suspense,{fallback:(0,t.jsx)(w,{}),children:(0,t.jsx)(_,{})})}e.s(["default",()=>k],84011)}]);