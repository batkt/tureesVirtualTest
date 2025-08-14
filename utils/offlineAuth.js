import { openDB, deleteDB } from "idb";

const DB_NAME = "turees-db";
const STORE_USER = "user";

let dbInstance = null;

async function getDB() {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    throw new Error('IndexedDB is only available in the browser');
  }
  
  if (dbInstance) return dbInstance;

  try {
    let currentVersion = 7;

    try {
      const existingDBs = await indexedDB.databases?.();
      const existingDB = existingDBs?.find(db => db.name === DB_NAME);
      currentVersion = existingDB?.version || 7;
    } catch (e) {
      console.log('Could not check existing databases, using default version');
    }

    dbInstance = await openDB(DB_NAME, currentVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);
        if (!db.objectStoreNames.contains(STORE_USER)) {
          db.createObjectStore(STORE_USER);
        }
      },
      blocked() {
        console.warn('Database upgrade blocked');
      },
      blocking() {
        console.warn('Database blocking another connection');
      },
    });

    return dbInstance;
  } catch (error) {
    if (error.name === 'VersionError') {
      console.log('Version error detected, resetting database...');
      await resetDatabase();
      dbInstance = await openDB(DB_NAME, 2, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_USER)) {
            db.createObjectStore(STORE_USER);
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
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
    await deleteDB(DB_NAME);
    console.log('Database reset successfully');
    return true;
  } catch (error) {
    console.error('Failed to reset database:', error);
    return false;
  }
}

// Enhanced error wrapper for database operations
async function withErrorHandling(operation) {
  try {
    return await operation();
  } catch (error) {
    if (error.name === 'VersionError' || error.name === 'InvalidStateError') {
      console.log('Database error detected, attempting reset...');
      const resetSuccess = await resetDatabase();
      if (resetSuccess) {
        // Retry the operation after reset
        return await operation();
      }
    }
    throw error;
  }
}

export async function storeLoginData(credentials, loginResult) {
  return withErrorHandling(async () => {
    const db = await getDB();

    await db.put(STORE_USER, loginResult.token, "token");

    const info = {
      ...loginResult.result,
      username: credentials.nevtrekhNer || "",
      password: credentials.nuutsUg || "",
      timestamp: new Date().toISOString(),
    };
    await db.put(STORE_USER, info, "info");

    if (loginResult.permissionsData) {
      await db.put(STORE_USER, loginResult.permissionsData, "permissionsData");
    }
  });
}

// Get offline saved user info
export async function getCachedUserData() {
  return withErrorHandling(async () => {
    const db = await getDB();
    return (await db.get(STORE_USER, "info")) || null;
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
    return data && data.username && data.password;
  } catch (error) {
    console.warn('Error checking offline auth:', error);
    return false;
  }
}

export async function clearOfflineData() {
  return withErrorHandling(async () => {
    const db = await getDB();
    await db.delete(STORE_USER, "token");
    await db.delete(STORE_USER, "info");
    await db.delete(STORE_USER, "permissionsData");
  });
}

export async function attemptOfflineLogin({ nevtrekhNer, nuutsUg }) {
  if (!nevtrekhNer || !nuutsUg)
    throw new Error("Нэвтрэх нэр болон нууц үг шаардлагатай.");

  const stored = await getCachedUserData();

  if (
    !stored ||
    stored.username.trim() !== nevtrekhNer.trim() ||
    stored.password.trim() !== nuutsUg.trim()
  ) {
    throw new Error("Offline credentials mismatch");
  }

  const token = await getCachedToken();
  if (!token) throw new Error("Offline token not found");

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
          return { success: false, error: offlineError.message };
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
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }
    
    // Clear all storage
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('turees') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // Delete database
    await deleteDB(DB_NAME);
    
    console.log('Emergency cleanup completed');
    return true;
  } catch (error) {
    console.error('Emergency cleanup failed:', error);
    return false;
  }
}