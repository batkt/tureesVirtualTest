import { openDB as idbOpen } from "idb";

const DB_NAME = "turees-db";
const DB_VERSION = 9;
const STORES = {
  USER: "user",
  PAYMENTS: "offline-payments",
  AUTH: "auth",
  CACHE: "cache",
};

export async function openDB() {
  try {
    const db = await idbOpen(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(
          `Өгөгдлийн санг ${oldVersion}-ээс ${newVersion} рүү шинэчилж байна`
        );

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

        console.log("Шинэчлэлт дууссаны дараах сангууд:", [
          ...db.objectStoreNames,
        ]);
      },
      blocked() {
        console.warn(
          "Өгөгдлийн сангийн шинэчлэлт хориглогдсон - бусад табуудыг хаана уу"
        );
      },
      blocking() {
        console.warn(
          "Энэ холболт өгөгдлийн сангийн шинэчлэлтийг хориглож байна"
        );
      },
    });

    return db;
  } catch (error) {
    console.error("IndexedDB нээхэд алдаа гарлаа:", error);
    throw error;
  }
}

export async function saveOfflineAuth(credentials, serverResponse) {
  try {
    console.log("💾 Оффлайн нэвтрэлтийн өгөгдөл хадгалж байна");
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
    console.log("✅ Оффлайн нэвтрэлтийн өгөгдөл амжилттай хадгалагдлаа");
  } catch (error) {
    console.error(
      "❌ Оффлайн нэвтрэлтийн өгөгдөл хадгалахад алдаа гарлаа:",
      error
    );
    throw error;
  }
}

export async function performOfflineLogin(credentials) {
  try {
    console.log("🔐 Оффлайн нэвтрэлт оролдож байна");

    if (typeof navigator !== "undefined" && navigator.onLine) {
      console.log(
        "❌ Сүлжээ холбогдсон байна - оффлайн нэвтрэлт хийх шаардлагагүй"
      );
      throw new Error("Сүлжээ байгаа тул онлайн нэвтрэлт хэрэглэнэ үү");
    }

    const db = await openDB();
    const storedAuth = await db.get(STORES.USER, "credentials");

    if (!storedAuth) {
      console.log("❌ Оффлайн нэвтрэлтийн мэдээлэл олдсонгүй");
      throw new Error("Оффлайн нэвтрэлтийн мэдээлэл байхгүй байна");
    }

    const inputUsername = credentials.nevtrekhNer || credentials.username;
    const inputPassword = credentials.nuutsUg || credentials.password;

    if (
      storedAuth.username !== inputUsername ||
      storedAuth.password !== inputPassword
    ) {
      console.log("❌ Оффлайн нэвтрэлтийн мэдээлэл тохирохгүй байна");
      throw new Error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
    }

    console.log("✅ Оффлайн нэвтрэлт амжилттай боллоо");
    return {
      success: true,
      token: storedAuth.token,
      result: storedAuth.userInfo,
      permissionsData: storedAuth.permissionsData,
      offline: true,
    };
  } catch (error) {
    console.error("❌ Оффлайн нэвтрэлт амжилтгүй боллоо:", error);
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
    console.error("Оффлайн нэвтрэлтийн боломж шалгахад алдаа гарлаа:", error);
    return false;
  }
}

export async function clearOfflineAuth() {
  try {
    const db = await openDB();
    await db.delete(STORES.USER, "credentials");
    console.log("✅ Оффлайн нэвтрэлтийн мэдээлэл устгагдлаа");
  } catch (error) {
    console.error(
      "❌ Оффлайн нэвтрэлтийн мэдээлэл устгахад алдаа гарлаа:",
      error
    );
    throw error;
  }
}

export async function getCachedPermissionsData() {
  try {
    const db = await openDB();
    const storedAuth = await db.get(STORES.USER, "credentials");
    return storedAuth ? storedAuth.permissionsData : null;
  } catch (error) {
    console.error("❌ Кэшээс эрхийн мэдээлэл авахад алдаа гарлаа:", error);
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
    console.log("🌐 Сүлжээ байгаа - онлайн нэвтрэлт хийж байна");
    try {
      const onlineResult = await onlineLoginFunction(credentials);

      try {
        await saveOfflineAuth(credentials, onlineResult);
      } catch (saveError) {
        console.warn(
          "⚠️ Оффлайн мэдээлэл хадгалахад алдаа гарсан ч онлайн нэвтрэлт амжилттай боллоо:",
          saveError
        );
      }

      return {
        success: true,
        mode: "online",
        data: onlineResult,
      };
    } catch (onlineError) {
      console.error("❌ Онлайн нэвтрэлт амжилтгүй боллоо:", onlineError);
      throw new Error(onlineError.message || "Нэвтрэлт амжилтгүй боллоо");
    }
  } else {
    console.log("📴 Сүлжээ тасарсан - Интернетгүй үеийн нэвтрэлт оролдож байна");
    try {
      const offlineResult = await performOfflineLogin(credentials);
      return {
        success: true,
        mode: "offline",
        data: offlineResult,
      };
    } catch (offlineError) {
      console.error("❌ Оффлайн нэвтрэлт амжилтгүй боллоо:", offlineError);
      throw new Error("Интернетгүй үеийн нэвтрэлт амжилтгүй: " + offlineError.message);
    }
  }
}
