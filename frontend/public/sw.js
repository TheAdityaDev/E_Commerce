const CACHE_NAME = "app-cache-v2";
const OFFLINE_URL = "/offline.html";

const ASSETS_TO_CACHE = [
  "/",
  "/offline.html",
];

// Install
self.addEventListener("install", (event) => {
  console.log("SW: Installing...");
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate
self.addEventListener("activate", (event) => {
  console.log("SW: Activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Let browser handle all cross-origin and non-GET requests.
  // This avoids breaking third-party SDK calls (e.g., Razorpay telemetry/APIs).
  if (requestUrl.origin !== self.location.origin || event.request.method !== "GET") {
    return;
  }

  // Only handle navigation requests for offline fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Try cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then((res) => {
      return (
        res ||
        fetch(event.request).catch(() => new Response("", { status: 404 }))
      );
    })
  );
});

// Optional: Skip waiting
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});