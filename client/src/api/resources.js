import { apiJson } from './http'

export function listResources({ baseUrl, token, type, location, minCapacity }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/resources',
    query: { type, location, minCapacity },
  })
}

export function getResource({ baseUrl, token, id }) {
  return apiJson({ baseUrl, token, path: `/api/resources/${id}` })
}

export function createResource({ baseUrl, token, data }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/resources',
    method: 'POST',
    body: data,
  })
}

export function updateResource({ baseUrl, token, id, data }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/resources/${id}`,
    method: 'PUT',
    body: data,
  })
}

export function deleteResource({ baseUrl, token, id }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/resources/${id}`,
    method: 'DELETE',
  })
}
