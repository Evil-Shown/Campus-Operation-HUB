import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  School,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle
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
    if (!formData.name.trim()) errors.name = 'Full name required'
    if (!formData.email) errors.email = 'Email required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid format'
    if (!formData.password) errors.password = 'Password required'
    else if (formData.password.length < 6) errors.password = 'Min 6 characters'
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords mismatch'
    
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
      if (!data?.token) throw new Error('Protocol failure: Token missing')
      setSession(data.token, data.user)
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication kernel failure. Please retry.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-50 selection:bg-primary-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-slow [animation-delay:2s]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Banner Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/20">
              <School className="text-white h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-none">SmartCampus</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary-400 font-bold">Operations Hub</span>
            </div>
          </motion.div>

          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                Orchestrate <span className="text-primary-500">Excellence</span> Across Campus
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                Join our integrated ecosystem for institutional resource management and intelligent operational oversight.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, text: "Automated identity verification", color: "text-emerald-400" },
                { icon: BarChart3, text: "High-fidelity resource tracking", color: "text-primary-400" },
                { icon: Sparkles, text: "Optimized scheduling algorithms", color: "text-amber-400" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-slate-300 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm text-slate-500 font-medium">
            &copy; 2026 SmartCampus Network &bull; Verified Institutional Portal
          </motion.div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[440px]">
            <div className="glass-card !bg-slate-900/60 p-8 sm:p-10 border-white/10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-slate-400 text-sm">Join the specialized institutional operations network.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Personnel Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Professor Stephen Strange"
                      className={`input-field pl-11 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-sm ${validationErrors.name ? '!border-rose-500/50' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Institutional Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@university.edu"
                      className={`input-field pl-11 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-sm ${validationErrors.email ? '!border-rose-500/50' : ''}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Access Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`input-field pl-11 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-xs ${validationErrors.password ? '!border-rose-500/50' : ''}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">Verification</label>
                    <div className="relative group">
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`input-field pl-4 !bg-slate-950/50 !border-white/10 focus:!border-primary-500/50 text-xs ${validationErrors.confirmPassword ? '!border-rose-500/50' : ''}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-12 flex items-center justify-center gap-2 group mt-4"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="font-black uppercase tracking-widest text-xs">Initialize Enrollment</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                  Already part of the network?{' '}
                  <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
                    Secure Sign In
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  By initializing enrollment, you agree to comply with the <span className="text-slate-400 underline">Operational Protocols</span> and <span className="text-slate-400 underline">Privacy Directives</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
