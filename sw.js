// ===========================================================
//  sw.js — Training Board Service Worker
//  Strategy: Cache-first for app shell, network-first for data
//  CRITICAL: Never cache R2 video URLs — browser handles natively
// ===========================================================

const CACHE_NAME    = 'training-board-v3';
const CACHE_VERSION = 1;

// App shell — everything needed to boot offline
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/js/data.js',
  '/js/audio.js',
  '/js/ui.js',
  '/js/timer.js',
  '/js/state.js',
  '/js/boot.js',
];

// Never cache these — videos served from R2 CDN, browser caches natively
const BYPASS_PATTERNS = [
  /r2\.dev/,
  /cloudflare/,
  /supabase\.co/,
  /\.mp4$/,
  /\.webm$/,
  /\.mkv$/,
];

// ── INSTALL — cache the app shell ─────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE — clean up old caches ────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => { console.log('[SW] Deleting old cache:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — cache-first for shell, bypass for CDN/Supabase ─
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Never intercept: videos, Supabase, CDN
  if(BYPASS_PATTERNS.some(p => p.test(url))){
    return; // Let browser handle natively
  }

  // App shell: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached){
        // Serve from cache, refresh in background
        fetch(event.request)
          .then(response => {
            if(response && response.status === 200){
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
            }
          })
          .catch(() => {}); // Offline — stale cache is fine
        return cached;
      }
      // Not in cache — fetch and store
      return fetch(event.request).then(response => {
        if(!response || response.status !== 200) return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // Complete offline fallback — serve index.html for navigation requests
        if(event.request.mode === 'navigate'){
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── MESSAGE — force update from client ────────────────────
self.addEventListener('message', event => {
  if(event.data === 'skipWaiting') self.skipWaiting();
});
