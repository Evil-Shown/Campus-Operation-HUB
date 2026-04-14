/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const TOKEN_KEY = 'campusops_token'
const USER_KEY = 'campusops_user'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    return null
  }
}

function normalizeUser(user) {
  if (!user) {
    return null
  }

  const role = user.role === 'ADMIN' || user.role === 'leader' ? 'leader' : 'user'
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    pictureUrl: user.pictureUrl,
    role,
  }
}

function readErrorMessage(payload, fallback) {
  if (payload && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  return fallback
}

async function postAuth(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(readErrorMessage(payload, 'Authentication request failed'))
  }

  return payload
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = readStoredUser()

    return token && storedUser ? storedUser : null
  })

  const persistSession = (authPayload) => {
    const normalizedUser = normalizeUser(authPayload.user)
    localStorage.setItem(TOKEN_KEY, authPayload.token)
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser))
    setUser(normalizedUser)
    return normalizedUser
  }

  const signin = async ({ email, password }) => {
    setLoading(true)
    try {
      const payload = await postAuth('/api/auth/signin', { email, password })
      return persistSession(payload)
    } finally {
      setLoading(false)
    }
  }

  const signup = async ({ name, email, password }) => {
    setLoading(true)
    try {
      const payload = await postAuth('/api/auth/signup', { name, email, password })
      return persistSession(payload)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      signin,
      signup,
      logout,
      isAuthenticated: Boolean(user),
      token: localStorage.getItem(TOKEN_KEY),
      apiBaseUrl: API_BASE_URL,
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
