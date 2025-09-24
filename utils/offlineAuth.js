import { openDB as idbOpen } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 9;
const STORES = {
  USER: "user",
  PAYMENTS: "offline-payments",
};

export async function openDB() {
  try {
    const db = await idbOpen(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains(STORES.USER)) {
          console.log("Хэрэглэгчийн сан үүсгэж байна");
          db.createObjectStore(STORES.USER);
        }

        if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
          console.log("Төлбөрийн сан үүсгэж байна");
          db.createObjectStore(STORES.PAYMENTS, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
      blocked() {},
      blocking() {},
    });

    return db;
  } catch (error) {
    throw error;
  }
}

export async function saveOfflineAuth(credentials, serverResponse) {
  try {
    const db = await openDB();

    const authData = {
      username: credentials.nevtrekhNer || credentials.username,
      password: credentials.nuutsUg || credentials.password,
      token: serverResponse.token,
      userInfo: serverResponse.result || serverResponse.data,
      permissionsData: serverResponse.permissionsData,
      savedAt: new Date().toISOString(),
    };

    await db.put(STORES.USER, authData, "credentials");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function performOfflineLogin(credentials) {
  try {
    if (typeof navigator !== "undefined" && navigator.onLine) {
      throw new Error("Сүлжээ байгаа тул онлайн нэвтрэлт хэрэглэнэ үү");
    }

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
  } catch (error) {
    throw error;
  }
}

export async function hasOfflineAuth() {
  try {
    if (typeof navigator !== "undefined" && navigator.onLine) {
      return false;
    }

    const db = await openDB();
    const storedAuth = await db.get(STORES.USER, "credentials");
    return !!(storedAuth && storedAuth.username && storedAuth.password);
  } catch (error) {
    return false;
  }
}

export async function clearOfflineAuth() {
  try {
    const db = await openDB();
    await db.delete(STORES.USER, "credentials");
  } catch (error) {
    throw error;
  }
}

export async function getCachedPermissionsData() {
  try {
    const db = await openDB();
    const storedAuth = await db.get(STORES.USER, "credentials");
    return storedAuth ? storedAuth.permissionsData : null;
  } catch (error) {
    throw error;
  }
}

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
      } catch (saveError) {}

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
