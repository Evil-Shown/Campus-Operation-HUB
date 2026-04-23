import { useState, useEffect } from 'react'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <span className="text-white font-bold text-xl">SC</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Smart Campus</h1>
            <p className="text-slate-300 text-sm">Campus Operation Hub</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex gap-2 rounded-lg bg-white/10 p-1 mb-8 border border-white/10">
            <button
              onClick={toggleMode}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                isLogin
                  ? 'bg-white/20 text-white shadow-lg border border-white/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={toggleMode}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                !isLogin
                  ? 'bg-white/20 text-white shadow-lg border border-white/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Session Expired Banner */}
            {sessionExpired && (
              <div className="flex items-center gap-3 rounded-lg bg-orange-500/20 border border-orange-500/50 p-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <p className="text-sm text-orange-300">Your session expired due to inactivity. Please sign in again.</p>
              </div>
            )}

            {/* Full Name Field (Sign Up Only) */}
            {!isLogin && (
              <div className="relative group">
                <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border transition-all duration-200 text-white placeholder-slate-400 focus:outline-none ${
                      validationErrors.name
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {validationErrors.name && (
                  <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.name}
                  </div>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: '' })
                    }
                  }}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border transition-all duration-200 text-white placeholder-slate-400 focus:outline-none ${
                    validationErrors.email
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {validationErrors.email && (
                <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: '' })
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-lg bg-white/10 border transition-all duration-200 text-white placeholder-slate-400 focus:outline-none ${
                    validationErrors.password
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.password}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 rounded-lg bg-red-500/20 border border-red-500/50 p-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Google OAuth Button */}
          <a
            href={isLogin ? '/oauth2/authorization/google' : '/oauth2/authorization/google?signup=true'}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 text-white font-semibold text-sm group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          </a>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            SLIIT Faculty of Computing — IT3030
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
