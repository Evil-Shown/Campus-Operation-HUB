import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { signin } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const userJson = params.get('user')

    if (token && userJson) {
      try {
        const userData = JSON.parse(decodeURIComponent(userJson))
        // Establish secure session
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Finalize node synchronization
        const targetPath = userData.role === 'ADMIN' ? '/admin' : '/dashboard'
        setTimeout(() => navigate(targetPath), 1500)
      } catch (e) {
        console.error('Signal corruption detected during synchronization.')
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
       <div className="flex flex-col items-center gap-10">
          <LoadingSpinner fullPage={false} />
          <div className="text-center space-y-4">
             <h2 className="text-xl font-black text-white uppercase tracking-[0.6em] animate-pulse">Establishing Secure Link</h2>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Finalizing identity synchronization protocol...</p>
          </div>
       </div>
    </div>
  )
}
