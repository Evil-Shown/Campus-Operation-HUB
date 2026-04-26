// client/src/api/resources.js
import { apiJson } from './http'

// Public: Search resources for regular users
export function searchResources({ baseUrl, token, type, location, minCapacity }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/resources/search',
    query: { type, location, minCapacity },
  })
}

// Admin: Get all resources (including soft-deleted)
export function getAllResourcesAdmin({ baseUrl, token }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/resources/admin/all',
  })
}

// Public: List resources (general listing)
export function listResources({ baseUrl, token, type, location, minCapacity }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/resources',
    query: { type, location, minCapacity },
  })
}

// Public: Get a single resource by ID
export function getResource({ baseUrl, token, id }) {
  return apiJson({ baseUrl, token, path: `/api/resources/${id}` })
}

// Admin: Create a new resource
export function createResource({ baseUrl, token, data }) {
  return apiJson({
    baseUrl,
    token,
    path: '/api/resources',
    method: 'POST',
    body: data,
  })
}

// Admin: Update an existing resource
export function updateResource({ baseUrl, token, id, data }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/resources/${id}`,
    method: 'PUT',
    body: data,
  })
}

// Admin: Soft-delete a resource
export function deleteResource({ baseUrl, token, id }) {
  return apiJson({
    baseUrl,
    token,
    path: `/api/resources/${id}`,
    method: 'DELETE',
  })
}
