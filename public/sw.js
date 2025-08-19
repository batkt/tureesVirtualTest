const DB_NAME = 'turees-db';
const DB_VERSION = 9;
const STORES = {
  USER: 'user',
  PAYMENTS: 'offline-payments',
};

let lastSyncTime = 0;
let syncInProgress = false;

function upgradeDB(db) {
  const stores = db.objectStoreNames;

  if (!stores.contains(STORES.USER)) {
    console.log('Хэрэглэгчийн сан үүсгэж байна');
    db.createObjectStore(STORES.USER);
  }

  if (!stores.contains(STORES.PAYMENTS)) {
    console.log('Төлбөрийн сан үүсгэж байна');
    db.createObjectStore(STORES.PAYMENTS, { keyPath: 'id', autoIncrement: true });
  }

  console.log('Шинэчлэлт дууссаны дараах сангууд:', Array.from(db.objectStoreNames));
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log(`ӨС-г ${event.oldVersion}-ээс ${event.newVersion} рүү шинэчилж байна`);
      upgradeDB(db);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      db.onversionchange = () => {
        console.warn('ӨС-ийн хувилбар солигдлоо, хуучин холболтыг хаагаад байна');
        db.close();
      };
      console.log('ӨС амжилттай нээгдлээ:', { version: db.version, stores: Array.from(db.objectStoreNames) });
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('ӨС нээхэд алдаа гарлаа:', event.target.error);
      reject(event.target.error);
    };

    request.onblocked = () => {
      console.warn('ӨС-ийн шинэчлэлт хориглогдсон. Энэ ӨС-ийг ашиглаж буй бусад таб эсвэл цонхыг хаана уу.');
    };
  });
}

const API_CACHE_NAME = 'api-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker суулгагдаж байна');
  event.waitUntil(
    Promise.all([
      openIndexedDB().then((db) => {
        console.log('Өгөгдлийн сан суулгалтын үед эхлүүлэгдлээ');
        db.close();
      }).catch((error) => {
        console.error('Суулгалтын үед өгөгдлийн сан эхлүүлэхэд алдаа гарлаа:', error);
      })
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker идэвхжиж байна');
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== API_CACHE_NAME)
            .map((key) => {
              console.log('Хуучин кэш устгаж байна:', key);
              return caches.delete(key);
            })
        )
      ),
      openIndexedDB().then((db) => {
        console.log('Идэвхжүүлэх үеийн өгөгдлийн сан баталгаажлаа');
        console.log('Боломжтой сангууд:', Array.from(db.objectStoreNames));
        db.close();
      }).catch((error) => {
        console.error('Идэвхжүүлэх үеийн өгөгдлийн сан баталгаажуулахад алдаа гарлаа:', error);
      })
    ])
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

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  let responsePromise;
  
  if (requestUrl.pathname.startsWith('/api/')) {
    if (event.request.method === 'POST') {
      responsePromise = (async () => {
        try {
          const response = await fetch(event.request.clone());
          console.log('POST хүсэлт амжилттай боллоо:', requestUrl.pathname);
          return response;
        } catch (err) {
          console.log('POST хүсэлт амжилтгүй, синкэд хадгалж байна:', requestUrl.pathname, err.message);
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
            console.warn('Хүсэлтийн өгөгдлийг задлахад алдаа гарлаа:', bodyErr);
            body = null;
          }
          
          try {
            const db = await openIndexedDB();
            
            if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
              console.error('PAYMENTS сан олдсонгүй! Боломжтой сангууд:', Array.from(db.objectStoreNames));
              db.close();
              throw new Error('PAYMENTS сан байхгүй байна');
            }
            
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
                console.log('Оффлайн төлбөр амжилттай хадгалагдлаа');
                
                self.clients.matchAll().then(clients => {
                  clients.forEach(client => {
                    client.postMessage({ 
                      type: 'PAYMENT_SAVED_OFFLINE',
                      payment: { ...paymentData, id: addRequest.result },
                      timestamp: new Date().toISOString(),
                    });
                  });
                });
                
                resolve();
              };
              
              addRequest.onerror = () => {
                console.error('Оффлайн төлбөр хадгалахад алдаа гарлаа:', addRequest.error);
                reject(addRequest.error);
              };
            });
            
            db.close();
          } catch (dbError) {
            console.error('Оффлайн төлбөр хадгалахад өгөгдлийн сангийн алдаа гарлаа:', dbError);
          }
          
          return new Response(
            JSON.stringify({ 
              offline: true, 
              message: 'Хүсэлт арын синкэд хадгалагдлаа',
              timestamp: new Date().toISOString(),
              success: true
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })();
    } else {
      responsePromise = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async (err) => {
          console.error('GET хүсэлт амжилтгүй боллоо:', err.message, 'URL:', event.request.url);
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            console.log('Кэшээс үйлчилж байна:', event.request.url);
            return cachedResponse;
          }
          return new Response('Оффлайн байна', { status: 503 });
        });
    }
  } else {
    responsePromise = caches.match(event.request).then((response) => {
      if (response) {
        console.log('Кэшээс үйлчилж байна:', event.request.url);
        return response;
      }
      return fetch(event.request).catch(() => {
        console.log('Оффлайн хуудас руу шилжиж байна:', event.request.url);
        return new Response('Оффлайн байна', { status: 503 });
      });
    });
  }
  
  event.respondWith(responsePromise);
});

self.addEventListener('sync', (event) => {
  console.log('Арын синк асаалт авлаа:', event.tag);
  if (event.tag === 'sync-payments') {
    event.waitUntil(syncPaymentsFromSW());
  }
});

self.addEventListener('message', (event) => {
  console.log('Service worker мессеж хүлээн авлаа:', event.data);
  if (event.data?.type === 'TRIGGER_SYNC') {
    const now = Date.now();
    if (now - lastSyncTime < 5000) { // 5 секундын хүлээлэг
      console.log('Синк хүсэлт үл хэрэгслэгдлээ - дэндүү удалгүй синк хийсэн байна');
      return;
    }
    syncPaymentsFromSW();
  } else if (event.data?.type === 'GET_PENDING_PAYMENTS') {
    getPendingPayments().then(payments => {
      event.ports[0].postMessage({ payments });
    }).catch(error => {
      console.error('GET_PENDING_PAYMENTS мессежийн зохицуулагчид алдаа гарлаа:', error);
      event.ports[0].postMessage({ payments: [], error: error.message });
    });
  }
});

async function getPendingPayments() {
  try {
    const db = await openIndexedDB();
    
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      console.warn('PAYMENTS сан байхгүй байна, хоосон жагсаалт буцааж байна');
      db.close();
      return [];
    }
    
    const tx = db.transaction(STORES.PAYMENTS, 'readonly');
    const store = tx.objectStore(STORES.PAYMENTS);
    
    const allPayments = await new Promise((resolve, reject) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });
    
    db.close();
    console.log('Хүлээгдэж буй төлбөрүүд авлаа:', allPayments.length);
    return allPayments;
  } catch (error) {
    console.error('Хүлээгдэж буй төлбөрүүд авахад алдаа гарлаа:', error);
    return [];
  }
}

async function syncPaymentsFromSW() {
  const now = Date.now();
  
  if (syncInProgress) {
    console.log('Синк хийгдэж байгаа тул алгасаж байна...');
    return;
  }
  
  if (now - lastSyncTime < 10000) { 
    console.log('Синк хүсэлт үл хэрэгслэгдлээ - дэндүү удалгүй синк хийсэн байна');
    return;
  }
  
  syncInProgress = true;
  lastSyncTime = now;
  
  console.log('Төлбөрийн синк эхлэж байна...');
  try {
    const db = await openIndexedDB();
    
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      console.warn('PAYMENTS сан байхгүй байна, синк хийх боломжгүй');
      db.close();
      return;
    }
    
    const tx = db.transaction(STORES.PAYMENTS, 'readwrite');
    const store = tx.objectStore(STORES.PAYMENTS);
    
    const allPayments = await new Promise((resolve, reject) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });
    
    console.log(`${allPayments.length} төлбөр синк хийхэд бэлэн байна`);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const payment of allPayments) {
      try {
        console.log('Төлбөр синк хийж байна:', payment.id, 'Давтан оролдсон:', payment.retryCount || 0);
        
        if (payment.retryCount >= 5) {
          console.warn('Төлбөр давтан оролдох хязгаар давсан байна:', payment.id);
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
          console.log('Төлбөр амжилттай синк хийгдлээ:', payment.id); 
          successCount++;
          
          const deleteTx = db.transaction(STORES.PAYMENTS, 'readwrite');
          await new Promise((resolve, reject) => {
            const deleteRequest = deleteTx.objectStore(STORES.PAYMENTS).delete(payment.id);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          });
        } else {
          console.error('Сервер синк хүсэлтийг татгалзлаа:', response.status, payment.id);      
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
        console.error('Төлбөрийн синк амжилтгүй боллоо:', payment.id, err.message);
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
          console.error('Давтан оролдсон тоо шинэчлэхэд алдаа гарлаа:', updateErr);
        }
      }
    }
    
    db.close();
    console.log(`Төлбөрийн синк дууслаа: ${successCount} амжилттай, ${failureCount} амжилтгүй`);
    
    // Клиентэд мэдэгдэл илгээх - ШИНЭЧЛЭХГҮЙ
    if (allPayments.length > 0) {
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
    }
    
  } catch (error) {
    console.error('Төлбөрийн синк хийхэд алдаа гарлаа:', error);
  } finally {
    syncInProgress = false;
  }
}
