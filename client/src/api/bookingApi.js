import API from './axios';

export const listBookings = (params) => API.get('/bookings', { params });
export const listMyBookings = () => API.get('/bookings/my');
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const createBooking = (data) => API.post('/bookings', data);
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });
export const cancelBooking = (id) => API.post(`/bookings/${id}/cancel`);

export default {
  listBookings,
  listMyBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking
};
