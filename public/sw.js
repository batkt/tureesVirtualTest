const DB_NAME = "turees-db";
const DB_VERSION = 10;
const STORES = {
  USER: "user",
  PAYMENTS: "offline-payments",
  CACHE: "cache",
};

const API_CACHE_NAME = "api-cache-v1";
const PAGES_CACHE_NAME = "pages-cache-v1";
const OFFLINE_PAGE = "/offline.html";
const pagesToCache = [
  "/khyanalt/zogsool/camera",
  "/khyanalt/zogsool",
  "/khyanalt/zogsool/mashinBurtgel",
  "/khyanalt/zogsool/cameraVals",
  "/khyanalt/zogsool/orshinSuugch",
  OFFLINE_PAGE,
];

let lastSyncTime = 0;
let syncInProgress = false;

// ---------------- IndexedDB ----------------
function upgradeDB(db) {
  const stores = db.objectStoreNames;
  if (!stores.contains(STORES.USER)) db.createObjectStore(STORES.USER);
  if (!stores.contains(STORES.PAYMENTS)) {
    db.createObjectStore(STORES.PAYMENTS, {
      keyPath: "id",
      autoIncrement: true,
    });
  }
  if (!stores.contains(STORES.CACHE)) db.createObjectStore(STORES.CACHE);
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => upgradeDB(event.target.result);
    request.onsuccess = (event) => {
      const db = event.target.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onerror = (event) => reject(event.target.error);
  });
}

function serializeHeaders(headers) {
  const obj = {};
  for (const [key, value] of headers.entries()) obj[key] = value;
  return obj;
}

function deserializeHeaders(obj) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(obj)) headers.set(key, value);
  return headers;
}

// ---------------- Fetch Handler ----------------
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // API POST requests
  if (url.pathname.startsWith("/api/")) {
    if (req.method === "POST") {
      event.respondWith(handlePostRequest(req));
      return;
    }
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok)
            caches
              .open(API_CACHE_NAME)
              .then((cache) => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cached pages (camera, registration, etc.)
  if (pagesToCache.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            if (res.ok)
              caches
                .open(PAGES_CACHE_NAME)
                .then((cache) => cache.put(req, res.clone()));
            return res;
          })
          .catch(() => new Response("Resource not available", { status: 503 }));
      })
    );
    return;
  }

  // Network-first for dynamic pages (login, root, etc.)
  event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_PAGE)));
});

// ---------------- POST offline storage ----------------
async function handlePostRequest(req) {
  try {
    return await fetch(req.clone());
  } catch (err) {
    const reqClone = req.clone();
    let body,
      contentType = req.headers.get("content-type") || "";

    try {
      body = contentType.includes("application/json")
        ? await reqClone.json()
        : await reqClone.text();
    } catch {
      body = null;
    }

    try {
      const db = await openIndexedDB();
      const tx = db.transaction(STORES.PAYMENTS, "readwrite");
      const store = tx.objectStore(STORES.PAYMENTS);

      await new Promise((resolve, reject) => {
        const addReq = store.add({
          url: req.url,
          body,
          method: req.method,
          headers: serializeHeaders(req.headers),
          contentType,
          synced: false,
          createdAt: new Date().toISOString(),
          retryCount: 0,
          lastError: err.message,
        });
        addReq.onsuccess = () => resolve();
        addReq.onerror = () => reject(addReq.error);
      });

      db.close();
    } catch {}

    return new Response(
      JSON.stringify({
        offline: true,
        message: "Хүсэлт арын синкэд хадгалагдлаа",
        success: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ---------------- Pending payments ----------------
async function getPendingPayments() {
  try {
    const db = await openIndexedDB();
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) return [];
    const tx = db.transaction(STORES.PAYMENTS, "readonly");
    const store = tx.objectStore(STORES.PAYMENTS);
    const payments = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return payments;
  } catch {
    return [];
  }
}

// ---------------- Sync offline payments ----------------
async function syncPaymentsFromSW() {
  if (syncInProgress || Date.now() - lastSyncTime < 10000) return;
  syncInProgress = true;
  lastSyncTime = Date.now();

  try {
    const db = await openIndexedDB();
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) return;

    const tx = db.transaction(STORES.PAYMENTS, "readwrite");
    const store = tx.objectStore(STORES.PAYMENTS);
    const payments = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    for (const p of payments) {
      try {
        if ((p.retryCount || 0) >= 5) continue;

        const headers = deserializeHeaders(p.headers);
        if (p.body && p.contentType) headers.set("content-type", p.contentType);

        const body = p.body
          ? p.contentType.includes("application/json")
            ? JSON.stringify(p.body)
            : p.body
          : undefined;

        const response = await fetch(p.url, {
          method: p.method,
          headers,
          body,
        });

        if (response.ok)
          await new Promise(
            (res) => (store.delete(p.id).onsuccess = () => res())
          );
        else {
          p.retryCount = (p.retryCount || 0) + 1;
          p.lastError = `HTTP ${response.status}`;
          p.lastRetry = new Date().toISOString();
          store.put(p);
        }
      } catch (err) {
        p.retryCount = (p.retryCount || 0) + 1;
        p.lastError = err.message;
        p.lastRetry = new Date().toISOString();
        store.put(p);
      }
    }

    db.close();
  } catch {
  } finally {
    syncInProgress = false;
  }
}

// ---------------- Service Worker Events ----------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      openIndexedDB(),
      caches.open(PAGES_CACHE_NAME).then((cache) => cache.addAll(pagesToCache)),
      caches.open(API_CACHE_NAME),
    ])
  );
});

self.addEventListener("activate", (event) => {
  const validCaches = [API_CACHE_NAME, PAGES_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !validCaches.includes(k))
            .map((k) => caches.delete(k))
        )
      )
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-payments") event.waitUntil(syncPaymentsFromSW());
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === "TRIGGER_SYNC") syncPaymentsFromSW();
  if (data.type === "GET_PENDING_PAYMENTS")
    getPendingPayments().then((payments) =>
      event.ports[0].postMessage({ payments })
    );
  if (data.type === "CLEAR_CACHE") {
    caches
      .keys()
      .then((names) => Promise.all(names.map((n) => caches.delete(n))));
  }
});
