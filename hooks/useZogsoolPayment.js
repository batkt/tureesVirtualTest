// src/hooks/useZogsoolPayment.js
import useOfflineAuth from './useOfflineAuth';
import { getUser } from '../utils/indexedDB';

export function useZogsoolPayment() {
  const { addPendingPayment } = useOfflineAuth();

  async function payZogsool(paymentBody) {
    const online = navigator.onLine;
    const { token } = await getUser();

    if (online) {
      // Try to send online
      try {
        const res = await fetch('/api/zogsooliinTulburTulye', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(paymentBody)
        });

        if (!res.ok) {
          // If server rejects, fallback to offline save
          await addPendingPayment(paymentBody);
          return { offline: true, message: 'Saved offline after server error' };
        }
        const data = await res.json();
        return { success: true, data };
      } catch (err) {
        // Network error — save offline
        await addPendingPayment(paymentBody);
        return { offline: true, message: 'Saved offline (network error)' };
      }
    } else {
      // Offline: queue
      await addPendingPayment(paymentBody);
      return { offline: true, message: 'Saved offline (offline)' };
    }
  }

  return { payZogsool };
}
