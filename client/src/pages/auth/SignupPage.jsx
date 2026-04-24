import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Lock, User, ShieldCheck, 
  ArrowRight, School, Zap, Fingerprint,
  CheckCircle2, AlertCircle
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('System: Security keyphrase mismatch.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signup(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'System: Enrollment protocol failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Visual Side Module */}
      <div className="relative z-10 w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-20 bg-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-violet-600 blur-[150px] rounded-full animate-pulse-slow" />
           <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-blue-600 blur-[150px] rounded-full animate-pulse-slow delay-700" />
        </div>

        <div className="relative z-20">
           <Link to="/" className="flex items-center gap-5 mb-24 group">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform text-slate-900">
                 <School size={32} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">SmartCampus</h2>
           </Link>

           <div className="max-w-md space-y-10">
              <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                 Institutional <br />
                 <span className="text-violet-400 italic font-medium">Enrollment.</span>
              </h1>
              <p className="text-lg font-bold text-white/40 leading-relaxed uppercase tracking-[0.05em]">
                 Executing zero-trust identity provision for operational workspace access.
              </p>
              
              <div className="space-y-6 pt-10">
                 {[
                   { label: 'Verified Nodes', icon: ShieldCheck },
                   { label: 'Alpha Protocol', icon: Zap },
                   { label: 'Biometric Link', icon: Fingerprint }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-6 group">
                      <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-violet-600 transition-all">
                         <item.icon size={20} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-white/60">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="relative z-20 pt-20 text-[10px] font-black uppercase tracking-[0.6em] text-white/20">
           © 2026 SmartCampus Grid • v2.4.0
        </div>
      </div>

      {/* Form Module */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative overflow-y-auto scrollbar-refined">
         <div className="w-full max-w-xl">
            <div className="mb-14">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Initialize Profile.</h3>
               <p className="text-lg font-bold text-slate-400 uppercase tracking-widest italic">Node registration protocol restricted to authorized personnel.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Operator Name</label>
                  <div className="relative group">
                     <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 group-focus-within:scale-110 transition-all" size={20} />
                     <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Johnathan D. Operator"
                        className="w-full h-18 bg-white border border-slate-100 rounded-[1.5rem] pl-16 pr-8 text-sm font-black text-slate-900 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all shadow-sm"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Institutional Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 group-focus-within:scale-110 transition-all" size={20} />
                     <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="operator@university.edu"
                        className="w-full h-18 bg-white border border-slate-100 rounded-[1.5rem] pl-16 pr-8 text-sm font-black text-slate-900 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all shadow-sm"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Secure Keyphrase</label>
                     <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 group-focus-within:scale-110 transition-all" size={20} />
                        <input 
                           type="password"
                           required
                           value={formData.password}
                           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           placeholder="••••••••••••"
                           className="w-full h-18 bg-white border border-slate-100 rounded-[1.5rem] pl-16 pr-8 text-sm font-black text-slate-900 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all shadow-sm"
                        />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Verify Signal</label>
                     <div className="relative group">
                        <CheckCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-600 group-focus-within:scale-110 transition-all" size={20} />
                        <input 
                           type="password"
                           required
                           value={formData.confirmPassword}
                           onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                           placeholder="••••••••••••"
                           className="w-full h-18 bg-white border border-slate-100 rounded-[1.5rem] pl-16 pr-8 text-sm font-black text-slate-900 focus:border-violet-200 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all shadow-sm"
                        />
                     </div>
                  </div>
               </div>

               {error && <ErrorMessage message={error} />}

               <Button 
                isLoading={loading} 
                className="w-full h-20 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-violet-500/20 mt-10 rounded-[2rem]"
                icon={ArrowRight}
               >
                  Authorize Enrollment
               </Button>
            </form>

            <div className="mt-16 text-center text-sm font-bold text-slate-400 uppercase tracking-widest italic">
               Existing operator node? <Link to="/login" className="text-violet-600 font-black hover:underline underline-offset-8 decoration-2">Re-verify Link</Link>
            </div>
         </div>
      </div>
    </div>
  )
}
