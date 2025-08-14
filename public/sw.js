const DB_NAME = 'turees-db';
const DB_VERSION = 7;
const STORES = {
  USER: 'user',
  PAYMENTS: 'offline-payments',
};
function upgradeDB(db, oldVersion, newVersion) {
  console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
  
  if (!db.objectStoreNames.contains(STORES.USER)) {
    console.log('Creating USER store');
    db.createObjectStore(STORES.USER);
  }
  
  if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
    console.log('Creating PAYMENTS store');
    db.createObjectStore(STORES.PAYMENTS, { keyPath: 'id', autoIncrement: true });
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    console.log(`Opening IndexedDB: ${DB_NAME} version ${DB_VERSION}`);
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      console.log('DB upgrade needed');
      upgradeDB(event.target.result, event.oldVersion, event.newVersion);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log('DB opened successfully', { 
        stores: Array.from(db.objectStoreNames),
        version: db.version 
      });
      
      const hasUser = db.objectStoreNames.contains(STORES.USER);
      const hasPayments = db.objectStoreNames.contains(STORES.PAYMENTS);
      
      if (!hasUser || !hasPayments) {
        console.warn('Missing stores detected', { hasUser, hasPayments });
        db.close();
        
        const newVersion = db.version + 1;
        console.log(`Forcing upgrade to version ${newVersion}`);
        
        const fixRequest = indexedDB.open(DB_NAME, newVersion);
        fixRequest.onupgradeneeded = (e) => {
          upgradeDB(e.target.result, e.oldVersion, e.newVersion);
        };
        fixRequest.onsuccess = (e) => {
          console.log('DB fixed and opened successfully');
          resolve(e.target.result);
        };
        fixRequest.onerror = (e) => {
          console.error('Failed to fix DB:', e.target.error);
          reject(e.target.error);
        };
      } else {
        resolve(db);
      }
    };
    request.onerror = (event) => {
      console.error('Failed to open DB:', event.target.error);
      reject(event.target.error);
    };    
    request.onblocked = () => {
      console.warn('DB open blocked - another connection is preventing upgrade');
    };
  });
}
const CACHE_NAME = 'offline-login-v1';
const API_CACHE_NAME = 'api-cache-v1';
const AUTH_CACHE_NAME = 'auth-cache-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/snowflake.png',
  '/snowflake1.png',
  '/copyPasteLogo.png',
  '/illustration.svg',
  '/MN.png',
  '/UK.png',
];
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching offline assets');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME && key !== AUTH_CACHE_NAME)
            .map((key) => {
              console.log('Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      ),
      openIndexedDB().then((db) => {
        console.log('Database initialized in service worker');
        db.close();
      }).catch((error) => {
        console.error('Failed to initialize database in service worker:', error);
      })
    ])
  );
  self.clients.claim();
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
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  let responsePromise;
  
  if (requestUrl.pathname.startsWith('/api/')) {
    if (event.request.method === 'POST') {
      responsePromise = (async () => {
        try {
          const response = await fetch(event.request.clone());
          console.log('POST request successful:', requestUrl.pathname);
          return response;
        } catch (err) {
          console.log('POST request failed, saving for sync:', requestUrl.pathname, err.message);
          const reqClone = event.request.clone();
          let body;
          let contentType = event.request.headers.get('content-type') || '';
          
          try {
            if (contentType.includes('application/json')) {
              body = await reqClone.json();
            } else {
              body = await reqClone.text();
            }
          } catch (bodyErr) {
            console.warn('Failed to parse request body:', bodyErr);
            body = null;
          }
          
          try {
            const db = await openIndexedDB();
            const tx = db.transaction(STORES.PAYMENTS, 'readwrite');
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
              lastError: err.message
            };
            
            await new Promise((resolve, reject) => {
              const addRequest = store.add(paymentData);
              
              addRequest.onsuccess = () => {
                console.log('Offline payment saved successfully');
                
                // Notify all clients about the saved payment
                self.clients.matchAll().then(clients => {
                  clients.forEach(client => {
                    client.postMessage({ 
                      type: 'PAYMENT_SAVED_OFFLINE',
                      payment: { ...paymentData, id: addRequest.result },
                      timestamp: new Date().toISOString(),
                      reloadPage: true
                    });
                  });
                });
                
                resolve();
              };
              
              addRequest.onerror = () => {
                console.error('Failed to save offline payment:', addRequest.error);
                reject(addRequest.error);
              };
            });
            
            db.close();
          } catch (dbError) {
            console.error('Database error when saving offline payment:', dbError);
          }
          
          return new Response(
            JSON.stringify({ 
              offline: true, 
              message: 'Request saved for background sync',
              timestamp: new Date().toISOString(),
              success: true // Add this flag for UI to recognize success
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })();
    } else {
      // GET requests handling remains the same
      responsePromise = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async (err) => {
          console.error('GET request failed:', err.message, 'URL:', event.request.url);
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            console.log('Serving from cache:', event.request.url);
            return cachedResponse;
          }
          return caches.match('/offline.html') || new Response('Offline', { status: 503 });
        });
    }
  } else {
    // Static assets handling remains the same
    responsePromise = caches.match(event.request).then((response) => {
      if (response) {
        console.log('Serving from cache:', event.request.url);
        return response;
      }
      return fetch(event.request).catch(() => {
        console.log('Falling back to offline page for:', event.request.url);
        return caches.match('/offline.html');
      });
    });
  }
  
  event.respondWith(responsePromise);
});
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  if (event.tag === 'sync-payments') {
    event.waitUntil(syncPaymentsFromSW());
  }
});
self.clients.matchAll().then(clients => {
  clients.forEach(client => {
    client.postMessage({ type: 'CACHE_UPDATED' });
  });
});
self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  if (event.data?.type === 'TRIGGER_SYNC') {
    syncPaymentsFromSW();
  } else if (event.data?.type === 'GET_PENDING_PAYMENTS') {
    getPendingPayments().then(payments => {
      event.ports[0].postMessage({ payments });
    });
  }
});
async function getPendingPayments() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORES.PAYMENTS, 'readonly');
    const store = tx.objectStore(STORES.PAYMENTS);
    const allPayments = await new Promise((resolve, reject) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });
    db.close();
    return allPayments;
  } catch (error) {
    console.error('Error getting pending payments:', error);
    return [];
  }
}
async function syncPaymentsFromSW() {
  console.log('Starting payment sync...');
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORES.PAYMENTS, 'readwrite');
    const store = tx.objectStore(STORES.PAYMENTS);
    
    const allPayments = await new Promise((resolve, reject) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });
    
    console.log(`Found ${allPayments.length} payments to sync`);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const payment of allPayments) {
      try {
        console.log('Syncing payment:', payment.id, 'Retry count:', payment.retryCount || 0);
        
        if (payment.retryCount >= 5) {
          console.warn('Payment exceeded retry limit:', payment.id);
          failureCount++;
          continue;
        }
        
        const headers = deserializeHeaders(payment.headers);
        if (payment.body && payment.contentType) {
          headers.set('content-type', payment.contentType);
        }
        
        let requestBody;
        if (payment.body) {
          requestBody = payment.contentType?.includes('application/json') 
            ? JSON.stringify(payment.body)
            : payment.body;
        }
        
        const response = await fetch(payment.url, {
          method: payment.method,
          headers,
          body: requestBody,
        });
        
        if (response.ok) {
          console.log('Payment synced successfully:', payment.id); 
          successCount++;
          
          const deleteTx = db.transaction(STORES.PAYMENTS, 'readwrite');
          await new Promise((resolve, reject) => {
            const deleteRequest = deleteTx.objectStore(STORES.PAYMENTS).delete(payment.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        } else {
          console.error('Server rejected sync request:', response.status, payment.id);      
          failureCount++;
          
          const updateTx = db.transaction(STORES.PAYMENTS, 'readwrite');
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
        console.error('Sync failed for payment:', payment.id, err.message);
        failureCount++;
        
        try {
          const updateTx = db.transaction(STORES.PAYMENTS, 'readwrite');
          const updateStore = updateTx.objectStore(STORES.PAYMENTS);
          payment.retryCount = (payment.retryCount || 0) + 1;
          payment.lastError = err.message;
          payment.lastRetry = new Date().toISOString();
          
          await new Promise((resolve, reject) => {
            const putRequest = updateStore.put(payment);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          });
        } catch (updateErr) {
          console.error('Failed to update retry count:', updateErr);
        }
      }
    }
    
    db.close();
    console.log(`Payment sync completed: ${successCount} successful, ${failureCount} failed`);
    
    // Enhanced client notification with sync results
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ 
        type: 'SYNC_COMPLETED',
        tag: 'sync-payments',
        timestamp: new Date().toISOString(),
        results: {
          total: allPayments.length,
          successful: successCount,
          failed: failureCount
        }
      });
    });
    
  } catch (error) {
    console.error('Error during payment sync:', error);
  }
}