/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const TOKEN_KEY = 'campusops_token'
const USER_KEY = 'campusops_user'

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_KEY)
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const storedUser = readStoredUser()

    return token && storedUser ? storedUser : null
  })

  const loginAsLeader = () => {
    const demoUser = {
      id: 1,
      name: 'Team Leader',
      role: 'leader',
      email: 'leader@campusops.local',
    }

    localStorage.setItem(TOKEN_KEY, 'demo-jwt-token')
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const signUpAsLeader = ({ name, email }) => {
    const newUser = {
      id: Date.now(),
      name: name || 'New Team Leader',
      role: 'leader',
      email,
    }

    localStorage.setItem(TOKEN_KEY, 'demo-jwt-token')
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading: false,
      loginAsLeader,
      signUpAsLeader,
      logout,
      isAuthenticated: Boolean(user),
      token: localStorage.getItem(TOKEN_KEY),
    }),
    [user],
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
