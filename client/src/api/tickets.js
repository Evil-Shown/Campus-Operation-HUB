import { apiFormData, apiJson } from './http'

export function listTickets({ baseUrl, token, scope = 'all', status }) {
  const path = scope === 'mine' ? '/api/tickets/my' : '/api/tickets'
  return apiJson({ baseUrl, token, path, query: scope === 'all' ? { status } : undefined })
}

export function getTicket({ baseUrl, token, id }) {
  return apiJson({ baseUrl, token, path: `/api/tickets/${id}` })
}

export function createTicket({ baseUrl, token, data, files }) {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  ;(files || []).forEach((file) => {
    formData.append('files', file)
  })
  return apiFormData({ baseUrl, token, path: '/api/tickets', method: 'POST', formData })
}

export function updateTicketStatus({ baseUrl, token, id, status, resolutionNote }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/tickets/${id}/status`,
    method: 'PATCH',
    query: { status, resolutionNote },
  })
}

export function assignTicket({ baseUrl, token, id, assigneeId }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/tickets/${id}/assign`,
    method: 'PATCH',
    query: { assigneeId },
  })
}

export function addTicketComment({ baseUrl, token, ticketId, body }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/tickets/${ticketId}/comments`,
    method: 'POST',
    body: { body },
  })
}

export function updateTicketComment({ baseUrl, token, ticketId, commentId, body }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/tickets/${ticketId}/comments/${commentId}`,
    method: 'PATCH',
    body: { body },
  })
}

export function listTicketComments({ baseUrl, token, ticketId }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/tickets/${ticketId}/comments`,
  })
}

export function getTicketAttachmentUrl({ baseUrl, ticketId, fileName }) {
  const rawBase = (baseUrl || '/api').trim() || '/api'
  const hasAbsoluteBase = /^https?:\/\//i.test(rawBase)
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost'
  const resolvedBase = hasAbsoluteBase ? rawBase : `${origin}${rawBase.startsWith('/') ? rawBase : `/${rawBase}`}`
  const baseWithoutTrailingSlash = resolvedBase.replace(/\/+$/, '')

  let normalizedPath = `/api/tickets/${ticketId}/attachments/${encodeURIComponent(fileName)}`
  if (baseWithoutTrailingSlash.toLowerCase().endsWith('/api') && normalizedPath.toLowerCase().startsWith('/api/')) {
    normalizedPath = normalizedPath.slice(5)
  }

  return new URL(normalizedPath, `${baseWithoutTrailingSlash}/`).toString()
}

export async function deleteTicketComment({ baseUrl, token, ticketId, commentId }) {
  await apiJson({
    baseUrl,
    token,
    path: `/api/tickets/${ticketId}/comments/${commentId}`,
    method: 'DELETE',
  })
  return { ticketId, commentId }
}

export async function deleteTicket({ baseUrl, token, id }) {
  await apiJson({ baseUrl, token, path: `/api/tickets/${id}`, method: 'DELETE' })
  return { id }
}

