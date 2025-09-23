import { openDB as idbOpen } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 10;

export const STORES = {
  USER: "user",
  PAYMENTS: "offline-payments",
  CACHE: "cache",
};

export async function openDB() {
  return idbOpen(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORES.USER)) {
        db.createObjectStore(STORES.USER);
      }
      if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
        db.createObjectStore(STORES.PAYMENTS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        db.createObjectStore(STORES.CACHE);
      }
    },
  });
}

// ---------------- User ----------------
export async function saveUsernameOnly(username) {
  const db = await openDB();
  await db.put(STORES.USER, username, "username");
}

export async function saveUser(token, info) {
  const db = await openDB();
  await db.put(STORES.USER, token, "token");
  await db.put(STORES.USER, info, "info");
}

export async function getUser() {
  try {
    const db = await openDB();
    const token = await db.get(STORES.USER, "token");
    const info = await db.get(STORES.USER, "info");
    return { token, info };
  } catch {
    return { token: null, info: null };
  }
}

export async function clearUser() {
  const db = await openDB();
  await db.delete(STORES.USER, "token");
  await db.delete(STORES.USER, "info");
}

export async function clearUserDataOnLogout() {
  const db = await openDB();
  const username = await db.get(STORES.USER, "username");

  const txUser = db.transaction(STORES.USER, "readwrite");
  await txUser.objectStore(STORES.USER).clear();
  if (username) await txUser.objectStore(STORES.USER).put(username, "username");
  await txUser.done;

  if (db.objectStoreNames.contains(STORES.PAYMENTS)) {
    const txPayments = db.transaction(STORES.PAYMENTS, "readwrite");
    await txPayments.objectStore(STORES.PAYMENTS).clear();
    await txPayments.done;
  }

  if (db.objectStoreNames.contains(STORES.CACHE)) {
    const txCache = db.transaction(STORES.CACHE, "readwrite");
    await txCache.objectStore(STORES.CACHE).clear();
    await txCache.done;
  }

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
  }
}

// ---------------- Offline Payments ----------------
export async function saveOfflinePayment({
  token = null,
  data = {},
  synced = false,
} = {}) {
  const db = await openDB();
  const createdAt = new Date().toISOString();
  return db.add(STORES.PAYMENTS, {
    token,
    data,
    createdAt,
    synced,
    retryCount: 0,
  });
}

export async function getOfflinePayments() {
  const db = await openDB();
  return db.getAll(STORES.PAYMENTS);
}

export async function deleteOfflinePayment(id) {
  const db = await openDB();
  return db.delete(STORES.PAYMENTS, id);
}

// ---------------- Clear All Cache ----------------
export async function clearAllCache() {
  await clearUser();

  const db = await openDB();
  if (db.objectStoreNames.contains(STORES.PAYMENTS)) {
    const tx = db.transaction(STORES.PAYMENTS, "readwrite");
    await tx.objectStore(STORES.PAYMENTS).clear();
    await tx.done;
  }

  if (db.objectStoreNames.contains(STORES.CACHE)) {
    const tx = db.transaction(STORES.CACHE, "readwrite");
    await tx.objectStore(STORES.CACHE).clear();
    await tx.done;
  }

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
  }
}
