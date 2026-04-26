import { apiJson } from './http'

function normalizeNotification(notification) {
  if (!notification) return notification
  const isRead = notification.read ?? notification.isRead ?? false
  const fallbackTitleByType = {
    BOOKING_PENDING_REVIEW: 'Booking needs review',
    BOOKING_APPROVED: 'Booking approved',
    BOOKING_REJECTED: 'Booking rejected',
    TICKET_CREATED: 'New ticket created',
    TICKET_ASSIGNED: 'Ticket assigned',
    TICKET_STATUS_CHANGED: 'Ticket status updated',
    TICKET_COMMENT_ADDED: 'New ticket comment',
  }

  return {
    ...notification,
    read: isRead,
    isRead,
    title: notification.title || fallbackTitleByType[notification.type] || 'Notification',
  }
}

export function listNotifications({ baseUrl, token }) {
  return apiJson({ baseUrl, token, path: '/api/notifications' }).then((items) =>
    Array.isArray(items) ? items.map(normalizeNotification) : []
  )
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
