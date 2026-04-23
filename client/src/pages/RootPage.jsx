import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { School, Cpu, ShieldCheck, Database, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RootPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const getDashboardPath = (role) => (role === 'ADMIN' ? '/admin' : '/dashboard')

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          navigate(getDashboardPath(user.role), { replace: true })
        } else {
          navigate('/login', { replace: true })
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [user, loading, navigate])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Cinematic Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full animate-pulse-slow" />
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="relative group"
        >
          {/* Rotating Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-primary-500/10 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 border border-indigo-500/5 rounded-full"
          />
          
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary-600 to-indigo-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            <School className="h-12 w-12 text-primary-500 group-hover:scale-110 transition-transform duration-500" />
            
            {/* Tech Dots */}
            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>
        
        <div className="mt-12 space-y-6 text-center">
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-black text-white tracking-widest uppercase"
            >
              Smart<span className="text-primary-500">Campus</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500"
            >
              Operations Infrastructure Hub
            </motion.p>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="h-[2px] w-48 rounded-full bg-slate-800 overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
              />
            </div>
            
            <div className="mt-6 flex items-center gap-6">
              {[Cpu, ShieldCheck, Database, Settings].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0, 1, 0.3] }}
                  transition={{ 
                    delay: 0.2 * i,
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Icon className="h-4 w-4 text-slate-600" />
                </motion.div>
              ))}
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]"
            >
              Establishing Secure Link...
            </motion.p>
          </div>
        </div>
      </div>

      {/* Edge Accents */}
      <div className="absolute top-0 left-0 p-8">
        <p className="text-[10px] text-slate-700 font-mono">SYS_VER: 2.0.4-LTS</p>
      </div>
      <div className="absolute bottom-0 right-0 p-8">
        <p className="text-[10px] text-slate-700 font-mono">ENCRYPTION: AES-256-GCM</p>
      </div>
    </div>
  )
}
