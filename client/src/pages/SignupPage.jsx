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
  Fingerprint,
  Activity,
  Cpu,
  Server,
  Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

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
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
        
        {/* SVG Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' fill='none' stroke='%234F46E5' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Left: Branding & High-Tech Visuals */}
      <div className="relative z-10 w-full lg:w-[48%] flex flex-col justify-between p-8 lg:p-20 overflow-hidden text-left">
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
                The Next Era of <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">Campus Intelligence.</span>
              </h1>
              <p className="text-2xl text-slate-500 leading-relaxed font-semibold mb-16 max-w-lg">
                Join thousands of faculty members and operational experts in orchestrating excellence across the institutional network.
              </p>
            </motion.div>

            {/* Live Telemetry Panels */}
            <div className="grid grid-cols-2 gap-4 mb-20 max-w-lg">
              <TelemetryCard icon={Activity} label="System Health" value="OPTIMAL" color="bg-emerald-500" delay={0.4} />
              <TelemetryCard icon={Fingerprint} label="Security Core" value="ACTIVE" color="bg-indigo-500" delay={0.5} />
              <TelemetryCard icon={Zap} label="Link Speed" value="10 Gbps" color="bg-blue-500" delay={0.6} />
              <TelemetryCard icon={Server} label="Data Nodes" value="ONLINE" color="bg-purple-500" delay={0.7} />
            </div>

            <div className="grid gap-6">
              <StaticFeature 
                icon={Fingerprint} 
                title="Secure Identity" 
                desc="Zero-trust authentication protocols for institutional data protection."
                delay={0.8}
              />
              <StaticFeature 
                icon={Sparkles} 
                title="AI Orchestration" 
                desc="Smart ticket routing and resource optimization algorithms."
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
          <span>Verified Node Access</span>
        </motion.div>
      </div>

      {/* Right: Holographic Signup Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-24 bg-white/30 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[580px] relative"
        >
          {/* Floating UI Accents */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="bg-white/80 backdrop-blur-[40px] p-12 lg:p-14 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
             {/* Tech Edge Glow */}
             <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient bg-[length:200%_auto]"></div>
             
             <div className="mb-12 relative text-center lg:text-left">
               <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Enroll Node.</h2>
               <p className="text-slate-500 font-bold text-lg leading-relaxed">Initialize your institutional profile to join the secure operations grid.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Identity Name</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-all font-bold" />
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className={`w-full pl-14 pr-5 h-16 bg-slate-50/50 border border-slate-200/60 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold ${validationErrors.name ? 'border-rose-500 ring-rose-500/5' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Work Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-all font-bold" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@university.edu"
                        className={`w-full pl-14 pr-5 h-16 bg-slate-50/50 border border-slate-200/60 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold ${validationErrors.email ? 'border-rose-500 ring-rose-500/5' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Security Phrase</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-all font-bold" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-5 h-16 bg-slate-50/50 border border-slate-200/60 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold ${validationErrors.password ? 'border-rose-500 ring-rose-500/5' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Verify Phrase</label>
                    <div className="relative group">
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full pl-6 pr-14 h-16 bg-slate-50/50 border border-slate-200/60 rounded-[1.5rem] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold ${validationErrors.confirmPassword ? 'border-rose-500 ring-rose-500/5' : ''}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold flex items-center gap-4 shadow-sm">
                      <AlertCircle className="h-6 w-6 shrink-0 text-rose-500" /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4 group mt-4 relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
                  {isLoading ? (
                    <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Initialize Protocol</span>
                      <ChevronRight className="h-7 w-7 group-hover:translate-x-3 transition-transform duration-500" />
                    </>
                  )}
                </button>
             </form>

             <div className="mt-14 text-center">
               <p className="text-slate-500 font-bold text-lg leading-relaxed">
                 Already part of the network?{' '}
                 <Link to="/login" className="text-indigo-600 font-black hover:underline underline-offset-8 decoration-[3px]">
                   Secure Sign In
                 </Link>
               </p>
             </div>

             <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-400 font-black leading-relaxed uppercase tracking-widest">
                 Authorized Personnel Only. Access subject to <br />
                 <span className="text-slate-600 underline cursor-pointer hover:text-indigo-600 transition-colors font-black">Institutional Operational Protocols</span>
                </p>
             </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10 flex justify-center items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]"
          >
            <div className="flex h-6 w-10 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
              <ShieldCheck size={16} className="text-indigo-600" />
            </div>
            Military-Grade Encryption Active
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
