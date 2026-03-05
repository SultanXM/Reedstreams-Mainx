// Proxy worker with request interception
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
      return new Response('Missing URL', { status: 400 });
    }

    // Allow all domains that the embed might use
    const blockedDomains = ['google.com', 'facebook.com', 'twitter.com'];
    let targetHostname;
    try {
      targetHostname = new URL(targetUrl).hostname;
    } catch {
      return new Response('Invalid URL', { status: 400 });
    }
    
    if (blockedDomains.some(d => targetHostname.includes(d))) {
      return new Response('Domain blocked', { status: 403 });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Referer': 'https://sportsurge.ws/',
        },
      });

      const contentType = response.headers.get('content-type') || '';
      const workerOrigin = url.origin;
      
      // For HTML, inject proxy script
      if (contentType.includes('text/html')) {
        let html = await response.text();
        const baseOrigin = new URL(targetUrl).origin;
        
        // Script to intercept ALL network requests
        const proxyScript = `<script>
(function() {
  const WORKER_URL = '${workerOrigin}';
  const TARGET_ORIGIN = '${baseOrigin}';
  
  function proxyUrl(url) {
    if (!url) return url;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    if (url.startsWith(WORKER_URL)) return url;
    
    // Make absolute
    if (url.startsWith('//')) url = 'https:' + url;
    else if (url.startsWith('/')) url = TARGET_ORIGIN + url;
    else if (!url.startsWith('http')) url = TARGET_ORIGIN + '/' + url;
    
    // Check if it's a target domain
    if (url.includes('aapmains.net') || url.includes('ascendastro.space')) {
      return WORKER_URL + '?url=' + encodeURIComponent(url);
    }
    return url;
  }
  
  // Override fetch
  const origFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string') {
      input = proxyUrl(input);
    } else if (input instanceof Request) {
      const newUrl = proxyUrl(input.url);
      input = new Request(newUrl, input);
    }
    return origFetch.call(this, input, init);
  };
  
  // Override XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    return origOpen.call(this, method, proxyUrl(url), ...rest);
  };
  
  // Override WebSocket
  const origWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    return new origWebSocket(proxyUrl(url), protocols);
  };
  
  // Override createElement for sources
  const origCreateElement = document.createElement;
  document.createElement = function(tag) {
    const el = origCreateElement.call(document, tag);
    if (tag === 'source' || tag === 'track') {
      const origSetAttr = el.setAttribute;
      el.setAttribute = function(name, value) {
        if (name === 'src') value = proxyUrl(value);
        return origSetAttr.call(this, name, value);
      };
    }
    return el;
  };
  
  // Proxy existing elements
  document.querySelectorAll('source, track').forEach(function(el) {
    if (el.src) el.src = proxyUrl(el.src);
  });
  
  // Block frame detection
  try {
    Object.defineProperty(window, 'top', { get: function() { return window; } });
    Object.defineProperty(window, 'parent', { get: function() { return window; } });
  } catch(e) {}
})();
</script>`;
        
        // Inject before closing head or at start of body
        if (html.includes('</head>')) {
          html = html.replace('</head>', proxyScript + '</head>');
        } else if (html.includes('<body>')) {
          html = html.replace('<body>', '<body>' + proxyScript);
        } else {
          html = proxyScript + html;
        }
        
        // Add base tag
        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head><base href="${baseOrigin}/">`);
        }
        
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      // Pass through other content
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  },
};
