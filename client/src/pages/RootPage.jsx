import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary-500 blur-[40px] opacity-20 animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl">
            <Zap className="h-10 w-10 text-primary-500 fill-primary-500" />
          </div>
        </motion.div>
        
        <div className="mt-8 space-y-2 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 animate-pulse">Initializing Portal</p>
          <div className="h-1 w-32 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-1/2 bg-primary-500"
            />
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-4">Campus Operation HUB</p>
        </div>
      </div>
    </div>
  )
}
