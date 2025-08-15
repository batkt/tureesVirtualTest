import { openDB, deleteDB } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 9; // Fixed version number
const STORE_USER = "user";
const STORE_PAYMENTS = "offline-payments"; // Add back payments store if needed

let dbInstance = null;

async function getDB() {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    throw new Error('IndexedDB is only available in the browser');
  }
  
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
        
        // Create USER store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_USER)) {
          console.log('Creating USER store');
          db.createObjectStore(STORE_USER);
        }
        
        // Create PAYMENTS store if it doesn't exist (optional - remove if not needed)
        if (!db.objectStoreNames.contains(STORE_PAYMENTS)) {
          console.log('Creating PAYMENTS store');
          db.createObjectStore(STORE_PAYMENTS, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
        }
        
        console.log('Available stores after upgrade:', [...db.objectStoreNames]);
      },
      blocked() {
        console.warn('Database upgrade blocked - close other tabs');
        // Notify user to close other tabs
        if (typeof window !== 'undefined') {
          alert('Please close other tabs using this application to continue');
        }
      },
      blocking() {
        console.warn('Database blocking another connection');
        // Close the current connection to allow upgrade
        if (dbInstance) {
          dbInstance.close();
          dbInstance = null;
        }
      },
    });

    console.log('Database opened successfully:', {
      name: dbInstance.name,
      version: dbInstance.version,
      stores: [...dbInstance.objectStoreNames]
    });

    return dbInstance;
  } catch (error) {
    console.error('Database opening failed:', error);
    
    if (error.name === 'VersionError' || error.name === 'InvalidStateError') {
      console.log('Version error detected, attempting database reset...');
      await resetDatabase();
      
      // Retry with a clean database
      dbInstance = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          console.log('Creating stores in fresh database');
          if (!db.objectStoreNames.contains(STORE_USER)) {
            db.createObjectStore(STORE_USER);
          }
          if (!db.objectStoreNames.contains(STORE_PAYMENTS)) {
            db.createObjectStore(STORE_PAYMENTS, { 
              keyPath: 'id', 
              autoIncrement: true 
            });
          }
        },
      });
      return dbInstance;
    }
    throw error;
  }
}

export async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Close existing connection
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
    
    // Wait a bit for connections to close
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Delete the database
    await deleteDB(DB_NAME);
    console.log('Database reset successfully');
    return true;
  } catch (error) {
    console.error('Failed to reset database:', error);
    return false;
  }
}

// Debug function to check database state
export async function debugDatabase() {
  try {
    const db = await getDB();
    console.log('=== DATABASE DEBUG INFO ===');
    console.log('Database name:', db.name);
    console.log('Database version:', db.version);
    console.log('Object stores:', [...db.objectStoreNames]);
    console.log('USER store exists:', db.objectStoreNames.contains(STORE_USER));
    console.log('PAYMENTS store exists:', db.objectStoreNames.contains(STORE_PAYMENTS));
    return true;
  } catch (error) {
    console.error('Database debug failed:', error);
    return false;
  }
}

// Enhanced error wrapper for database operations
async function withErrorHandling(operation, retryCount = 0) {
  try {
    return await operation();
  } catch (error) {
    console.error(`Database operation failed (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < 2 && (
      error.name === 'VersionError' || 
      error.name === 'InvalidStateError' ||
      error.name === 'TransactionInactiveError'
    )) {
      console.log('Attempting database recovery...');
      
      // Reset database instance
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }
      
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, 100));
      return withErrorHandling(operation, retryCount + 1);
    }
    
    throw error;
  }
}

export async function storeLoginData(credentials, loginResult) {
  return withErrorHandling(async () => {
    const db = await getDB();
    
    // Verify store exists
    if (!db.objectStoreNames.contains(STORE_USER)) {
      throw new Error('USER store not found in database');
    }

    // Store token
    await db.put(STORE_USER, loginResult.token || '', "token");

    // Store user info
    const info = {
      ...loginResult.result,
      username: credentials.nevtrekhNer || "",
      password: credentials.nuutsUg || "",
      timestamp: new Date().toISOString(),
    };
    await db.put(STORE_USER, info, "info");

    // Store permissions if available
    if (loginResult.permissionsData) {
      await db.put(STORE_USER, loginResult.permissionsData, "permissionsData");
    }
    
    console.log('Login data stored successfully');
  });
}

// Get offline saved user info
export async function getCachedUserData() {
  return withErrorHandling(async () => {
    const db = await getDB();
    const info = await db.get(STORE_USER, "info");
    return info || null;
  });
}

// Get offline saved token
export async function getCachedToken() {
  return withErrorHandling(async () => {
    const db = await getDB();
    return await db.get(STORE_USER, "token");
  });
}

// Get cached permissions data
export async function getCachedPermissionsData() {
  return withErrorHandling(async () => {
    const db = await getDB();
    return await db.get(STORE_USER, "permissionsData");
  });
}

// Check if offline auth data is valid (exists with username & password)
export async function hasValidOfflineAuth() {
  try {
    const data = await getCachedUserData();
    return !!(data && data.username && data.password);
  } catch (error) {
    console.warn('Error checking offline auth:', error);
    return false;
  }
}

export async function clearOfflineData() {
  return withErrorHandling(async () => {
    const db = await getDB();
    
    // Clear all user data
    const transaction = db.transaction([STORE_USER], 'readwrite');
    const store = transaction.objectStore(STORE_USER);
    
    await store.delete("token");
    await store.delete("info");
    await store.delete("permissionsData");
    
    await transaction.done;
    console.log('Offline data cleared successfully');
  });
}

export async function attemptOfflineLogin({ nevtrekhNer, nuutsUg }) {
  if (!nevtrekhNer || !nuutsUg) {
    throw new Error("Нэвтрэх нэр болон нууц үг шаардлагатай.");
  }

  const stored = await getCachedUserData();

  if (
    !stored ||
    stored.username.trim() !== nevtrekhNer.trim() ||
    stored.password.trim() !== nuutsUg.trim()
  ) {
    throw new Error("Offline credentials mismatch");
  }

  const token = await getCachedToken();
  if (!token) {
    throw new Error("Offline token not found");
  }

  const permissionsData = await getCachedPermissionsData();

  if (!permissionsData || !permissionsData.moduluud) {
    console.warn("Offline login: No permissions found, continuing with fallback mode");
  }

  return {
    success: true,
    data: {
      token,
      result: stored,
      permissionsData: permissionsData || { moduluud: [], offlineFallback: true },
      offline: true,
    },
  };
}

// Utility to check if currently online (simple)
export function isOnline() {
  return typeof navigator !== "undefined" && navigator.onLine;
}

export async function attemptLogin(credentials, onlineLoginFunc) {
  try {
    // Try online login first
    const onlineResult = await onlineLoginFunc(credentials);
    return { success: true, mode: "online", data: onlineResult };
  } catch (onlineError) {
    console.log('Online login failed, checking offline availability...');
    
    try {
      const offlineAvailable = await hasValidOfflineAuth();
      if (offlineAvailable) {
        try {
          const offlineResult = await attemptOfflineLogin(credentials);
          return { success: true, mode: "offline", data: offlineResult.data };
        } catch (offlineError) {
          console.error('Offline login failed:', offlineError);
          return { 
            success: false, 
            error: `Online: ${onlineError.message}, Offline: ${offlineError.message}` 
          };
        }
      } else {
        console.log('No offline credentials available');
        return { success: false, error: onlineError.message };
      }
    } catch (offlineCheckError) {
      console.error('Error checking offline availability:', offlineCheckError);
      return { success: false, error: onlineError.message };
    }
  }
}

// Emergency cleanup function for development/debugging
export async function emergencyCleanup() {
  try {
    console.log('Starting emergency cleanup...');
    
    // Close database connection
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
    
    // Clear localStorage if available
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('turees') || key.includes('auth')) {
          localStorage.removeItem(key);
          console.log('Removed localStorage key:', key);
        }
      });
    }
    
    // Clear sessionStorage if available
    if (typeof sessionStorage !== 'undefined') {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.includes('turees') || key.includes('auth')) {
          sessionStorage.removeItem(key);
          console.log('Removed sessionStorage key:', key);
        }
      });
    }
    
    // Delete database
    await deleteDB(DB_NAME);
    
    console.log('Emergency cleanup completed successfully');
    return true;
  } catch (error) {
    console.error('Emergency cleanup failed:', error);
    return false;
  }
}

// Health check function
export async function healthCheck() {
  try {
    console.log('Running database health check...');
    
    // Test database connection
    const db = await getDB();
    console.log('✓ Database connection successful');
    
    // Test basic operations
    await db.put(STORE_USER, 'test', 'healthcheck');
    const result = await db.get(STORE_USER, 'healthcheck');
    await db.delete(STORE_USER, 'healthcheck');
    
    if (result === 'test') {
      console.log('✓ Database read/write operations successful');
      return { success: true, message: 'Database is healthy' };
    } else {
      throw new Error('Read/write test failed');
    }
  } catch (error) {
    console.error('✗ Database health check failed:', error);
    return { success: false, error: error.message };
  }
}