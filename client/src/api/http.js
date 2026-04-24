function readErrorMessage(payload) {
  if (!payload) {
    return null
  }

  if (typeof payload === 'string') {
    return payload
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error
  }

  return null
}

async function parseJsonSafe(response) {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return null
  }
  return response.json().catch(() => null)
}

function buildApiUrl({ baseUrl, path, query }) {
  const rawBase = (baseUrl || '/api').trim() || '/api'
  const hasAbsoluteBase = /^https?:\/\//i.test(rawBase)
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost'
  const resolvedBase = hasAbsoluteBase ? rawBase : `${origin}${rawBase.startsWith('/') ? rawBase : `/${rawBase}`}`
  const baseWithoutTrailingSlash = resolvedBase.replace(/\/+$/, '')

  let normalizedPath = path || '/'
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`
  }

  // Avoid accidental /api/api duplication when baseUrl already contains /api.
  if (baseWithoutTrailingSlash.toLowerCase().endsWith('/api') && normalizedPath.toLowerCase().startsWith('/api/')) {
    normalizedPath = normalizedPath.slice(4)
  }

  const url = new URL(normalizedPath, `${baseWithoutTrailingSlash}/`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return
      }
      url.searchParams.set(key, String(value))
    })
  }

  return url
}

export async function apiJson({ baseUrl, token, path, method = 'GET', body, query }) {
  const url = buildApiUrl({ baseUrl, path, query })

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await parseJsonSafe(response)

  if (!response.ok) {
    const message = readErrorMessage(payload) || `Request failed (${response.status})`
    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function apiFormData({ baseUrl, token, path, method = 'POST', formData, query }) {
  const url = buildApiUrl({ baseUrl, path, query })

  const response = await fetch(url.toString(), {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    body: formData,
  })

  const payload = await parseJsonSafe(response)

  if (!response.ok) {
    const message = readErrorMessage(payload) || `Request failed (${response.status})`
    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

