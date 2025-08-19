import { openDB as idbOpen } from 'idb';

const DB_NAME = 'turees-db';
const DB_VERSION = 9;

const STORES = {
  USER: 'user',
  PAYMENTS: 'offline-payments',
};
export async function openDB() {
  return idbOpen(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORES.USER)) {
        db.createObjectStore(STORES.USER);
      }
      if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
        db.createObjectStore(STORES.PAYMENTS, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveUser(token, info) {
  const db = await openDB();
  await db.put(STORES.USER, token, 'token');
  await db.put(STORES.USER, info, 'info');
}


export async function getUser() {
  const db = await openDB();
  const token = await db.get(STORES.USER, 'token');
  const info = await db.get(STORES.USER, 'info');
  return { token, info };
}

export async function clearUser() {
  const db = await openDB();
  await db.delete(STORES.USER, 'token');
  await db.delete(STORES.USER, 'info');
}


export async function saveOfflinePayment({ token = null, data = {}, synced = false } = {}) {
  const db = await openDB();
  const createdAt = new Date().toISOString();
  return db.add(STORES.PAYMENTS, { token, data, createdAt, synced });
}

export async function getOfflinePayments() {
  const db = await openDB();
  return db.getAll(STORES.PAYMENTS);
}

export async function deleteOfflinePayment(id) {
  const db = await openDB();
  return db.delete(STORES.PAYMENTS, id);
}
