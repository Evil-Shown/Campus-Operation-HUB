import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, School, Sparkles, ShieldCheck, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function readLoginErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.code === 'ERR_NETWORK') return 'API connection lost. Please check your internet or server status.'
  return 'Authentication failed. Please check your credentials.'
}

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
  const { user, setSession } = useAuth()

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
      const path = user.role === 'ADMIN' ? '/admin' : '/dashboard'
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
      const endpoint = isLogin ? '/auth/signin' : '/auth/signup'
      const payload = isLogin ? { email, password } : { name, email, password }
      const response = await api.post(endpoint, payload)
      const data = response.data
      if (!data?.token) throw new Error('Token missing')
      setSession(data.token, data.user ?? null)
      navigate(data?.user?.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(readLoginErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-50 selection:bg-primary-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-slow [animation-delay:2s]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse-slow [animation-delay:4s]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Banner Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/20">
              <School className="text-white h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-none">SmartCampus</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary-400 font-bold">Operations Hub</span>
            </div>
          </motion.div>

          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                Next-Gen <span className="text-gradient">Campus</span> Management
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                Streamlining institutional workflows with intelligent automation and real-time operational insights.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, text: "Enterprise-grade security standards", color: "text-emerald-400" },
                { icon: BarChart3, text: "Real-time resource analytics", color: "text-primary-400" },
                { icon: Sparkles, text: "AI-driven request orchestration", color: "text-amber-400" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-slate-300 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-slate-500 font-medium"
          >
            &copy; 2026 SmartCampus Infrastructure &bull; SLIIT Faculty of Computing
          </motion.div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[440px]"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
                  <School className="text-white h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-white">SmartCampus</h2>
              </div>
            </div>

            <div className="glass-card !bg-slate-900/60 p-8 sm:p-10 border-white/10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {isLogin 
                    ? 'Enter your credentials to access the command center.' 
                    : 'Get started with your institution account today.'}
                </p>
              </div>

              {/* Toggle */}
              <div className="flex p-1 bg-slate-950/50 rounded-xl mb-8 border border-white/5">
                <button
                  onClick={() => !isLogin && setIsLogin(true)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => isLogin && setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {sessionExpired && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-medium"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Session expired. Please sign in again.
                    </motion.div>
                  )}

                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Professor John Doe"
                          className={`input-field pl-11 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-sm ${validationErrors.name ? '!border-red-500/50' : ''}`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className={`input-field pl-11 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-sm ${validationErrors.email ? '!border-red-500/50' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`input-field pl-11 pr-11 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-sm ${validationErrors.password ? '!border-red-500/50' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-12 flex items-center justify-center gap-2 group overflow-hidden"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Portal' : 'Create My Account'}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-slate-900 px-3 text-slate-500">Identity Providers</span></div>
              </div>

              <a
                href={isLogin ? '/oauth2/authorization/google' : '/oauth2/authorization/google?signup=true'}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors shadow-xl"
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
