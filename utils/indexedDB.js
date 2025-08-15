import { openDB as idbOpen } from 'idb';

const DB_NAME = 'turees-db';
const DB_VERSION = 8;

export const STORES = {
  USER: 'user',
  PAYMENTS: 'offline-payments',
};

export async function openDB() {
  try {
    const db = await idbOpen(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`DB upgrade from ${oldVersion} to ${newVersion}`);
        
        // Create USER store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.USER)) {
          console.log('Creating USER store');
          db.createObjectStore(STORES.USER);
        }
        
        // Create PAYMENTS store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
          console.log('Creating PAYMENTS store');
          db.createObjectStore(STORES.PAYMENTS, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
      blocked() {
        console.warn('Database upgrade blocked by another connection');
      },
      blocking() {
        console.warn('This connection is blocking a database upgrade');
      },
    });
    
    console.log('Database opened successfully', {
      name: db.name,
      version: db.version,
      stores: [...db.objectStoreNames]
    });
    
    return db;
  } catch (error) {
    console.error('Failed to open database:', error);
    throw error;
  }
}

// Debug function to check database state
export async function debugDatabase() {
  try {
    const db = await openDB();
    console.log('=== DATABASE DEBUG INFO ===');
    console.log('Database name:', db.name);
    console.log('Database version:', db.version);
    console.log('Object stores:', [...db.objectStoreNames]);
    
    // Check if stores exist
    console.log('USER store exists:', db.objectStoreNames.contains(STORES.USER));
    console.log('PAYMENTS store exists:', db.objectStoreNames.contains(STORES.PAYMENTS));
    
    // Try to access each store
    try {
      const tx = db.transaction([STORES.USER], 'readonly');
      console.log('USER store accessible: true');
    } catch (e) {
      console.error('USER store not accessible:', e.message);
    }
    
    try {
      const tx = db.transaction([STORES.PAYMENTS], 'readonly');
      console.log('PAYMENTS store accessible: true');
    } catch (e) {
      console.error('PAYMENTS store not accessible:', e.message);
    }
    
    db.close();
  } catch (error) {
    console.error('Database debug failed:', error);
  }
}

// Enhanced save user function with error handling
export async function saveUser(token, info) {
  try {
    const db = await openDB();
    await db.put(STORES.USER, token ?? '', 'token');
    await db.put(STORES.USER, info ?? {}, 'info');
    console.log('User saved successfully');
  } catch (error) {
    console.error('Failed to save user:', error);
    throw error;
  }
}

export async function getUser() {
  try {
    const db = await openDB();
    const token = await db.get(STORES.USER, 'token');
    const info = await db.get(STORES.USER, 'info');
    return { token, info };
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
}

export async function clearUser() {
  try {
    const db = await openDB();
    await db.delete(STORES.USER, 'token');
    await db.delete(STORES.USER, 'info');
    console.log('User cleared successfully');
  } catch (error) {
    console.error('Failed to clear user:', error);
    throw error;
  }
}

export async function getAuthData() {
  try {
    const { info } = await getUser();
    if (!info) return null;

    return {
      username: info.username ?? null,
      password: info.password ?? null,
      timestamp: info.timestamp ?? null,
      remember: info.remember ?? false,
    };
  } catch (error) {
    console.error('Failed to get auth data:', error);
    return null;
  }
}

export async function getUserData() {
  try {
    const { token, info } = await getUser();
    if (!info) return null;

    return {
      userData: info,
      token,
    };
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
}

// Enhanced offline payment functions with better error handling
export async function saveOfflinePayment({ token = null, data = {} } = {}) {
  try {
    const db = await openDB();
    const createdAt = new Date().toISOString();
    const result = await db.add(STORES.PAYMENTS, {
      token,
      data,
      createdAt,
      synced: false,
    });
    console.log('Offline payment saved with ID:', result);
    return result;
  } catch (error) {
    console.error('Failed to save offline payment:', error);
    
    // Check if the store exists
    const db = await openDB();
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      console.error('PAYMENTS store does not exist!');
      throw new Error('PAYMENTS object store not found');
    }
    
    throw error;
  }
}

export async function getOfflinePayments() {
  try {
    const db = await openDB();
    
    // Check if store exists before trying to access it
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      console.warn('PAYMENTS store does not exist, returning empty array');
      return [];
    }
    
    const payments = await db.getAll(STORES.PAYMENTS);
    console.log('Retrieved offline payments:', payments.length);
    return payments;
  } catch (error) {
    console.error('Failed to get offline payments:', error);
    return [];
  }
}

export async function deleteOfflinePayment(id) {
  try {
    const db = await openDB();
    const result = await db.delete(STORES.PAYMENTS, id);
    console.log('Deleted offline payment:', id);
    return result;
  } catch (error) {
    console.error('Failed to delete offline payment:', error);
    throw error;
  }
}

// Utility function to force database recreation (use with caution)
export async function recreateDatabase() {
  try {
    // Close any existing connections
    const db = await idbOpen(DB_NAME, DB_VERSION);
    db.close();
    
    // Delete the database
    await new Promise((resolve, reject) => {
      const deleteReq = indexedDB.deleteDatabase(DB_NAME);
      deleteReq.onsuccess = () => {
        console.log('Database deleted successfully');
        resolve();
      };
      deleteReq.onerror = () => {
        console.error('Failed to delete database');
        reject(deleteReq.error);
      };
      deleteReq.onblocked = () => {
        console.warn('Database deletion blocked');
        reject(new Error('Database deletion blocked'));
      };
    });
    
    // Recreate the database
    const newDb = await openDB();
    console.log('Database recreated successfully');
    newDb.close();
    
    return true;
  } catch (error) {
    console.error('Failed to recreate database:', error);
    return false;
  }
}