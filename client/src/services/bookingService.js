import api from '../api/axios.js'

// Member 2 - Booking Management
const bookingService = {
  createBooking(payload) {
    return api.post('/bookings', payload)
  },

  getMyBookings() {
    return api.get('/bookings/my')
  },

  getAllBookings(params = {}) {
    return api.get('/bookings', { params })
  },

  getBookingById(id) {
    return api.get(`/bookings/${id}`)
  },

  approveBooking(id, _adminReviewNote = '') {
    return api.patch(`/bookings/${id}/approve`)
  },

  rejectBooking(id, adminReviewNote) {
    const reason = encodeURIComponent(adminReviewNote || '')
    return api.patch(`/bookings/${id}/reject?reason=${reason}`)
  },

  cancelBooking(id) {
    return api.patch(`/bookings/${id}/cancel`)
  },

  getResourceBookings(resourceId) {
    return api.get(`/bookings/resource/${resourceId}`)
  },

  getResourceAvailability(resourceId) {
    return api.get(`/bookings/resource/${resourceId}/availability`)
  },
}

export default bookingService
