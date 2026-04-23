import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const getDashboardPath = (role) => (role === 'ADMIN' ? '/admin' : '/dashboard')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    const hydrateSession = async () => {
      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      localStorage.setItem('token', token)

      try {
        const response = await api.get('/auth/me')
        setSession(token, response.data)
        navigate(getDashboardPath(response?.data?.role), { replace: true })
      } catch {
        setSession(token, null)
        navigate('/dashboard', { replace: true })
      }
    }

    hydrateSession()
  }, [navigate, setSession])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
      Processing login...
    </div>
  )
}
