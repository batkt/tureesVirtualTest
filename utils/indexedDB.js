import { openDB as idbOpen } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 11;

const STORES = {
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

export async function saveUser(token, info) {
  try {
    const db = await openDB();
    await db.put(STORES.USER, token, "token");
    await db.put(STORES.USER, info, "info");
  } catch (error) {
    throw error;
  }
}

export async function getUser() {
  try {
    const db = await openDB();
    const token = await db.get(STORES.USER, "token");
    const info = await db.get(STORES.USER, "info");
    return { token, info };
  } catch (error) {
    return { token: null, info: null };
  }
}

export async function clearUser() {
  try {
    const db = await openDB();
    await db.delete(STORES.USER, "token");
    await db.delete(STORES.USER, "info");
  } catch (error) {
    throw error;
  }
}

export async function saveOfflinePayment({
  token = null,
  data = {},
  synced = false,
} = {}) {
  try {
    const db = await openDB();
    const createdAt = new Date().toISOString();
    const result = await db.add(STORES.PAYMENTS, {
      token,
      data,
      createdAt,
      synced,
      retryCount: 0,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getOfflinePayments() {
  try {
    const db = await openDB();
    const payments = await db.getAll(STORES.PAYMENTS);

    return payments;
  } catch (error) {
    return [];
  }
}

export async function deleteOfflinePayment(id) {
  try {
    const db = await openDB();
    const result = await db.delete(STORES.PAYMENTS, id);

    return result;
  } catch (error) {
    throw error;
  }
}

// Generic cache helpers for list/data caching
export async function setCache(key, value) {
  try {
    const db = await openDB();
    const wrapped = { value, savedAt: new Date().toISOString() };
    await db.put(STORES.CACHE, wrapped, key);
  } catch (error) {
    throw error;
  }
}

export async function getCache(key) {
  try {
    const db = await openDB();
    const wrapped = await db.get(STORES.CACHE, key);
    return wrapped ? wrapped.value : null;
  } catch (error) {
    return null;
  }
}

export async function deleteCache(key) {
  try {
    const db = await openDB();
    await db.delete(STORES.CACHE, key);
  } catch (error) {
    throw error;
  }
}

// Search cache by URL prefix - useful when baiguullagiinId is not known on offline refresh
export async function searchCacheByPrefix(prefix) {
  try {
    if (typeof window === "undefined") return null;

    const db = await openDB();
    const allKeys = await db.getAllKeys(STORES.CACHE);
    const matchingKeys = allKeys.filter(
      (key) => typeof key === "string" && key.startsWith(prefix)
    );

    if (matchingKeys.length === 0) return null;

    // Find the most recent cache entry
    let bestValue = null;
    let bestDate = null;

    for (const key of matchingKeys) {
      const wrapped = await db.get(STORES.CACHE, key);
      if (wrapped?.value) {
        const savedAt = wrapped.savedAt ? new Date(wrapped.savedAt) : null;
        if (!bestDate || (savedAt && savedAt > bestDate)) {
          bestDate = savedAt;
          bestValue = wrapped.value;
        }
      }
    }

    return bestValue;
  } catch (error) {
    console.error("[searchCacheByPrefix] Error:", error);
    return null;
  }
}

export { STORES };
