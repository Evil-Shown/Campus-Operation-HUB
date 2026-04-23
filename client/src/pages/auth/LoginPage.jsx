import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, School, Sparkles, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function readLoginErrorMessage(err) {
  if (err?.response?.data?.message) {
    return err.response.data.message
  }

  if (err?.code === 'ERR_NETWORK') {
    return 'Cannot reach the backend API. Start the server on http://localhost:8080 and try again.'
  }

  return 'Unable to sign in right now. Please try again.'
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

  const getDashboardPath = (role) => (role === 'ADMIN' ? '/admin' : '/dashboard')

  // Check for session expiration message
  useEffect(() => {
    const message = sessionStorage.getItem('logoutMessage')
    if (message) {
      setSessionExpired(true)
      sessionStorage.removeItem('logoutMessage')
      // Clear message after 8 seconds
      const timer = setTimeout(() => setSessionExpired(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(getDashboardPath(user.role), { replace: true })
    }
  }, [navigate, user])

  const validateForm = () => {
    const errors = {}

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!name) {
        errors.name = 'Full name is required'
      } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/auth/signin' : '/auth/signup'
      const payload = isLogin
        ? { email, password }
        : { name, email, password }

      const response = await api.post(endpoint, payload)
      const data = response.data

      if (!data?.token) {
        setError('Authentication failed: token missing from server response')
        return
      }

      // Store token and update app auth state immediately
      setSession(data.token, data.user ?? null)
      navigate(getDashboardPath(data?.user?.role), { replace: true })
    } catch (err) {
      setError(readLoginErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setValidationErrors({})
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-orange-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-300/35 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 h-[26rem] w-[26rem] rounded-full bg-orange-300/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.14)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(circle_at_center,white,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/15 bg-slate-900/50 shadow-[0_25px_80px_-25px_rgba(0,0,0,0.75)] backdrop-blur-2xl lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/18 via-emerald-500/10 to-transparent" />
            <div className="relative">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-slate-200">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Campus Command Layer
              </div>

              <div className="mb-10 max-w-md space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                  <School className="h-6 w-6 text-cyan-300" />
                </div>
                <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">Orchestrate Every Campus Workflow</h1>
                <p className="text-base leading-relaxed text-slate-300">
                  One intelligent hub for requests, incidents, approvals, and resource allocation across your institution.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Automation</p>
                  <p className="mt-2 text-2xl font-bold text-white">92%</p>
                  <p className="mt-1 text-xs text-slate-400">Recurring tasks streamlined</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Response Time</p>
                  <p className="mt-2 text-2xl font-bold text-white">2.4h</p>
                  <p className="mt-1 text-xs text-slate-400">Average ticket turnaround</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  Role-aware security and access governance
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  <BarChart3 className="h-4 w-4 text-orange-300" />
                  Live metrics for facilities and operations
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative p-6 sm:p-8 lg:p-10"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Secure Access Portal
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {isLogin ? 'Sign in to continue managing your campus operations.' : 'Join the platform and start coordinating resources smarter.'}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1.5">
              <button
                type="button"
                onClick={() => !isLogin && toggleMode()}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  isLogin ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => isLogin && toggleMode()}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  !isLogin ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
              {sessionExpired && (
                <div className="flex items-center gap-3 rounded-xl border border-orange-400/50 bg-orange-400/10 p-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-orange-300" />
                  <p className="text-sm text-orange-100">Your session expired due to inactivity. Please sign in again.</p>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-200">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (validationErrors.name) {
                          setValidationErrors({ ...validationErrors, name: '' })
                        }
                      }}
                      placeholder="John Doe"
                      className={`w-full rounded-xl border bg-slate-950/45 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                        validationErrors.name
                          ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                          : 'border-white/15 focus:border-cyan-300/70 focus:ring-cyan-300/20'
                      }`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (validationErrors.email) {
                        setValidationErrors({ ...validationErrors, email: '' })
                      }
                    }}
                    placeholder="you@university.edu"
                    className={`w-full rounded-xl border bg-slate-950/45 py-3 pl-10 pr-4 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                      validationErrors.email
                        ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-white/15 focus:border-cyan-300/70 focus:ring-cyan-300/20'
                    }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (validationErrors.password) {
                        setValidationErrors({ ...validationErrors, password: '' })
                      }
                    }}
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border bg-slate-950/45 py-3 pl-10 pr-11 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                      validationErrors.password
                        ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-white/15 focus:border-cyan-300/70 focus:ring-cyan-300/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-400/50 bg-red-400/10 p-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-300" />
                  <p className="text-sm text-red-100">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-orange-400 px-4 py-3 font-semibold text-slate-950 shadow-[0_14px_35px_-14px_rgba(34,211,238,0.65)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-900" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Enter Command Center' : 'Create Account'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </motion.form>

            <motion.div variants={itemVariants} className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/15" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-white/15" />
            </motion.div>

            <motion.a
              variants={itemVariants}
              href={isLogin ? '/oauth2/authorization/google' : '/oauth2/authorization/google?signup=true'}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.a>

            <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-slate-400">
              SLIIT Faculty of Computing | IT3030
            </motion.p>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
