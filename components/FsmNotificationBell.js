import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Avatar, Button, Typography, Empty, Spin } from 'antd';
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from 'services/auth';
import fsmApi from 'services/fsmApi';
import { useFsmSocket } from 'hooks/useFsmSocket';
import moment from 'moment';

const { Text } = Typography;

const FsmNotificationBell = () => {
  const { token, ajiltan } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { on, off } = useFsmSocket();

  const api = fsmApi.withAuth(token);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        api.get('/medegdel', { params: { kharsanEsekh: false, limit: 10 } }),
        api.get('/medegdel/unread-count')
      ]);
      setNotifications(listRes.data?.data || []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    };

    on('new_notification', handleNewNotification);
    return () => off('new_notification', handleNewNotification);
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/medegdel/${id}/read`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/medegdel/read-all');
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const notificationContent = (
    <div className="w-80">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <Text strong>Мэдэгдлүүд</Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={markAllAsRead}>
            Бүгдийг уншсан
          </Button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center"><Spin /></div>
        ) : notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={item => (
              <List.Item 
                className="px-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => markAsRead(item._id)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={item.turul === 'taskCompleted' ? <CheckCircleOutlined /> : <BellOutlined />} 
                      className={item.turul === 'taskCompleted' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                    />
                  }
                  title={<span className="text-xs font-bold">{item.title}</span>}
                  description={
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-600 line-clamp-2">{item.message}</span>
                      <span className="text-[9px] text-gray-400">
                        <ClockCircleOutlined className="mr-1" />
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Шинэ мэдэгдэл байхгүй" className="py-8" />
        )}
      </div>
      <div className="p-2 border-t text-center">
        <Button type="text" size="small" block className="text-gray-500 text-xs">
          Бүх мэдэгдлийг харах
        </Button>
      </div>
    </div>
  );

  return (
    <Popover 
      content={notificationContent} 
      trigger="click" 
      placement="bottomRight"
      overlayClassName="p-0"
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button 
          type="text" 
          shape="circle" 
          icon={<BellOutlined className="text-xl" />} 
          className="flex items-center justify-center hover:bg-gray-100"
        />
      </Badge>
    </Popover>
  );
};

export default FsmNotificationBell;
