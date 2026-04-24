import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { School, ShieldCheck, Database, Zap, LayoutDashboard, Activity, Cpu, Server } from 'lucide-react'
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
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] rounded-full bg-blue-50/60 blur-[100px]" />
      </div>

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Animated rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 border border-indigo-200/50 rounded-full border-dashed"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-20 border border-slate-200 rounded-full border-dotted"
          />

          <div className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-white opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <School className="relative z-10 h-16 w-16 text-indigo-600 transition-transform duration-700 group-hover:scale-110" />
          </div>
        </motion.div>

        <div className="mt-16 space-y-6 text-center">
          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-black text-slate-900 tracking-tighter"
            >
              Smart<span className="text-indigo-600">Campus</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400"
            >
              Institutional Operations Grid
            </motion.p>
          </div>

          <div className="relative flex flex-col items-center pt-10">
            <div className="h-2 w-80 rounded-full bg-slate-200 overflow-hidden shadow-inner relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-full w-2/3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              />
            </div>

            <div className="mt-14 flex items-center gap-10">
              {[LayoutDashboard, ShieldCheck, Database, Zap, Activity, Cpu, Server].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0.4], scale: [0.8, 1, 0.9] }}
                  transition={{
                    delay: 0.15 * i,
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                >
                  <Icon className="h-6 w-6 text-slate-400" />
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-14 text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] animate-pulse"
            >
              Synchronizing Operational Node...
            </motion.p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 p-12">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Node_Connected</p>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-12 text-right">
        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">v2.0.4 - Enterprise Edition</p>
      </div>
    </div>
  )
}
