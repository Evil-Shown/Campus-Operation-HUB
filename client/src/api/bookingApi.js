import API from './axios';

export const listBookings = (params) => API.get('/bookings', { params });
export const listMyBookings = () => API.get('/bookings/my');
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const updateBookingStatus = (id, status, adminReviewNote = '') => {
  if (status === 'APPROVED') {
    return API.put(`/bookings/${id}/approve`, { adminReviewNote });
  }
  if (status === 'REJECTED') {
    return API.put(`/bookings/${id}/reject`, { adminReviewNote });
  }
  throw new Error(`Unsupported status update: ${status}`);
};
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);

export default {
  listBookings,
  listMyBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking
};
