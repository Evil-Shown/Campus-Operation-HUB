import { apiJson } from './http'

export function listMyBookings({ baseUrl, token }) {
  return apiJson({ baseUrl, token, path: '/api/bookings/my' })
}

export function listAllBookings({ baseUrl, token, status }) {
  return apiJson({ baseUrl, token, path: '/api/bookings', query: { status } })
}

export function getBooking({ baseUrl, token, id }) {
  return apiJson({ baseUrl, token, path: `/api/bookings/${id}` })
}

export function createBooking({ baseUrl, token, data }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/bookings',
    method: 'POST',
    body: data,
  })
}

export function approveBooking({ baseUrl, token, id }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/bookings/${id}/approve`,
    method: 'PATCH',
  })
}

export function rejectBooking({ baseUrl, token, id, reason }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/bookings/${id}/reject`,
    method: 'PATCH',
    query: { reason },
  })
}

export function cancelBooking({ baseUrl, token, id }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/bookings/${id}/cancel`,
    method: 'PATCH',
  })
}
