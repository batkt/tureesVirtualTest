const API_CACHE_NAME = "api-cache-v1";
const CACHE_CLEANUP_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
const LAST_CLEANUP_KEY = "last-cache-cleanup";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== API_CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
    })(),
  );
});

async function getLastCleanupTime() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const response = await cache.match(LAST_CLEANUP_KEY);
    if (response) {
      const data = await response.json();
      return data.timestamp || 0;
    }
  } catch {}
  return 0;
}

async function updateLastCleanupTime() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    await cache.put(
      LAST_CLEANUP_KEY,
      new Response(JSON.stringify({ timestamp: Date.now() }), {
        headers: { "Content-Type": "application/json" },
      }),
    );
  } catch {}
}

async function cleanAllCaches() {
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await updateLastCleanupTime();
  } catch {}
}

async function checkAndCleanCache() {
  try {
    const lastCleanup = await getLastCleanupTime();
    const now = Date.now();
    if (now - lastCleanup >= CACHE_CLEANUP_INTERVAL || lastCleanup === 0) {
      await cleanAllCaches();
    }
  } catch {}
}

let cleanupInterval = null;

function startPeriodicCleanup() {
  if (cleanupInterval) clearInterval(cleanupInterval);
  cleanupInterval = setInterval(checkAndCleanCache, 60 * 60 * 1000);
  checkAndCleanCache();
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== API_CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await checkAndCleanCache();
      startPeriodicCleanup();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (navigator.onLine) return;

  event.respondWith(
    fetch(event.request).catch(
      () => new Response("Интернет салсан байна", { status: 503 }),
    ),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CLEAN_CACHE") {
    checkAndCleanCache();
  }
});
