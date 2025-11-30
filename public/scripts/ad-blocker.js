(function() {
  'use strict';
  
  // Patterns to identify ad-related URLs
  const blockedPatterns = [
    /refpa\d+\.com/i,
    /popads/i,
    /popcash/i,
    /propellerads/i,
    /adsterra/i,
    /exoclick/i,
    /juicyads/i,
    /trafficjunky/i,
    /\.space\/[a-z0-9]+\?/i,
    /clickunder/i,
    /tabover/i,
    /popunder/i,
    /\bads\b/i,
    /doubleclick/i,
    /googlesyndication/i,
  ];
  
  // Check if URL matches blocked patterns
  function isBlocked(url) {
    if (!url) return false;
    const urlStr = String(url);
    return blockedPatterns.some(pattern => pattern.test(urlStr));
  }
  
  // Override window.open to block popups
  const originalOpen = window.open;
  window.open = function(url, target, features) {
    if (isBlocked(url)) {
      console.log('[ReedStreams AdBlock] Blocked popup:', url?.substring(0, 50) + '...');
      return null;
    }
    // Only allow same-origin popups or user-initiated ones
    try {
      const urlObj = new URL(url, window.location.origin);
      if (urlObj.origin !== window.location.origin) {
        console.log('[ReedStreams AdBlock] Blocked cross-origin popup');
        return null;
      }
    } catch (e) {
      // Invalid URL, block it
      return null;
    }
    return originalOpen.call(window, url, target, features);
  };
  
  // Override createElement to catch dynamic script injection
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function(tagName, options) {
    const element = originalCreateElement(tagName, options);
    
    if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
      // Intercept src setting
      let _src = '';
      Object.defineProperty(element, 'src', {
        get: function() { return _src; },
        set: function(value) {
          if (isBlocked(value)) {
            console.log('[ReedStreams AdBlock] Blocked ' + tagName + ' src:', value?.substring(0, 50) + '...');
            return;
          }
          _src = value;
          element.setAttribute('src', value);
        }
      });
    }
    
    return element;
  };
  
  // Block navigation attempts via location changes
  let locationLocked = false;
  const originalLocation = window.location;
  
  // Intercept click events that might trigger ads
  document.addEventListener('click', function(e) {
    // Check if click target or parent is an ad link
    let target = e.target;
    while (target && target !== document.body) {
      if (target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (isBlocked(href)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('[ReedStreams AdBlock] Blocked ad link click');
          return false;
        }
      }
      target = target.parentElement;
    }
  }, true);
  
  // Prevent mousedown hijacking (common ad technique)
  document.addEventListener('mousedown', function(e) {
    // Store original target for later verification
    window._lastClickTarget = e.target;
  }, true);
  
  // Block fetch requests to ad domains
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    const url = typeof resource === 'string' ? resource : resource?.url;
    if (isBlocked(url)) {
      console.log('[ReedStreams AdBlock] Blocked fetch:', url?.substring(0, 50) + '...');
      return Promise.reject(new Error('Blocked by ReedStreams AdBlock'));
    }
    return originalFetch.call(window, resource, init);
  };
  
  // Block XMLHttpRequest to ad domains
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (isBlocked(url)) {
      console.log('[ReedStreams AdBlock] Blocked XHR:', url?.substring(0, 50) + '...');
      this._blocked = true;
      return;
    }
    return originalXHROpen.call(this, method, url, ...args);
  };
  
  const originalXHRSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(...args) {
    if (this._blocked) {
      return;
    }
    return originalXHRSend.call(this, ...args);
  };
  
  // Remove existing ad elements
  function removeAdElements() {
    // Remove scripts with ad sources
    document.querySelectorAll('script[src]').forEach(script => {
      if (isBlocked(script.src)) {
        script.remove();
        console.log('[ReedStreams AdBlock] Removed ad script');
      }
    });
    
    // Remove iframes with ad sources
    document.querySelectorAll('iframe[src]').forEach(iframe => {
      if (isBlocked(iframe.src)) {
        iframe.remove();
        console.log('[ReedStreams AdBlock] Removed ad iframe');
      }
    });
    
    // Remove elements with ad-related classes/ids
    const adSelectors = [
      '[class*="pop"]',
      '[class*="ad-"]',
      '[id*="pop"]',
      '[id*="ad-"]',
      '[class*="overlay"]',
    ];
    
    // Be careful not to remove the video player
    document.querySelectorAll(adSelectors.join(',')).forEach(el => {
      // Don't remove if it's part of video player
      if (!el.closest('.video-player') && !el.closest('.video-section') && !el.querySelector('video')) {
        // Check if it looks like an ad overlay
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute') {
          if (style.zIndex && parseInt(style.zIndex) > 100) {
            el.remove();
            console.log('[ReedStreams AdBlock] Removed overlay element');
          }
        }
      }
    });
  }
  
  // Watch for dynamically added ad elements
  const observer = new MutationObserver((mutations) => {
    let shouldClean = false;
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node;
          
          // Check script and iframe elements
          if (el.tagName === 'SCRIPT' || el.tagName === 'IFRAME') {
            const src = el.src || el.getAttribute('src');
            if (isBlocked(src)) {
              el.remove();
              console.log('[ReedStreams AdBlock] Removed dynamically added:', el.tagName);
            }
          }
          
          // Check for overlay ads
          const style = window.getComputedStyle(el);
          if ((style.position === 'fixed' || style.position === 'absolute') && 
              style.zIndex && parseInt(style.zIndex) > 9000) {
            // High z-index fixed/absolute positioned elements are likely ads
            if (!el.closest('.video-player') && !el.closest('.stream-selector')) {
              shouldClean = true;
            }
          }
        }
      });
    });
    
    if (shouldClean) {
      setTimeout(removeAdElements, 100);
    }
  });
  
  // Start observing
  if (document.body) {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'href']
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href']
      });
    });
  }
  
  // Initial cleanup
  if (document.readyState === 'complete') {
    removeAdElements();
  } else {
    window.addEventListener('load', removeAdElements);
  }
  
  // Periodic cleanup (some ads inject after delays)
  setInterval(removeAdElements, 3000);
  
  console.log('[ReedStreams AdBlock] Initialized - protecting your viewing experience');
})();