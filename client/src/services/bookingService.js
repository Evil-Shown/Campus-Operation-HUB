import api from '../api/axios.js'

// Member 2 - Booking Management
const bookingService = {
  createBooking(payload) {
    return api.post('/v1/bookings', payload)
  },

  getMyBookings() {
    return api.get('/v1/bookings/my')
  },

  getAllBookings(params = {}) {
    return api.get('/v1/bookings', { params })
  },

  getBookingById(id) {
    return api.get(`/v1/bookings/${id}`)
  },

  approveBooking(id, adminReviewNote = '') {
    return api.put(`/v1/bookings/${id}/approve`, { adminReviewNote })
  },

  rejectBooking(id, adminReviewNote) {
    return api.put(`/v1/bookings/${id}/reject`, { adminReviewNote })
  },

  cancelBooking(id) {
    return api.delete(`/v1/bookings/${id}`)
  },

  getResourceBookings(resourceId) {
    return api.get(`/v1/bookings/resource/${resourceId}`)
  },

  getResourceAvailability(resourceId) {
    return api.get(`/v1/bookings/resource/${resourceId}/availability`)
  },
}

export default bookingService
