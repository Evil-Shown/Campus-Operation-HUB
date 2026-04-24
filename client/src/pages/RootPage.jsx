import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { School, ShieldCheck, Database, Zap, LayoutDashboard, Globe, Activity, Cpu, Server } from 'lucide-react'
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
      }, 3000) // Slightly longer for maximum awe
      return () => clearTimeout(timer)
    }
  }, [user, loading, navigate])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-900 overflow-hidden font-sans perspective-1000">
      
      {/* Background Cinematic Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[150px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-slate-950/50 rounded-full blur-[100px]" />
      </div>

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative group cursor-none"
        >
          {/* Orbital Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-24 border border-indigo-500/20 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-32 border border-slate-700/50 rounded-full"
          />
          
          <div className="relative flex h-48 w-48 items-center justify-center rounded-[3.5rem] bg-slate-900 border border-slate-800 shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden group-hover:scale-105 transition-transform duration-700 shimmer">
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20"
            />
            <School className="relative z-10 h-24 w-24 text-white animate-float" />
          </div>
        </motion.div>
        
        <div className="mt-24 space-y-8 text-center max-w-4xl px-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-600 border border-indigo-500 rounded-full shadow-2xl shadow-indigo-600/40"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Grid System Initialized</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-8xl font-black text-white tracking-[-0.08em] uppercase leading-none"
            >
              Smart<span className="text-indigo-500 italic">Campus</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm font-black uppercase tracking-[0.6em] text-slate-500 max-w-2xl mx-auto"
            >
              Advanced Institutional Infrastructure <br />
              <span className="text-indigo-400 font-bold mt-2 inline-block">Enterprise Grid Protocol V4.2</span>
            </motion.p>
          </div>

          <div className="relative flex flex-col items-center pt-16">
            <div className="h-1 w-96 rounded-full bg-slate-800 overflow-hidden shadow-inner relative ring-1 ring-white/5">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(79,70,229,0.8)]"
              />
            </div>
            
            <div className="mt-16 flex items-center gap-12">
              {[LayoutDashboard, ShieldCheck, Database, Zap, Activity, Cpu, Server].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 0.4], y: [20, 0, 0] }}
                  transition={{ 
                    delay: 1.2 + (0.2 * i),
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Icon className="h-8 w-8 text-slate-600" />
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-20 flex flex-col items-center gap-3"
            >
               <div className="flex items-center gap-4">
                  <Globe className="text-indigo-500 animate-spin-slow h-5 w-5" />
                  <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Node Cluster: SLIIT-FC-01</p>
               </div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Establishing Secure Quantum Link...</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edge Telemetry */}
      <div className="absolute top-0 left-0 p-16 hidden md:block">
        <div className="flex items-center gap-6">
          <div className="h-[2px] w-12 bg-indigo-500" />
          <p className="text-[10px] text-slate-600 font-black tracking-[0.5em] uppercase">Sector_01_Online</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-16 text-right hidden md:block">
        <div className="flex items-center gap-6 justify-end">
          <p className="text-[10px] text-slate-600 font-black tracking-[0.5em] uppercase">Verified_Node_Link_Secure</p>
          <div className="h-[2px] w-12 bg-emerald-500" />
        </div>
      </div>
    </div>
  )
}
