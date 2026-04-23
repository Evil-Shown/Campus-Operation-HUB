/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)
const INACTIVITY_TIMEOUT = 20 * 60 * 1000 // 20 minutes in milliseconds

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const inactivityTimerRef = useRef(null)

  const persistSession = (authPayload) => {
    const normalizedUser = normalizeUser(authPayload.user)
    localStorage.setItem(TOKEN_KEY, authPayload.token)
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser))
    setUser(normalizedUser)
    return normalizedUser
  }

  const signin = useCallback(async ({ email, password }) => {
    setLoading(true)
    try {
      const payload = await postAuth('/api/auth/signin', { email, password })
      return persistSession(payload)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    let isMounted = true

    const bootstrapAuth = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }

      try {
        const response = await api.get('/auth/me')

        if (isMounted) {
          setUser(response.data)
        }
      } catch {
        localStorage.removeItem('token')
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    bootstrapAuth()

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true)
    try {
      const payload = await postAuth('/api/auth/signup', { name, email, password })
      return persistSession(payload)
    } finally {
      setLoading(false)
    return () => {
      isMounted = false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  // Setup inactivity timeout
  useEffect(() => {
    if (!user) return

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current)
      }

      inactivityTimerRef.current = window.setTimeout(() => {
        logout('Session expired due to inactivity')
      }, INACTIVITY_TIMEOUT)
    }

    // Events that reset the inactivity timer
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove']

    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    // Set initial timer
    resetTimer()

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [user])

  const setSession = (token, nextUser) => {
    localStorage.setItem('token', token)
    setUser(nextUser ?? null)
  }

  const logout = (message = '') => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current)
    }
    // Store logout message in sessionStorage to display to user
    if (message) {
      sessionStorage.setItem('logoutMessage', message)
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      setSession,
      logout,
    }),
    [loading, logout, signin, signup, user],
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
