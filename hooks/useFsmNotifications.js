import { useCallback, useState, useEffect, useRef } from 'react';
import fsmApi from 'services/fsmApi';

export const useFsmNotifications = (token, ajiltan) => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const apiRef = useRef(fsmApi.withAuth(token));

  useEffect(() => {
    apiRef.current = fsmApi.withAuth(token);
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        apiRef.current.get('/medegdel', { params: { limit: 20 } }),
        apiRef.current.get('/medegdel/unread-count')
      ]);
      setAllNotifications(listRes.data?.data || []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (err) {
      console.error('FSM Notifications fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      await apiRef.current.put(`/medegdel/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setAllNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, kharsanEsekh: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark FSM notification as read:', err);
    }
  }, []);

const markAllAsRead = useCallback(async () => {
  try {
    const response = await apiRef.current.put('/medegdel/read-all', 
      {},  
      {
        params: {
          baiguullagiinId: ajiltan?.baiguullagiinId
        }
      }
    );

    if (response.data.success) {
      setUnreadCount(0);
      setAllNotifications(response.data.data || []);
    }
  } catch (err) {
    console.error('Failed to mark all FSM notifications as read:', err);
  }
}, [ajiltan?.baiguullagiinId]);

  return {
    notifications: allNotifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

export default useFsmNotifications;