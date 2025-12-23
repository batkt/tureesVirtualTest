const DB_NAME = "turees-db";
const DB_VERSION = 10;
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const db = await openIndexedDB();
        db.close();
      } catch (error) {
        console.error("IndexedDB setup failed:", error);
      }

      // Cache offline.html and other critical assets
      const pageCache = await caches.open(PAGE_CACHE_NAME);
      try {
        await pageCache.add("/offline.html");
      } catch (error) {
        console.error("Failed to cache offline.html:", error);
      }

      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== API_CACHE_NAME && key !== PAGE_CACHE_NAME)
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
          .filter((key) => key !== API_CACHE_NAME && key !== PAGE_CACHE_NAME)
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
  const isNavigationRequest =
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept")?.includes("text/html"));

 
  const authEndpoints = [
    "/ajiltanNevtrey",
    "/erkhiinMedeelelAvya",
    "/ajiltanGarya",
    "/token",
    "/login",
    "/logout",
    "/auth",
  ];
  const isAuthRequest = authEndpoints.some((endpoint) =>
    requestUrl.pathname.includes(endpoint)
  );
  
  if (isAuthRequest) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Never cache upload requests - always use network
  if (requestUrl.pathname.includes("/upload")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Handle API requests
  if (requestUrl.pathname.startsWith("/api/")) {
    if (event.request.method === "POST") {
      event.respondWith(
        (async () => {
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
        })()
      );
      return;
    } else {
      // GET API requests - Network first, then cache, then proper JSON error
      event.respondWith(
        (async () => {
          try {
            const response = await networkWithTimeout(event.request);
            if (response.ok) {
              const clone = response.clone();
              caches
                .open(API_CACHE_NAME)
                .then((cache) => cache.put(event.request, clone));
            }
            return response;
          } catch (err) {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return proper JSON error response for API requests
            return new Response(
              JSON.stringify({
                offline: true,
                error: "Интернет салсан байна",
                message: "Сүлжээнд холбогдох боломжгүй байна",
              }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        })()
      );
      return;
    }
  }

  // Handle navigation requests (HTML pages)
  if (isNavigationRequest) {
    event.respondWith(
      (async () => {
        // Try cache first
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try network
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            // Cache successful responses
            const clone = networkResponse.clone();
            caches
              .open(PAGE_CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        } catch (err) {
          // Network failed - serve offline.html as fallback
          const offlineResponse = await caches.match("/offline.html");
          if (offlineResponse) {
            return offlineResponse;
          }
          // If offline.html is not cached, return a basic offline message
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Оффлайн</title></head><body><h1>Интернет салсан байна</h1><p>Таны интернэт тасарсан байна. Интернетгүй орчинд ажиллаж байна.</p></body></html>',
            {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        }
      })()
    );
    return;
  }

  // Handle other requests (assets, images, etc.) - Cache first, then network
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          // Cache successful responses
          const clone = networkResponse.clone();
          caches
            .open(PAGE_CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      } catch (err) {
        // For non-navigation requests, return a proper error
        // Don't show offline.html for assets
        return new Response("", { status: 503 });
      }
    })()
  );
});

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
