import { openDB as idbOpen } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 9;

const STORES = {
  USER: "user",
  PAYMENTS: "offline-payments",
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

export { STORES };
