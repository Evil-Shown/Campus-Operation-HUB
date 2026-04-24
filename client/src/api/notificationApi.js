import API from './axios';

export const listNotifications = () => API.get('/notifications');
export const getUnreadCount = () => API.get('/notifications/unread/count');
export const markAsRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => API.post('/notifications/read-all');

export default {
  listNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
