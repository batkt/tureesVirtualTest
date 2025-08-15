import { openDB as idbOpen } from 'idb';

const DB_NAME = 'OfflineAuthDB';
const DB_VERSION = 9; // Increment version to force upgrade

const STORES = {
  USER: 'user',
  PAYMENTS: 'offline-payments',
  AUTH: 'auth', // Add missing AUTH store
  CACHE: 'cache' // Add missing CACHE store
};

export async function openDB() {
  try {
    const db = await idbOpen(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
        
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
            autoIncrement: true 
          });
        }
        
        // Create AUTH store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.AUTH)) {
          console.log('Creating AUTH store');
          db.createObjectStore(STORES.AUTH);
        }
        
        // Create CACHE store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.CACHE)) {
          console.log('Creating CACHE store');
          db.createObjectStore(STORES.CACHE);
        }
        
        console.log('Available stores after upgrade:', [...db.objectStoreNames]);
      },
      blocked() {
        console.warn('Database upgrade blocked - close other tabs using this database');
      },
      blocking() {
        console.warn('This connection is blocking a database upgrade');
      },
    });
    
    console.log('Database opened successfully:', {
      name: db.name,
      version: db.version,
      stores: [...db.objectStoreNames]
    });
    
    return db;
  } catch (error) {
    console.error('Failed to open IndexedDB:', error);
    throw error;
  }
}

// Debug function to verify database state
export async function debugDatabase() {
  try {
    const db = await openDB();
    console.log('=== DATABASE DEBUG INFO ===');
    console.log('Database name:', db.name);
    console.log('Database version:', db.version);
    console.log('Object stores:', [...db.objectStoreNames]);
    
    // Check each store
    Object.entries(STORES).forEach(([key, storeName]) => {
      const exists = db.objectStoreNames.contains(storeName);
      console.log(`${key} store (${storeName}) exists:`, exists);
    });
    
    db.close();
  } catch (error) {
    console.error('Database debug failed:', error);
  }
}

// Force database recreation if needed
export async function recreateDatabase() {
  try {
    console.log('Deleting existing database...');
    
    // Delete the database
    await new Promise((resolve, reject) => {
      const deleteReq = indexedDB.deleteDatabase(DB_NAME);
      deleteReq.onsuccess = () => {
        console.log('Database deleted successfully');
        resolve();
      };
      deleteReq.onerror = () => {
        console.error('Failed to delete database:', deleteReq.error);
        reject(deleteReq.error);
      };
      deleteReq.onblocked = () => {
        console.warn('Database deletion blocked - close all tabs and try again');
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

// Save token and user info object to USER store
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

// Get token and user info from USER store
export async function getUser() {
  try {
    const db = await openDB();
    const token = await db.get(STORES.USER, 'token');
    const info = await db.get(STORES.USER, 'info');
    return { token, info };
  } catch (error) {
    console.error('Failed to get user:', error);
    return { token: null, info: null };
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

// Enhanced offline payment functions
export async function saveOfflinePayment({ token = null, data = {}, synced = false } = {}) {
  try {
    const db = await openDB();
    
    // Verify the PAYMENTS store exists
    if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
      console.error('PAYMENTS store does not exist!');
      throw new Error('PAYMENTS object store not found');
    }
    
    const paymentData = {
      token,
      data,
      createdAt: new Date().toISOString(),
      synced,
      retryCount: 0
    };
    
    const result = await db.add(STORES.PAYMENTS, paymentData);
    console.log('Offline payment saved with ID:', result);
    return result;
  } catch (error) {
    console.error('Failed to save offline payment:', error);
    throw error;
  }
}

export async function getOfflinePayments() {
  try {
    const db = await openDB();
    
    // Check if store exists before accessing
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

// Export STORES for use in other files
export { STORES };