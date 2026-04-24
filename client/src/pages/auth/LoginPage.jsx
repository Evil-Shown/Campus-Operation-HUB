import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, School, Sparkles, ShieldCheck, BarChart3, ArrowRight, Cpu, Network, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function readLoginErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.code === 'ERR_NETWORK') return 'System link offline. Check connection.'
  return 'Authentication failed. Please check your credentials.'
}

const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
  </div>
)

const FloatingIcon = ({ icon: Icon, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.1, 1],
      y: [0, -20, 0]
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`absolute text-white/10 ${className}`}
  >
    <Icon size={120} strokeWidth={0.5} />
  </motion.div>
)

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [sessionExpired, setSessionExpired] = useState(false)
  const navigate = useNavigate()
  const { user, signin, signup } = useAuth()

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
      const path = getDashboardPath(user.role)
      navigate(path, { replace: true })
    }
  }, [navigate, user])

  const validateForm = () => {
    const errors = {}
    if (!email) errors.email = 'Email required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email format'
    if (!password) errors.password = 'Password required'
    else if (password.length < 6) errors.password = 'Min 6 characters'
    if (!isLogin && !name) errors.name = 'Full name required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true); setError('')
    try {
      const authenticatedUser = isLogin
        ? await signin({ email: email.trim(), password })
        : await signup({ name: name.trim(), email: email.trim(), password })

      navigate(getDashboardPath(authenticatedUser?.role), { replace: true })
    } catch (err) {
      setError(readLoginErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] font-sans text-slate-50 selection:bg-primary-500/30">
      <BackgroundGrid />
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-primary-900/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[15%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse-slow [animation-delay:2s]" />
        <div className="absolute -bottom-[15%] left-[20%] w-[35%] h-[35%] rounded-full bg-violet-900/20 blur-[120px] animate-pulse-slow [animation-delay:4s]" />
      </div>

      {/* Decorative Icons */}
      <FloatingIcon icon={Cpu} className="top-[10%] left-[10%]" delay={0} />
      <FloatingIcon icon={Network} className="bottom-[15%] right-[10%]" delay={1.5} />
      <FloatingIcon icon={Globe} className="top-[40%] right-[30%]" delay={3} />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left: Branding/Marketing */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-16 border-r border-white/5 bg-slate-950/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
                <School className="text-primary-400 h-8 w-8" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white leading-none uppercase">
                Smart<span className="text-primary-500">Campus</span>
              </h2>
              <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Operations Hub</span>
            </div>
          </motion.div>

          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                Next-Gen <br />
                <span className="text-gradient drop-shadow-sm">Campus</span> Management
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed mb-12 font-medium">
                Streamlining institutional workflows with intelligent automation and real-time operational insights.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {[
                { icon: ShieldCheck, title: "Enterprise-grade security standards", desc: "Military-grade encryption for sensitive institutional data.", color: "text-emerald-400" },
                { icon: BarChart3, title: "Real-time resource analytics", desc: "Live tracking of laboratory and classroom utilization.", color: "text-primary-400" },
                { icon: Sparkles, title: "AI-driven request orchestration", desc: "Automated routing for maintenance and support tickets.", color: "text-amber-400" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900/50 border border-white/10 group-hover:border-primary-500/50 transition-colors shadow-inner">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-bold text-lg">{item.title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-6"
          >
            <div className="h-[1px] w-12 bg-white/10"></div>
            <p className="text-sm text-slate-600 font-bold tracking-widest uppercase">
              &copy; 2026 SmartCampus Infrastructure &bull; SLIIT Faculty of Computing
            </p>
          </motion.div>
        </div>

        {/* Right: Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-24 relative overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[480px]"
          >
            {/* Mobile Header */}
            <div className="lg:hidden flex flex-col items-center mb-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-white/10 shadow-2xl mb-4">
                <School className="text-primary-500 h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Smart<span className="text-primary-500">Campus</span></h2>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold">Operations Hub</p>
            </div>

            <div className="relative group">
              {/* Card Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 rounded-[2.2rem] blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              
              <div className="relative glass-card !bg-slate-950/40 p-8 sm:p-12 border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] !rounded-[2rem] overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                
                <div className="mb-10 relative">
                  <motion.h2 
                    key={isLogin ? 'welcome' : 'create'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-white mb-3 tracking-tight"
                  >
                    {isLogin ? 'Welcome Back' : 'Join the Network'}
                  </motion.h2>
                  <p className="text-slate-400 font-medium text-lg">
                    {isLogin 
                      ? 'Enter your credentials to access the command center.' 
                      : 'Initialize your institutional command profile.'}
                  </p>
                </div>

                {/* Cyber Toggle */}
                <div className="flex p-1.5 bg-slate-900/80 rounded-2xl mb-10 border border-white/5 relative shadow-inner">
                  <button
                    onClick={() => !isLogin && setIsLogin(true)}
                    className={`relative flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all z-10 ${isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {isLogin && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute inset-0 bg-primary-600 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      />
                    )}
                    <span className="relative z-20">Sign In</span>
                  </button>
                  <button
                    onClick={() => isLogin && setIsLogin(false)}
                    className={`relative flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all z-10 ${!isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {!isLogin && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute inset-0 bg-primary-600 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      />
                    )}
                    <span className="relative z-20">Sign Up</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {sessionExpired && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm font-bold shadow-lg"
                      >
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        SESSION LINK TERMINATED. RE-AUTHENTICATE.
                      </motion.div>
                    )}

                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-2"
                      >
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identity Name</label>
                        <div className="relative group/input">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within/input:text-primary-400 transition-colors" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="OPERATOR NAME"
                            className={`input-field pl-12 h-14 !bg-slate-900/60 !rounded-[1rem] !border-white/5 focus:!border-primary-500/50 text-sm font-bold tracking-wide transition-all ${validationErrors.name ? '!border-red-500/50' : ''}`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secure Terminal Email</label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within/input:text-primary-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@university.edu"
                        className={`input-field pl-12 h-14 !bg-slate-900/60 !rounded-[1rem] !border-white/5 focus:!border-primary-500/50 text-sm font-bold tracking-wide transition-all ${validationErrors.email ? '!border-red-500/50' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Protocol</label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within/input:text-primary-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`input-field pl-12 pr-12 h-14 !bg-slate-900/60 !rounded-[1rem] !border-white/5 focus:!border-primary-500/50 text-sm font-bold tracking-wide transition-all ${validationErrors.password ? '!border-red-500/50' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 shadow-xl"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      SYSTEM ERROR: {error.toUpperCase()}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-14 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 font-black uppercase tracking-[0.2em] text-white overflow-hidden group/btn shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{isLogin ? 'Initialize Portal' : 'Register Operator'}</span>
                          <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1.5 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-[0.4em] font-black"><span className="bg-[#0b0f1a] px-4 text-slate-600">Identity Providers</span></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <a
                    href={isLogin ? '/oauth2/authorization/google' : '/oauth2/authorization/google?signup=true'}
                    className="flex items-center justify-center gap-4 w-full h-14 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl active:scale-[0.98]"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </a>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                Secure Access Node: <span className="text-slate-400">0x7F4...A92</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
