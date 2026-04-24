import API from './axios';

export const getDashboardStats = () => API.get('/admin/dashboard/stats');
export const listAllUsers = () => API.get('/admin/users');
export const updateUserRole = (id, role) => API.patch(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default {
  getDashboardStats,
  listAllUsers,
  updateUserRole,
  deleteUser
};
