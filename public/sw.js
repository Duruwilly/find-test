// Minimal offline cache (no build step). Strategy:
//  - Card pages and map tiles: network-first, fall back to cache, so a card opened once still
//    works when the rider loses signal.
//  - Static assets (_next/static): cache-first.
// Swap for Workbox later if routing rules get more complex.
const CACHE = "findme-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req);
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.pathname.startsWith("/_next/static/")) return e.respondWith(cacheFirst(req));
  if (url.pathname.startsWith("/c/") || url.hostname === "tile.openstreetmap.org" || url.pathname.startsWith("/media/") || url.pathname.startsWith("/api/cards/"))
    return e.respondWith(networkFirst(req));
});
