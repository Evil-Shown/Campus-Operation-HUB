import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, User, Clock, Search, ChevronDown, Mail, ShieldCheck, School, Settings, Bell, Zap, Activity, Grid } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const menuRef = useRef(null)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const userName = user?.name || 'Campus Operator'
  const userEmail = user?.email || 'operator@smartcampus.local'
  const userInitial = userName.charAt(0).toUpperCase()
  const userRole = user?.role || 'OPERATOR'

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-3xl border-b border-slate-100 px-8 h-24 flex items-center justify-between">
      {/* Search Protocol */}
      <div className="flex items-center gap-12 flex-1">
        <div className="relative group hidden lg:block">
           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
             <Search size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
           </div>
           <input 
              type="text" 
              placeholder="GLOBAL COMMAND SEARCH..." 
              className="bg-slate-50/50 border border-slate-100 rounded-[1.5rem] pl-14 pr-10 py-3.5 w-96 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 transition-all shadow-sm"
           />
           <div className="absolute right-5 inset-y-0 flex items-center pointer-events-none">
              <span className="text-[9px] font-black text-slate-300 border border-slate-200 px-2 py-0.5 rounded-md">CMD + K</span>
           </div>
        </div>
      </div>

      {/* Control Pane */}
      <div className="flex items-center gap-8">
        <div className="hidden xl:flex items-center gap-6 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-full">
           <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Grid Uplink: Active</span>
           </div>
           <div className="h-4 w-px bg-slate-200" />
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">SLIIT-FC-NODE-01</p>
        </div>

        <div className="flex items-center gap-4">
           <button className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm">
             <Bell size={20} />
           </button>
           <button className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm">
             <Grid size={20} />
           </button>
        </div>

        <div className="h-10 w-px bg-slate-100" />

        {/* Identity Token */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center gap-4 pl-1.5 pr-4 py-1.5 rounded-2xl bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-sm font-black text-slate-900 shadow-inner group-hover:scale-105 transition-transform">
               {userInitial}
            </div>
            <div className="hidden sm:block text-left text-white pr-2">
               <p className="text-[10px] font-black uppercase tracking-tighter leading-tight truncate max-w-[100px]">{userName}</p>
               <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-tight italic">{userRole}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-white/50 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-3"
              >
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{userName}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate tracking-wide lowercase">{userEmail}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full">
                      <ShieldCheck className="h-3 w-3 text-indigo-500" />
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Secure Portal Link</span>
                   </div>
                </div>

                <div className="space-y-1">
                   {[
                     { label: 'System Settings', icon: Settings },
                     { label: 'Cloud Activity', icon: Activity }
                   ].map((item, i) => (
                     <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-3">
                           <item.icon size={16} className="text-slate-400 group-hover:text-indigo-600" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </button>
                   ))}
                   
                   <div className="h-px bg-slate-100 mx-2 my-2" />
                   
                   <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-black uppercase tracking-widest text-[10px]"
                   >
                      <LogOut size={16} />
                      Logout Sequence
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
