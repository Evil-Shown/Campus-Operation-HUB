import api from '../api/axios.js'

function normalizeBooking(booking) {
  if (!booking) return booking

  const start = booking.startTime ? new Date(booking.startTime) : null
  const end = booking.endTime ? new Date(booking.endTime) : null
  const hasValidStart = start && !Number.isNaN(start.getTime())
  const hasValidEnd = end && !Number.isNaN(end.getTime())

  const formatTimeOnly = (date) =>
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

  return {
    ...booking,
    resourceName: booking.resourceName || booking.resource?.name || 'Unknown Resource',
    resourceLocation: booking.resourceLocation || booking.resource?.location || booking.resource?.physicalLocation || 'N/A',
    userName: booking.userName || booking.user?.name || 'Unknown User',
    bookingDate:
      booking.bookingDate ||
      (hasValidStart
        ? start.toLocaleDateString('en-CA')
        : ''),
    startTimeOnly: hasValidStart ? formatTimeOnly(start) : '',
    endTimeOnly: hasValidEnd ? formatTimeOnly(end) : '',
  }
}

function normalizeBookingList(payload) {
  return Array.isArray(payload) ? payload.map(normalizeBooking) : []
}

// Member 2 - Booking Management
const bookingService = {
  createBooking(payload) {
    return api.post('/bookings', payload).then((res) => ({ ...res, data: normalizeBooking(res.data) }))
  },

  getMyBookings() {
    return api.get('/bookings/my').then((res) => ({ ...res, data: normalizeBookingList(res.data) }))
  },

  getAllBookings(params = {}) {
    return api.get('/bookings', { params }).then((res) => ({ ...res, data: normalizeBookingList(res.data) }))
  },

  getBookingById(id) {
    return api.get(`/bookings/${id}`).then((res) => ({ ...res, data: normalizeBooking(res.data) }))
  },

  approveBooking(id, _adminReviewNote = '') {
    return api.patch(`/bookings/${id}/approve`).then((res) => ({ ...res, data: normalizeBooking(res.data) }))
  },

  rejectBooking(id, adminReviewNote) {
    const reason = encodeURIComponent(adminReviewNote || '')
    return api.patch(`/bookings/${id}/reject?reason=${reason}`).then((res) => ({ ...res, data: normalizeBooking(res.data) }))
  },

  cancelBooking(id) {
    return api.patch(`/bookings/${id}/cancel`).then((res) => ({ ...res, data: normalizeBooking(res.data) }))
  },

  getResourceBookings(resourceId) {
    return api.get(`/bookings/resource/${resourceId}`)
  },

  getResourceAvailability(resourceId) {
    return api.get(`/bookings/resource/${resourceId}/availability`)
  },
}

export default bookingService
