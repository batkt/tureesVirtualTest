const DB_NAME = "turees-db";
const DB_VERSION = 9;
const STORES = {
  USER: "user",
  PAYMENTS: "offline-payments",
};

let lastSyncTime = 0;
let syncInProgress = false;

function upgradeDB(db) {
  const stores = db.objectStoreNames;

  if (!stores.contains(STORES.USER)) {
    db.createObjectStore(STORES.USER);
  }

  if (!stores.contains(STORES.PAYMENTS)) {
    db.createObjectStore(STORES.PAYMENTS, {
      keyPath: "id",
      autoIncrement: true,
    });
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      upgradeDB(db);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      db.onversionchange = () => {
        db.close();
      };

      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };

    request.onblocked = () => {};
  });
}

const API_CACHE_NAME = "api-cache-v1";
const PAGE_CACHE_NAME = "page-cache-v1";
const STATIC_CACHE_NAME = "static-cache-v1";
const CACHE_WHITELIST = [API_CACHE_NAME, PAGE_CACHE_NAME, STATIC_CACHE_NAME];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const db = await openIndexedDB();
        db.close();
      } catch (error) {
        console.error("IndexedDB setup failed:", error);
      }

      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !CACHE_WHITELIST.includes(key))
          .map((key) => caches.delete(key))
      );

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !CACHE_WHITELIST.includes(key))
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

function serializeHeaders(headers) {
  const headerObj = {};
  for (const [key, value] of headers.entries()) {
    headerObj[key] = value;
  }
  return headerObj;
}

function deserializeHeaders(headerObj) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(headerObj)) {
    headers.set(key, value);
  }
  return headers;
}

async function networkWithTimeout(request, timeoutMs = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Network timeout")), timeoutMs)
    ),
  ]);
}

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.startsWith("/api/")) {
    let responsePromise;

    if (event.request.method === "POST") {
      responsePromise = (async () => {
        try {
          const response = await networkWithTimeout(event.request.clone());
          return response;
        } catch (err) {
          const reqClone = event.request.clone();
          let body;
          let contentType = event.request.headers.get("content-type") || "";

          try {
            if (contentType.includes("application/json")) {
              body = await reqClone.json();
            } else {
              body = await reqClone.text();
            }
          } catch (bodyErr) {
            body = null;
          }

          try {
            const db = await openIndexedDB();

            if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
              db.close();
              throw new Error("PAYMENTS сан байхгүй байна");
            }

            const tx = db.transaction(STORES.PAYMENTS, "readwrite");
            const store = tx.objectStore(STORES.PAYMENTS);

            const paymentData = {
              url: event.request.url,
              body,
              method: event.request.method,
              headers: serializeHeaders(event.request.headers),
              contentType,
              synced: false,
              createdAt: new Date().toISOString(),
              retryCount: 0,
              lastError: err.message,
            };

            await new Promise((resolve, reject) => {
              const addRequest = store.add(paymentData);

              addRequest.onsuccess = () => {
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => {
                    client.postMessage({
                      type: "PAYMENT_SAVED_OFFLINE",
                      payment: { ...paymentData, id: addRequest.result },
                      timestamp: new Date().toISOString(),
                    });
                  });
                });

                resolve();
              };

              addRequest.onerror = () => reject(addRequest.error);
            });

            db.close();
          } catch (dbError) {}

          return new Response(
            JSON.stringify({
              offline: true,
              message: "Хүсэлт арын синкэд хадгалагдлаа",
              timestamp: new Date().toISOString(),
              success: true,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
      })();
    } else {
      responsePromise = networkWithTimeout(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches
              .open(API_CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response("Интернет салсан байна", { status: 503 });
        });
    }

    event.respondWith(responsePromise);
    return;
  }

  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  if (isStaticAssetRequest(requestUrl, event.request)) {
    event.respondWith(cacheFirstStatic(event.request));
    return;
  }

  event.respondWith(networkFirstGeneric(event.request));
});

function isStaticAssetRequest(requestUrl, request) {
  const staticDestinations = ["style", "script", "worker", "font", "image"];
  const isNextStatic = requestUrl.pathname.startsWith("/_next/static/");
  const isOptimizedImage = requestUrl.pathname.startsWith("/_next/image");
  const isAppStatic = requestUrl.pathname.startsWith("/static/");

  return (
    isNextStatic ||
    isOptimizedImage ||
    isAppStatic ||
    staticDestinations.includes(request.destination)
  );
}

async function cacheFirstStatic(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return (
      cachedResponse ||
      new Response("Интернет салсан байна", { status: 503 })
    );
  }
}

async function networkFirstGeneric(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Интернет салсан байна", { status: 503 });
  }
}

async function handleNavigationRequest(request) {
  const cache = await caches.open(PAGE_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const cachedRoot = await caches.match("/");
    if (cachedRoot) {
      return cachedRoot;
    }

    return new Response("Интернет салсан байна", { status: 503 });
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-payments") {
    event.waitUntil(syncPaymentsFromSW());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "TRIGGER_SYNC") {
    const now = Date.now();
    if (now - lastSyncTime < 5000) {
      return;
    }
    syncPaymentsFromSW();
  } else if (event.data?.type === "GET_PENDING_PAYMENTS") {
    getPendingPayments()
      .then((payments) => {
        event.ports[0].postMessage({ payments });
      })
      .catch((error) => {
        event.ports[0].postMessage({ payments: [], error: error.message });
      });
  }
});

async function getPendingPayments() {
  try {
    const db = await openIndexedDB();

    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      db.close();
      return [];
    }

    const tx = db.transaction(STORES.PAYMENTS, "readonly");
    const store = tx.objectStore(STORES.PAYMENTS);

    const allPayments = await new Promise((resolve, reject) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });

    db.close();

    return allPayments;
  } catch (error) {
    return [];
  }
}

async function syncPaymentsFromSW() {
  const now = Date.now();

  if (syncInProgress) {
    return;
  }

  if (now - lastSyncTime < 10000) {
    return;
  }

  syncInProgress = true;
  lastSyncTime = now;

  try {
    const db = await openIndexedDB();

    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      db.close();
      return;
    }

    const tx = db.transaction(STORES.PAYMENTS, "readwrite");
    const store = tx.objectStore(STORES.PAYMENTS);

    const allPayments = await new Promise((resolve, reject) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });

    let successCount = 0;
    let failureCount = 0;

    for (const payment of allPayments) {
      try {
        if (payment.retryCount >= 5) {
          failureCount++;
          continue;
        }

        const headers = deserializeHeaders(payment.headers);
        if (payment.body && payment.contentType) {
          headers.set("content-type", payment.contentType);
        }

        let requestBody;
        if (payment.body) {
          requestBody = payment.contentType?.includes("application/json")
            ? JSON.stringify(payment.body)
            : payment.body;
        }

        const response = await fetch(payment.url, {
          method: payment.method,
          headers,
          body: requestBody,
        });

        if (response.ok) {
          successCount++;

          const deleteTx = db.transaction(STORES.PAYMENTS, "readwrite");
          await new Promise((resolve, reject) => {
            const deleteRequest = deleteTx
              .objectStore(STORES.PAYMENTS)
              .delete(payment.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        } else {
          failureCount++;

          const updateTx = db.transaction(STORES.PAYMENTS, "readwrite");
          const updateStore = updateTx.objectStore(STORES.PAYMENTS);
          payment.retryCount = (payment.retryCount || 0) + 1;
          payment.lastError = `HTTP ${response.status}`;
          payment.lastRetry = new Date().toISOString();

          await new Promise((resolve, reject) => {
            const putRequest = updateStore.put(payment);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          });
        }
      } catch (err) {
        failureCount++;

        try {
          const updateTx = db.transaction(STORES.PAYMENTS, "readwrite");
          const updateStore = updateTx.objectStore(STORES.PAYMENTS);
          payment.retryCount = (payment.retryCount || 0) + 1;
          payment.lastError = err.message;
          payment.lastRetry = new Date().toISOString();

          await new Promise((resolve, reject) => {
            const putRequest = updateStore.put(payment);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          });
        } catch (updateErr) {}
      }
    }

    db.close();

    if (allPayments.length > 0) {
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: "SYNC_COMPLETED",
          tag: "sync-payments",
          timestamp: new Date().toISOString(),
          results: {
            total: allPayments.length,
            successful: successCount,
            failed: failureCount,
          },
        });
      });
    }
  } catch (error) {
  } finally {
    syncInProgress = false;
  }
}
