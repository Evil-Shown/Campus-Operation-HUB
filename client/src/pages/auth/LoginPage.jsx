import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, Eye, EyeOff, AlertCircle, School, ShieldCheck, 
  ArrowRight, LayoutDashboard, Database, Zap, Fingerprint, 
  Shield, Key, Network, Globe, Activity, Cpu, Server
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function readLoginErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.code === 'ERR_NETWORK') return 'Unable to connect to the campus servers. Please check your internet.'
  return 'Authentication failed. Please verify your institutional credentials.'
}

const TelemetryCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, x: -20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center gap-4 bg-white/40 backdrop-blur-md border border-white/40 p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
  >
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} bg-opacity-10 shadow-inner`}>
      <Icon size={20} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-slate-800 leading-none">{value}</p>
    </div>
  </motion.div>
)

const StaticFeature = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-5 p-6 rounded-3xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-sm group"
  >
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.2)] group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <div>
      <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [sessionExpired, setSessionExpired] = useState(false)
  const navigate = useNavigate()
  const { user, signin } = useAuth()

  const getDashboardPath = (role) => {
    const normalizedRole = (role || '').toString().trim().toUpperCase()
    return normalizedRole === 'ADMIN' ? '/admin' : '/dashboard'
  }

  useEffect(() => {
    const message = sessionStorage.getItem('logoutMessage')
    if (message) {
      setSessionExpired(true)
      sessionStorage.removeItem('logoutMessage')
      const timer = setTimeout(() => setSessionExpired(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (user) {
      navigate(getDashboardPath(user.role), { replace: true })
    }
  }, [navigate, user])

  const validateForm = () => {
    const errors = {}
    if (!email) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address'
    if (!password) errors.password = 'Password is required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setError('')
    try {
      const authenticatedUser = await signin({ email: email.trim(), password })
      navigate(getDashboardPath(authenticatedUser?.role), { replace: true })
    } catch (err) {
      setError(readLoginErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
        
        {/* SVG Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' fill='none' stroke='%234F46E5' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Left: Branding & High-Tech Visuals */}
      <div className="relative z-10 w-full lg:w-[48%] flex flex-col justify-between p-8 lg:p-20 overflow-hidden">
        {/* Animated Accent */}
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600 opacity-[0.03] rounded-full blur-[100px] animate-pulse-slow" />
        
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center gap-5 mb-24"
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-indigo-600/20 rounded-2xl blur group-hover:bg-indigo-600/30 transition-all duration-500" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_10px_30px_rgba(79,70,229,0.4)] transition-transform group-hover:scale-105">
                <School className="text-white h-9 w-9" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">SmartCampus</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-600 font-black">Infrastructure Hub</p>
              </div>
            </div>
          </motion.div>

          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-7xl font-black text-slate-900 leading-[1] tracking-tighter mb-10">
                Next-Gen <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">Command Workspace.</span>
              </h1>
              <p className="text-2xl text-slate-500 leading-relaxed font-semibold mb-16 max-w-lg">
                Orchestrating institutional performance with zero-trust security and real-time operational telemetry.
              </p>
            </motion.div>

            {/* Live Telemetry Panels */}
            <div className="grid grid-cols-2 gap-4 mb-20 max-w-lg">
              <TelemetryCard icon={Activity} label="System Latency" value="14ms" color="bg-emerald-500" delay={0.4} />
              <TelemetryCard icon={Cpu} label="Node Load" value="28.4%" color="bg-indigo-500" delay={0.5} />
              <TelemetryCard icon={Server} label="Uptime Status" value="99.99%" color="bg-blue-500" delay={0.6} />
              <TelemetryCard icon={Globe} label="Active Nodes" value="1,402" color="bg-purple-500" delay={0.7} />
            </div>

            <div className="grid gap-6">
              <StaticFeature 
                icon={LayoutDashboard} 
                title="Unified Oversight" 
                desc="Deep-level visualization for all campus services and asset management."
                delay={0.8}
              />
              <StaticFeature 
                icon={ShieldCheck} 
                title="Protocol Alpha" 
                desc="Secured with AES-256-GCM and multi-layered hardware attestation."
                delay={0.9}
              />
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2 }} 
          className="mt-20 flex items-center gap-8 text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]"
        >
          <span>&copy; 2026 SmartCampus Network</span>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <span>SLIIT Computing Hub</span>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <span>v2.4.0 PRO</span>
        </motion.div>
      </div>

      {/* Right: Holographic Login Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-24 bg-white/30 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[560px] relative"
        >
          {/* Floating UI Accents */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="bg-white/80 backdrop-blur-[40px] p-12 lg:p-16 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
             {/* Tech Edge Glow */}
             <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient bg-[length:200%_auto]"></div>
             
             <div className="mb-14 relative">
               <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Initialize Link.</h2>
               <p className="text-slate-500 font-bold text-lg leading-relaxed">Enter your institutional credentials to establish a secure operational session.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
                <AnimatePresence>
                  {sessionExpired && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="flex items-center gap-4 p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold shadow-sm"
                    >
                      <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
                      SECURE LINK EXPIRED. TERMINAL RE-AUTH REQUIRED.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Universal Access ID</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-all group-focus-within:scale-110" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@university.edu"
                      className={`w-full pl-16 pr-6 h-20 bg-slate-50/50 border border-slate-200/60 rounded-[2rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-[6px] focus:ring-indigo-600/5 transition-all outline-none font-bold text-lg ${validationErrors.email ? 'border-rose-500 ring-rose-500/5' : ''}`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Security Keyphrase</label>
                    <a href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-[0.2em] underline underline-offset-4">Reset Credentials</a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-all group-focus-within:scale-110" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-16 pr-16 h-20 bg-slate-50/50 border border-slate-200/60 rounded-[2rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-[6px] focus:ring-indigo-600/5 transition-all outline-none font-bold text-lg ${validationErrors.password ? 'border-rose-500 ring-rose-500/5' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-3xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold flex items-center gap-4 shadow-sm"
                  >
                    <AlertCircle className="h-6 w-6 shrink-0 text-rose-500" />
                    SYSTEM LOG: {error.toUpperCase()}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4 group mt-6 relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
                  {loading ? (
                    <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Establish Connection</span>
                      <ArrowRight className="h-7 w-7 group-hover:translate-x-3 transition-transform duration-500" />
                    </>
                  )}
                </button>
             </form>

             <div className="relative my-14">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                  <span className="bg-white/80 backdrop-blur-md px-6 rounded-full py-1">Identity Federation</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <a
                  href="/oauth2/authorization/google"
                  className="flex items-center justify-center gap-4 w-full h-20 bg-white border border-slate-200/80 rounded-[2rem] text-slate-700 font-bold text-lg hover:bg-slate-50 hover:shadow-xl transition-all active:scale-[0.98] group"
                >
                  <svg className="h-7 w-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="group-hover:text-slate-900 transition-colors uppercase tracking-widest text-sm font-black">Verify with Google SSO</span>
                </a>
              </div>

              <div className="mt-16 text-center">
                <p className="text-slate-500 font-bold text-lg">
                  Unauthorized Operator?{' '}
                  <Link to="/signup" className="text-indigo-600 font-black hover:underline underline-offset-8 decoration-[3px]">Enroll Device</Link>
                </p>
              </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12 flex justify-center items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]"
          >
            <div className="flex h-6 w-10 items-center justify-center rounded-md border border-slate-200 bg-white">
              <ShieldCheck size={16} className="text-indigo-600" />
            </div>
            Institutional Node Protection Active
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
