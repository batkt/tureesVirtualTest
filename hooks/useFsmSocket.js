import { useEffect, useRef, useState } from 'react';
import { fsmSocket } from 'services/fsmApi';
import { useAuth } from 'services/auth';
import { toast } from 'sonner';

export const useFsmSocket = (projectId = null, taskId = null, barilgiinId = null) => {
  const { ajiltan } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!ajiltan?._id) return;

    const socket = fsmSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      
      // Set user online
      socket.emit('user_online', {
        userId: ajiltan._id,
        status: 'online'
      });

      // Join personal notification room
      socket.emit('join_notifications', {
        userId: ajiltan._id
      });

      // Join building room if provided
      if (barilgiinId) {
        socket.emit('join_barilga', { barilgiinId });
      }

      // Join project/task rooms if IDs are provided
      if (projectId) {
        socket.emit('join_room', { projectId, taskId });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    socket.on('new_notification', (notification) => {
      toast.info(notification.title || 'Шинэ мэдэгдэл', {
        description: notification.message,
        duration: 5000,
      });
    });

    return () => {
      if (socket) {
        socket.emit('user_online', {
          userId: ajiltan._id,
          status: 'offline'
        });
        socket.disconnect();
      }
    };
  }, [ajiltan?._id, projectId, taskId]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return { socket: socketRef.current, isConnected, onlineUsers, emit, on, off };
};
