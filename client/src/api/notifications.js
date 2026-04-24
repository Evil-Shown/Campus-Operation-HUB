import { apiJson } from './http'

export function listNotifications({ baseUrl, token }) {
  return apiJson({ baseUrl, token, path: '/api/notifications' })
}

export function getUnreadCount({ baseUrl, token }) {
  return apiJson({ baseUrl, token, path: '/api/notifications/unread-count' })
}

export function markAllRead({ baseUrl, token }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/notifications/read-all',
    method: 'PATCH',
  })
}

export function markOneRead({ baseUrl, token, id }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/notifications/${id}/read`,
    method: 'PATCH',
  })
}
