import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ShieldCheck } from 'lucide-react'
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-6 p-12 bg-white rounded-[2rem] shadow-2xl border border-slate-100">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin relative z-10" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Authenticating Protocol</h2>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Securing Institutional Link...</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          <ShieldCheck size={14} />
          Verified Secure Handshake
        </div>
      </div>
    </div>
  )
}
