import { apiJson } from './http'

export function getAdminDashboardData({ baseUrl, token }) {
  return Promise.all([
    apiJson({ baseUrl, token, path: '/api/resources' }),
    apiJson({ baseUrl, token, path: '/api/bookings' }),
    apiJson({ baseUrl, token, path: '/api/tickets' }),
  ]).then(([resources, bookings, tickets]) => ({
    resources: resources || [],
    bookings: bookings || [],
    tickets: tickets || [],
  }))
}

export function getAllBookings({ baseUrl, token, status }) {
  return apiJson({ baseUrl, token, path: '/api/bookings', query: { status } })
}

export function getAllTickets({ baseUrl, token, status }) {
  return apiJson({ baseUrl, token, path: '/api/tickets', query: { status } })
}

export function getAllResources({ baseUrl, token }) {
  return apiJson({ baseUrl, token, path: '/api/resources' })
}

export function listAdminUsers({ baseUrl, token }) {
  return apiJson({ baseUrl, token, path: '/api/admin/users' })
}

export function updateAdminUserRole({ baseUrl, token, id, role }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/admin/users/${id}/role`,
    method: 'PUT',
    body: { role },
  })
}

export function deleteAdminUser({ baseUrl, token, id }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/admin/users/${id}`,
    method: 'DELETE',
  })
}
