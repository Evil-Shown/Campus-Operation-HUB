/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const INACTIVITY_TIMEOUT = 20 * 60 * 1000

function normalizeRole(role) {
  if (!role || typeof role !== 'string') {
    return role
  }

  const upperRole = role.toUpperCase()
  return upperRole.startsWith('ROLE_') ? upperRole.slice(5) : upperRole
}

function normalizeUser(nextUser) {
  if (!nextUser) {
    return null
  }

  return {
    ...nextUser,
    role: normalizeRole(nextUser.role),
  }
}

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Authentication failed'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)
  const inactivityTimerRef = useRef(null)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

  const setSession = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
      setToken(nextToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
    }

    const normalizedUser = normalizeUser(nextUser)
    if (normalizedUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
    setUser(normalizedUser)
  }, [])

  const logout = useCallback(
    (message = '') => {
      setSession(null, null)

      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current)
      }

      if (message) {
        sessionStorage.setItem('logoutMessage', message)
      }
    },
    [setSession],
  )

  const signin = useCallback(
    async ({ email, password }) => {
      setLoading(true)
      try {
        const response = await api.post('/auth/signin', { email, password })
        const payload = response.data

        if (!payload?.token) {
          throw new Error('Authentication token missing from server response')
        }

        const normalizedUser = normalizeUser(payload.user)
        setSession(payload.token, normalizedUser)
        return normalizedUser
      } catch (error) {
        throw new Error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [setSession],
  )

  const signup = useCallback(
    async ({ name, email, password }) => {
      setLoading(true)
      try {
        const response = await api.post('/auth/signup', { name, email, password })
        const payload = response.data

        if (!payload?.token) {
          throw new Error('Authentication token missing from server response')
        }

        const normalizedUser = normalizeUser(payload.user)
        setSession(payload.token, normalizedUser)
        return normalizedUser
      } catch (error) {
        throw new Error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [setSession],
  )

  useEffect(() => {
    let isMounted = true

    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (!storedToken) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }

      if (isMounted) {
        setToken(storedToken)
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (isMounted) {
            setUser(normalizeUser(parsedUser))
          }
        } catch {
          localStorage.removeItem(USER_KEY)
        }
      }

      try {
        const response = await api.get('/auth/me')
        if (isMounted) {
          setSession(storedToken, response.data)
        }
      } catch {
        if (isMounted) {
          setSession(null, null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    bootstrapAuth()

    return () => {
      isMounted = false
    }
  }, [setSession])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current)
      }

      inactivityTimerRef.current = window.setTimeout(() => {
        logout('Session expired due to inactivity')
      }, INACTIVITY_TIMEOUT)
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove']
    events.forEach((event) => window.addEventListener(event, resetTimer))

    resetTimer()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer))
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [logout, user])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      apiBaseUrl,
      signin,
      signup,
      setSession,
      logout,
    }),
    [apiBaseUrl, loading, logout, setSession, signin, signup, token, user],
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
