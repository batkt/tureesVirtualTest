import { useState, useEffect } from 'react';
import {
  saveOfflineAuth,
  performOfflineLogin,
} from '../utils/offlineAuth';

export default function useOfflineAuth() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    function onOnline() {
      setIsOffline(false);
    }
    function onOffline() {
      setIsOffline(true);
    }
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Attempt offline login, returns user data or throws
  async function tryOfflineLogin(credentials) {
    const result = await performOfflineLogin(credentials);
    return result;
  }

  // Save offline login data after successful online login
  async function saveLoginOffline(credentials, serverResponse) {
    await saveOfflineAuth(credentials, serverResponse);
  }

  return {
    isOffline,
    tryOfflineLogin,
    saveLoginOffline,
  };
}
