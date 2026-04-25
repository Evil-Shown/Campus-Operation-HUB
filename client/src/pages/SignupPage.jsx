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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-indigo-100">
        {/* LEFT PANEL: Branding & Illustration */}
        <div className="w-full lg:w-[45%] flex flex-col justify-between p-10 lg:p-16 h-screen lg:sticky lg:top-0" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Background image layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              animation: 'kbsignup 16s ease-in-out infinite alternate',
              zIndex: 0,
            }}
          />

          {/* Darker overlay — optimized for white text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(30,27,75,0.65) 0%, rgba(49,46,129,0.60) 100%)',
              zIndex: 1,
            }}
          />

          {/* Inject keyframes */}
          <style>{`
            @keyframes kbsignup {
              0%   { transform: scale(1)    translateY(0px); }
              100% { transform: scale(1.08) translateY(-20px); }
            }
          `}</style>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="max-w-md">
              {/* Logo Row */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-4">
                <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <School className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-none" style={{ color: 'white' }}>SmartCampus</h2>
                  <p className="text-[10px] font-medium mt-1 uppercase tracking-wider" style={{ color: 'rgba(199,210,254,0.9)' }}>SLIIT Faculty of Computing</p>
                </div>
              </motion.div>

              {/* Headline Block */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 sm:mt-24">
                <h1 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight" style={{ color: 'white' }}>
                  Join Smart Campus<br />
                  and manage your<br />
                  campus experience.
                </h1>
                <p className="mt-6 text-base font-normal leading-relaxed max-w-sm" style={{ color: 'rgba(199,210,254,1)' }}>
                  Create your account to start booking facilities and reporting maintenance issues at SLIIT.
                </p>
              </motion.div>

              {/* Features */}
              <div className="mt-12 lg:mt-16 flex flex-col gap-8">
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'white' }}>Make bookings</h3>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(199,210,254,0.9)' }}>Reserve rooms, labs, and equipment instantly</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.65 }} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'white' }}>Submit tickets</h3>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(199,210,254,0.9)' }}>Report and track facility maintenance issues</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'white' }}>Collaborate</h3>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(199,210,254,0.9)' }}>Share resources and coordinate with your team</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="mt-12 text-xs font-medium" style={{ color: 'rgba(165,180,252,0.8)' }}>
              © 2026 SLIIT Smart Campus · IT3030 PAF Assignment
            </motion.div>
          </div>

        </div>

        {/* RIGHT PANEL: Form Area */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="flex-1 flex items-center justify-center p-6 lg:p-12 min-h-screen"
          style={{
            background: 'linear-gradient(135deg, #f8faff 0%, #f1f5ff 50%, #eef2ff 100%)',
          }}
        >
          <div className="max-w-md w-full">
            <div 
              className="bg-white border rounded-2xl p-8 lg:p-10"
              style={{
                boxShadow: '0 8px 48px 0 rgba(99,102,241,0.13), 0 2px 16px 0 rgba(0,0,0,0.07)',
                border: '1px solid rgba(99,102,241,0.10)',
              }}
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                <p className="text-sm text-slate-500 mt-1">Join the SLIIT Smart Campus community</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`h-11 w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.name ? 'border-rose-400' : ''}`}
                    />
                  </div>
                  {validationErrors.name && <p className="text-xs text-rose-500 ml-1">{validationErrors.name}</p>}
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-1 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@sliit.lk"
                      className={`h-11 w-full pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.email ? 'border-rose-400' : ''}`}
                    />
                  </div>
                  {validationErrors.email && <p className="text-xs text-rose-500 ml-1">{validationErrors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`h-11 w-full pl-10 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.password ? 'border-rose-400' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1 block">Confirm</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`h-11 w-full pl-10 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all ${validationErrors.confirmPassword ? 'border-rose-400' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                {(validationErrors.password || validationErrors.confirmPassword) && (
                  <p className="text-xs text-rose-500 ml-1">{validationErrors.password || validationErrors.confirmPassword}</p>
                )}

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
                  disabled={isLoading}
                  className="h-11 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Google Link */}
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

              {/* Login Link */}
              <div className="mt-6 text-center">
                <span className="text-sm text-slate-500">Already have an account?</span>
                <Link to="/login" className="text-sm text-indigo-600 font-medium hover:underline ml-1">Sign in</Link>
              </div>

              {/* Terms Note */}
              <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed px-4">
                By creating an account, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
