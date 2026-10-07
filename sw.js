/* Static app shell only: manuscripts stay in localStorage, never in this cache. */
const VERSION='muse-shell-a88e712a5b544306';
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/core.js",
  "/paths-data.js",
  "/paths-ui.js",
  "/desk-data.js",
  "/desk-ui.js",
  "/exports.js",
  "/app.js",
  "/offline.js",
  "/icon.svg",
  "/manifest.webmanifest",
  "/come-funziona.html",
];
self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(VERSION);
        await cache.addAll(
          ASSETS.map((url) => new Request(url, { cache: "reload" })),
        );
      } catch (error) {
        await caches.delete(VERSION);
        throw error;
      }
    })(),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith("muse-shell-") && key !== VERSION)
          await caches.delete(key);
      await self.clients.claim();
    })(),
  ),
);
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !ASSETS.includes(url.pathname))
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION),
        hit = await cache.match(url.pathname);
      if (hit) return hit;
      return fetch(event.request);
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (event.data?.type !== "ACTIVATE_IF_ALONE") return;
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      if (clients.length > 1) {
        event.source?.postMessage({ type: "OTHER_TABS" });
        return;
      }
      await self.skipWaiting();
    })(),
  );
});
