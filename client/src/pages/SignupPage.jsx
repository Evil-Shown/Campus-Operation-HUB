import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  School,
  ShieldCheck,
  AlertCircle,
  Globe,
  Sparkles,
  Shield,
  Fingerprint
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="group p-6 rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 mb-4">
      <Icon size={24} />
    </div>
    <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
)

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
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      {/* Left: Content Area */}
      <div className="relative z-10 w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-16">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center gap-4 mb-16"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_10px_25px_rgba(79,70,229,0.3)]">
              <School className="text-white h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">SmartCampus</h2>
              <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold mt-1">Infrastructure Hub</p>
            </div>
          </motion.div>

          <div className="max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-8"
            >
              The Next Era of <br />
              <span className="text-indigo-600 italic">Campus Intelligence</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="text-xl text-slate-500 leading-relaxed font-medium mb-12"
            >
              Join thousands of faculty members and operational experts in orchestrating excellence across the institutional network.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FeatureCard 
                icon={Fingerprint} 
                title="Secure Identity" 
                desc="Zero-trust authentication protocols for institutional data."
                delay={0.4}
              />
              <FeatureCard 
                icon={Sparkles} 
                title="AI Orchestration" 
                desc="Smart ticket routing and resource optimization algorithms."
                delay={0.5}
              />
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 text-sm text-slate-400 font-medium">
          &copy; 2026 SmartCampus Network &bull; Verified Node Authorization Required
        </motion.div>
      </div>

      {/* Right: Form Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[540px]"
        >
          <div className="bg-white p-10 lg:p-14 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-slate-200/50 relative overflow-hidden">
             {/* Decorative Gradient Border */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
             
             <div className="mb-10 text-center lg:text-left">
               <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Create Account</h2>
               <p className="text-slate-500 font-medium text-lg">Initialize your secure operational profile.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Identity Name</label>
                   <div className="relative group">
                     <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                     <input
                       name="name"
                       type="text"
                       value={formData.name}
                       onChange={handleInputChange}
                       placeholder="Full Name"
                       className={`w-full pl-14 pr-5 h-14 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium ${validationErrors.name ? 'border-rose-500 ring-rose-500/10' : ''}`}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                   <div className="relative group">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                     <input
                       name="email"
                       type="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       placeholder="name@university.edu"
                       className={`w-full pl-14 pr-5 h-14 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium ${validationErrors.email ? 'border-rose-500 ring-rose-500/10' : ''}`}
                     />
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Security Phrase</label>
                   <div className="relative group">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                     <input
                       name="password"
                       type={showPassword ? 'text' : 'password'}
                       value={formData.password}
                       onChange={handleInputChange}
                       placeholder="••••••••"
                       className={`w-full pl-14 pr-12 h-14 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium ${validationErrors.password ? 'border-rose-500 ring-rose-500/10' : ''}`}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Verify Phrase</label>
                   <div className="relative group">
                     <input
                       name="confirmPassword"
                       type={showPassword ? 'text' : 'password'}
                       value={formData.confirmPassword}
                       onChange={handleInputChange}
                       placeholder="••••••••"
                       className={`w-full pl-6 pr-12 h-14 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium ${validationErrors.confirmPassword ? 'border-rose-500 ring-rose-500/10' : ''}`}
                     />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                     </button>
                   </div>
                 </div>
               </div>

               <AnimatePresence>
                 {error && (
                   <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-[1.25rem] bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3">
                     <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" /> {error}
                   </motion.div>
                 )}
               </AnimatePresence>

               <button
                 type="submit"
                 disabled={isLoading}
                 className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-bold text-lg shadow-[0_15px_30px_rgba(79,70,229,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group mt-4 overflow-hidden relative"
               >
                 <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                 {isLoading ? (
                   <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     <span>Initialize Protocol</span>
                     <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
             </form>

             <div className="mt-12 text-center">
               <p className="text-slate-500 font-medium">
                 Already part of the network?{' '}
                 <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2">
                   Secure Sign In
                 </Link>
               </p>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                 Authorized Personnel Only. Access subject to <br />
                 <span className="text-slate-600 underline cursor-pointer hover:text-indigo-600 transition-colors">Institutional Security Protocols</span>
               </p>
             </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-emerald-500" />
            Military-Grade Encryption Enabled
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
