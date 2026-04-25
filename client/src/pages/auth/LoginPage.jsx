import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, School, ShieldCheck, Calendar, Bell } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function readLoginErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.code === 'ERR_NETWORK') return 'Unable to connect to the campus servers. Please check your internet.'
  return 'Authentication failed. Please verify your institutional credentials.'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [sessionExpired, setSessionExpired] = useState(false)
  const [googleEnabled, setGoogleEnabled] = useState(false)
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
    let isMounted = true
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/auth/providers')
        if (!response.ok) return
        const data = await response.json()
        if (isMounted) {
          setGoogleEnabled(Boolean(data?.google))
        }
      } catch {
        if (isMounted) {
          setGoogleEnabled(false)
        }
      }
    }
    fetchProviders()
    return () => {
      isMounted = false
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

  const userInitial = (user?.name || 'C').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-indigo-100">
      {/* LEFT PANEL: Branding & Illustration */}
      <div className="w-full lg:w-[45%] bg-white border-r border-slate-100 flex flex-col justify-between p-10 lg:p-16 h-screen lg:sticky lg:top-0">
        <div className="max-w-md">
          {/* Logo Row */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <School className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none">SmartCampus</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">SLIIT Faculty of Computing</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mt-16 sm:mt-24">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Book spaces,<br />
              report issues,<br />
              stay informed.
            </h1>
            <p className="mt-6 text-base text-slate-500 font-normal leading-relaxed max-w-sm">
              The Smart Campus platform helps you manage facility bookings and maintenance requests — all in one place.
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 lg:mt-16 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Book resources</h3>
                <p className="text-sm text-slate-500 mt-0.5">Rooms, labs, equipment and more</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Report issues</h3>
                <p className="text-sm text-slate-500 mt-0.5">Submit and track maintenance tickets</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Bell className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Stay updated</h3>
                <p className="text-sm text-slate-500 mt-0.5">Get notified on booking approvals and ticket updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-slate-400 font-medium">
          © 2026 SLIIT Smart Campus · IT3030 PAF Assignment
        </div>
      </div>

      {/* RIGHT PANEL: Login Form Area */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <div className="max-w-md w-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your campus account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Session Expired Alert */}
              <AnimatePresence>
                {sessionExpired && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-sm text-amber-800 font-medium"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                    Session expired. Please re-authenticate.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@sliit.lk"
                    className={`h-11 w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.email ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-rose-600 mt-1 ml-1">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`h-11 w-full pl-10 pr-11 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.password ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-rose-600 mt-1 ml-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2.5"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {googleEnabled && (
              <>
                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Google Login */}
                <a
                  href="/oauth2/authorization/google"
                  className="h-11 w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all bg-white"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </a>
              </>
            )}

            {/* Signup Link */}
            <div className="mt-8 text-center">
              <span className="text-sm text-slate-500">Don't have an account?</span>
              <Link to="/signup" className="text-sm text-indigo-600 font-medium hover:underline ml-1">Create one</Link>
            </div>

            {/* Security Note */}
            <div className="mt-10 pt-4 flex items-center justify-center gap-2 border-t border-slate-50">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[11px] text-slate-400 font-medium">Your connection is secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
