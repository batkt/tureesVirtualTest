import { openDB as idbOpen } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 10; // bumped for consistency
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

/**
 * Save credentials + token + permissions for offline login
 */
export async function saveOfflineAuth(credentials, serverResponse) {
  try {
    const db = await openDB();

    const authData = {
      username: credentials.nevtrekhNer || credentials.username,
      // ⚠️ Hash this in production instead of storing plain text
      password: credentials.nuutsUg || credentials.password,
      token: serverResponse.token,
      userInfo: serverResponse.result || serverResponse.data,
      permissionsData: serverResponse.permissionsData,
      savedAt: new Date().toISOString(),
    };

    await db.put(STORES.USER, authData, "credentials");
  } catch (error) {
    console.error("Failed to save offline auth:", error);
    throw error;
  }
}

/**
 * Offline login if no internet
 */
export async function performOfflineLogin(credentials) {
  const db = await openDB();
  const storedAuth = await db.get(STORES.USER, "credentials");

  if (!storedAuth) {
    throw new Error("Оффлайн нэвтрэлтийн мэдээлэл байхгүй байна");
  }

  const inputUsername = credentials.nevtrekhNer || credentials.username;
  const inputPassword = credentials.nuutsUg || credentials.password;

  if (
    storedAuth.username !== inputUsername ||
    storedAuth.password !== inputPassword
  ) {
    throw new Error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
  }

  return {
    success: true,
    token: storedAuth.token,
    result: storedAuth.userInfo,
    permissionsData: storedAuth.permissionsData,
    offline: true,
  };
}

/**
 * Check if offline login data exists
 */
export async function hasOfflineAuth() {
  try {
    const db = await openDB();
    const storedAuth = await db.get(STORES.USER, "credentials");
    return !!(storedAuth && storedAuth.username && storedAuth.password);
  } catch {
    return false;
  }
}

/**
 * Clear saved offline credentials
 */
export async function clearOfflineAuth() {
  try {
    const db = await openDB();
    await db.delete(STORES.USER, "credentials");
  } catch (error) {
    console.error("Failed to clear offline auth:", error);
    throw error;
  }
}

/**
 * Get cached permissions
 */
export async function getCachedPermissionsData() {
  try {
    const db = await openDB();
    const storedAuth = await db.get(STORES.USER, "credentials");
    return storedAuth ? storedAuth.permissionsData : null;
  } catch (error) {
    return null;
  }
}

/**
 * Attempt login → online first, fallback offline
 */
export async function attemptLogin(credentials, onlineLoginFunction) {
  const inputUsername = credentials.nevtrekhNer || credentials.username;
  const inputPassword = credentials.nuutsUg || credentials.password;

  if (!inputUsername || !inputPassword) {
    throw new Error("Нэвтрэх нэр болон нууц үг шаардлагатай");
  }

  if (typeof navigator !== "undefined" && navigator.onLine) {
    try {
      const onlineResult = await onlineLoginFunction(credentials);

      try {
        await saveOfflineAuth(credentials, onlineResult);
      } catch (saveError) {
        console.warn("Failed to save offline login:", saveError);
      }

      return {
        success: true,
        mode: "online",
        data: onlineResult,
      };
    } catch (onlineError) {
      const aldaaMessage =
        onlineError.response?.data?.aldaa || "Нэвтрэлт амжилтгүй боллоо";
      throw new Error(aldaaMessage);
    }
  } else {
    try {
      const offlineResult = await performOfflineLogin(credentials);
      return {
        success: true,
        mode: "offline",
        data: offlineResult,
      };
    } catch (offlineError) {
      throw new Error(
        "Интернетгүй үеийн нэвтрэлт амжилтгүй: " + offlineError.message
      );
    }
  }
}
