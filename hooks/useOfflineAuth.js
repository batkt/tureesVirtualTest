import { useState, useEffect, useRef } from 'react';
import {
  saveOfflineAuth,
  performOfflineLogin,
} from '../utils/offlineAuth';

export default function useOfflineAuth() {
  const [isOffline, setIsOffline] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const hasReloadedThisSession = useRef(false);
  const reloadTimeoutRef = useRef(null);

  useEffect(() => {
    console.log('🟡 Setting client to true');
    setIsClient(true);
    if (typeof navigator !== 'undefined') {
      const online = navigator.onLine;
      console.log('🟡 Initial network status:', online ? 'ONLINE' : 'OFFLINE');
      setIsOffline(!online);
    }
  }, []);

  useEffect(() => {
    if (!isClient || typeof navigator === 'undefined') {
      console.log('🔴 Skipping network listeners - not client or no navigator');
      return;
    }

    function onOnline() {
      console.log('🟢 Network: ONLINE - resetting reload guard');
      setIsOffline(false);
      hasReloadedThisSession.current = false;
    }

    function onOffline() {
      console.log('🔴 Network: OFFLINE - clearing timeouts');
      setIsOffline(true);
      if (reloadTimeoutRef.current) {
        console.log('🟡 Clearing reload timeout');
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
    }

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      console.log('🟡 Cleaning up network listeners');
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('🔴 Skipping SW listeners - requirements not met');
      return;
    }

    const handleServiceWorkerMessage = (event) => {
      const { data } = event;
      
      if (!data?.type) return;

      console.log('📨 SW Message:', data.type, data);

      switch (data.type) {
        case 'SYNC_COMPLETED':
          console.log('🔄 Sync completed - checking reload conditions');
          console.log('  - Navigator online:', navigator.onLine);
          console.log('  - Results successful:', data.results?.successful);
          console.log('  - Has reloaded this session:', hasReloadedThisSession.current);
          console.log('  - Reload timeout exists:', !!reloadTimeoutRef.current);
          
          if (
            typeof navigator !== 'undefined' &&
            navigator.onLine &&
            data.results?.successful > 0 &&
            !hasReloadedThisSession.current &&
            !reloadTimeoutRef.current
          ) {
            console.log('✅ Scheduling reload after sync');
            hasReloadedThisSession.current = true;
            
            reloadTimeoutRef.current = setTimeout(() => {
              console.log('🔄 RELOADING after sync completion');
              window.location.reload();
            }, 2000);
          } else {
            console.log('❌ Not reloading - conditions not met');
          }
          break;

        case 'CACHE_UPDATED':
          console.log('💾 Cache updated - checking reload conditions');
          console.log('  - Has reloaded this session:', hasReloadedThisSession.current);
          console.log('  - Reload timeout exists:', !!reloadTimeoutRef.current);
          
          if (!hasReloadedThisSession.current && !reloadTimeoutRef.current) {
            console.log('✅ Scheduling reload after cache update');
            hasReloadedThisSession.current = true;
            
            reloadTimeoutRef.current = setTimeout(() => {
              console.log('🔄 RELOADING after cache update');
              window.location.reload();
            }, 1000);
          } else {
            console.log('❌ Not reloading for cache update - conditions not met');
          }
          break;

        case 'PAYMENT_SAVED_OFFLINE':
          console.log('💳 Payment saved offline - no reload needed');
          break;

        default:
          console.log('❓ Unknown SW message type:', data.type);
          break;
      }
    };

    console.log('📡 Adding SW message listener');
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible - will reset reload guard in 1s');
        setTimeout(() => {
          console.log('🔄 Resetting reload guard after visibility change');
          hasReloadedThisSession.current = false;
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log('🧹 Cleaning up SW listeners');
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, [isClient]);

 
  useEffect(() => {
    console.log('🔍 useOfflineAuth hook re-running');
  });

  async function tryOfflineLogin(credentials) {
    console.log('🔐 Attempting offline login');
    const result = await performOfflineLogin(credentials);
    return result;
  }

  async function saveLoginOffline(credentials, serverResponse) {
    console.log('💾 Saving login offline');
    await saveOfflineAuth(credentials, serverResponse);
  }

  return {
    isOffline,
    tryOfflineLogin,
    saveLoginOffline,
  };
}