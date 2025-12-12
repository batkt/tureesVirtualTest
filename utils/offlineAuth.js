import { openDB, STORES } from "./indexedDB";
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
    // If object store doesn't exist, the database version needs to be incremented
    // to trigger the upgrade callback. This error should be resolved after
    // the database version is updated and the page is refreshed.
    console.error("Failed to save offline auth:", error);
    throw error;
  }
}

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
  const db = await openDB();
  await db.delete(STORES.USER, "credentials");
}

export async function getCachedPermissionsData() {
  const db = await openDB();
  const storedAuth = await db.get(STORES.USER, "credentials");
  return storedAuth ? storedAuth.permissionsData : null;
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
      } catch (saveError) {
        console.error("Оффлайн мэдээлэл хадгалах алдаа:", saveError);
      }

      return {
        success: true,
        mode: "online",
        data: onlineResult,
      };
    } catch (onlineError) {
      const aldaaMessage =
        onlineError.response?.data?.aldaa ||
        onlineError.message ||
        "Нэвтрэлт амжилтгүй боллоо";
      throw new Error(aldaaMessage);
    }
  } else {
    const offlineResult = await performOfflineLogin(credentials);
    return {
      success: true,
      mode: "offline",
      data: offlineResult,
    };
  }
}
