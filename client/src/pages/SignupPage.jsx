import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  School,
  ShieldCheck,
  AlertCircle,
  Calendar,
  ClipboardList,
  Users
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function SignupPage() {
  const navigate = useNavigate()
  const { user, setSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [googleEnabled, setGoogleEnabled] = useState(false)

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
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    }
  }, [navigate, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Full name is required'
    if (!formData.email) errors.email = 'Institutional email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 6) errors.password = 'Min 6 characters'
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match'
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/signup', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })
      const data = response.data
      if (!data?.token) throw new Error('Registration successful but token missing.')
      setSession(data.token, data.user)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Enrollment failed. Please try again or contact support.')
    } finally {
      setIsLoading(false)
    }
  }

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
              Join Smart Campus<br />
              and manage your<br />
              campus experience.
            </h1>
            <p className="mt-6 text-base text-slate-500 font-normal leading-relaxed max-w-sm">
              Create your account to start booking facilities and reporting maintenance issues at SLIIT.
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 lg:mt-16 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Make bookings</h3>
                <p className="text-sm text-slate-500 mt-0.5">Reserve rooms, labs, and equipment instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Submit tickets</h3>
                <p className="text-sm text-slate-500 mt-0.5">Report and track facility maintenance issues</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Users className="text-indigo-600" size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Collaborate</h3>
                <p className="text-sm text-slate-500 mt-0.5">Share resources and coordinate with your team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-slate-400 font-medium">
          © 2026 SLIIT Smart Campus · IT3030 PAF Assignment
        </div>
      </div>

      {/* RIGHT PANEL: Form Area */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <div className="max-w-lg w-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-500 mt-1">Fill in your details to get started</p>
            </div>

            {googleEnabled && (
              <>
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

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">or register with email</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1 block">Full name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className={`h-11 w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.name ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-xs text-rose-600 mt-1 ml-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                <label className="text-sm font-medium text-slate-700 ml-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
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
                {validationErrors.password ? (
                  <p className="text-xs text-rose-600 mt-1 ml-1">{validationErrors.password}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1 ml-1">Minimum 6 characters</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 ml-1 block">Confirm password</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`h-11 w-full pl-4 pr-11 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.confirmPassword ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-rose-600 mt-1 ml-1">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Error Alert */}
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
                disabled={isLoading}
                className="h-11 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Sign in Link */}
            <div className="mt-8 text-center">
              <span className="text-sm text-slate-500">Already have an account?</span>
              <Link to="/login" className="text-sm text-indigo-600 font-medium hover:underline ml-1">Sign in</Link>
            </div>

            {/* Terms Note */}
            <div className="mt-10 pt-4 text-center border-t border-slate-50">
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
