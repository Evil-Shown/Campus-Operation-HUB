import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RootPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const getDashboardPath = (role) => (role === 'ADMIN' ? '/admin' : '/dashboard')

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate(getDashboardPath(user.role), { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [user, loading, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
          <span className="text-white font-bold text-xl">SC</span>
        </div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  )
}
