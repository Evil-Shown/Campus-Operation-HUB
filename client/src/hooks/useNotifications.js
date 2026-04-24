import { useState, useEffect, useCallback } from 'react';
import notificationApi from '../api/notificationApi';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFullData = useCallback(async () => {
    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        notificationApi.listNotifications(),
        notificationApi.getUnreadCount()
      ]);
      setNotifications(listRes.data || []);
      setUnreadCount(countRes.data?.count || 0);
      setError(null);
    } catch (err) {
      setError('System: Pulse check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const pollUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res.data?.count || 0);
    } catch (err) {
      console.warn('System: Pulse sync interrupted');
    }
  }, []);

  useEffect(() => {
    fetchFullData();
    const interval = setInterval(pollUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchFullData, pollUnreadCount]);

  return { notifications, unreadCount, loading, error, refresh: fetchFullData };
};

export default useNotifications;
