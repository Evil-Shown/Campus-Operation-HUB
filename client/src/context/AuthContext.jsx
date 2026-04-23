/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true)
    try {
      const payload = await postAuth('/api/auth/signup', { name, email, password })
      return persistSession(payload)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
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
