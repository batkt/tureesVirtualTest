import { useState, useEffect, useRef } from 'react';

export default function useOfflineAuth() {
  const [isOffline, setIsOffline] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasOfflineCredentials, setHasOfflineCredentials] = useState(false);
  
  // Олон удаа эхлэхээс сэргийлэх
  const hasInitialized = useRef(false);
  const networkListenersAttached = useRef(false);

  // Клиент тал эхлэх
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setIsClient(true);
      
      if (typeof navigator !== 'undefined') {
        const online = navigator.onLine;
        console.log('Анхны сүлжээний төлөв:', online ? 'ХОЛБОГДСОН' : 'ТАСАРСАН');
        setIsOffline(!online);
      }
    }
  }, []);

  // Сүлжээний сонсогчид - нэг удаа холбох
  useEffect(() => {
    if (!isClient || networkListenersAttached.current || typeof navigator === 'undefined') {
      return;
    }

    networkListenersAttached.current = true;

    function onOnline() {
      console.log('Сүлжээ: ХОЛБОГДЛОО');
      setIsOffline(false);
      // Энд автомат шинэчлэлт үү - зөвхөн төлөв шинэчлэнэ
    }

    function onOffline() {
      console.log('Сүлжээ: ТАСАРЛАА');
      setIsOffline(true);
      // Энд автомат шинэчлэлтгүй - зөвхөн төлөв шинэчлэнэ
    }

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      console.log('Сүлжээний сонсогчдыг цэвэрлэж байна');
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      networkListenersAttached.current = false;
    };
  }, [isClient]);

  // Service Worker сонсогчид - АВТОМАТ ШИНЭЧЛЭЛТГҮЙ
  useEffect(() => {
    if (!isClient || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const handleServiceWorkerMessage = (event) => {
      const { data } = event;
      
      if (!data?.type) return;

      console.log('SW мессеж хүлээн авлаа:', data.type);

      switch (data.type) {
        case 'SYNC_COMPLETED':
          console.log('Синхрон дууслаа - өгөгдөл арын талд шинэчлэгдлээ');
          // Зөвхөн лог - ШИНЭЧЛЭХГҮЙ
          break;

        case 'CACHE_UPDATED':
          console.log('Кэш шинэчлэгдлээ - шинэ өгөгдөл боломжтой');
          // Зөвхөн лог - ШИНЭЧЛЭХГҮЙ
          break;

        case 'PAYMENT_SAVED_OFFLINE':
          console.log('Төлбөр оффлайнд хадгалагдлаа - онлайн болоход синк хийгдэнэ');
          // Зөвхөн лог - ШИНЭЧЛЭХГҮЙ
          break;

        default:
          console.log('Үл мэдэгдэх SW мессеж:', data.type);
          break;
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [isClient]);

  // Туслах функцууд
  async function checkOfflineCredentials() {
    try {
      const available = await hasOfflineAuth();
      setHasOfflineCredentials(available);
    } catch (error) {
      console.error('Оффлайн нэвтрэлтийн боломж шалгахад алдаа гарлаа:', error);
      setHasOfflineCredentials(false);
    }
  }

  async function performLogin(credentials, onlineLoginFunction) {
    console.log('Нэвтрэлтийн процесс эхэлж байна');
    console.log('Сүлжээний төлөв:', navigator?.onLine ? 'ХОЛБОГДСОН' : 'ТАСАРСАН');
    
    try {
      const result = await attemptLogin(credentials, onlineLoginFunction);
      return result;
    } catch (error) {
      console.error('Нэвтрэлтийн процесс амжилтгүй боллоо:', error);
      throw error;
    }
  }

  return {
    isOffline,
    hasOfflineCredentials,
    performLogin,
    checkOfflineCredentials,
  };
}