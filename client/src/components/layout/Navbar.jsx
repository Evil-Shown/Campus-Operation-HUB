<<<<<<< feature/facilities
import NotificationBell from '../notifications/NotificationBell'

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-lg font-semibold text-slate-900">Smart Campus</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">Notifications</div>
        <NotificationBell />
        <div className="h-8 w-8 rounded-full bg-slate-300" />
=======
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Search, ChevronDown, ShieldCheck, Settings, Bell, Activity, Grid, Mail } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import useAuth from '../../hooks/useAuth'
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
    <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-10 flex items-center justify-between">
      {/* Universal Search Matrix */}
      <div className="flex items-center gap-12">
        <div className="relative group hidden lg:block">
           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
             <Search size={18} className="text-slate-300 group-focus-within:text-violet-600 transition-colors" />
           </div>
           <input 
              type="text" 
              placeholder="Execute Global Scan..." 
              className="bg-slate-50/50 border border-slate-100 rounded-2xl pl-14 pr-12 py-3 w-[400px] text-[11px] font-black uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:bg-white focus:border-violet-200 transition-all shadow-sm"
           />
           <div className="absolute right-5 inset-y-0 flex items-center pointer-events-none">
              <span className="text-[9px] font-black text-slate-200 border border-slate-100 px-2 py-0.5 rounded-md">/</span>
           </div>
        </div>
      </div>

      {/* Control Pane Sub-Matrix */}
      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-4 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full">
           <div className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Link: Optimal</span>
           </div>
           <div className="h-3.5 w-[1px] bg-slate-200" />
           <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest tracking-[0.2em]">SLIIT-FC-NODE</p>
        </div>

        <div className="flex items-center gap-2">
           <NotificationBell />
           <button className="h-11 w-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 hover:border-violet-100 transition-all shadow-sm hover:translate-y-[-2px]">
             <Activity size={20} />
           </button>
           <button className="h-11 w-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 hover:border-violet-100 transition-all shadow-sm hover:translate-y-[-2px]">
             <Grid size={20} />
           </button>
        </div>

        <div className="h-10 w-[1px] bg-slate-100 mx-2" />

        {/* Identity Token Module */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center gap-4 pl-1.5 pr-4 py-1.5 rounded-2xl bg-slate-900 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-sm font-black text-slate-900 shadow-inner group-hover:scale-105 transition-transform overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-violet-100 to-transparent" />
               <span className="relative z-10">{userInitial}</span>
            </div>
            <div className="hidden sm:block text-left text-white">
               <p className="text-[11px] font-black uppercase tracking-tighter leading-tight truncate max-w-[120px]">{userName}</p>
               <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest leading-tight italic">{userRole}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="absolute right-0 mt-5 w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-3"
              >
                <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] text-white relative overflow-hidden mb-2">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl -mr-16 -mt-16" />
                   <div className="flex items-center gap-5 mb-6 relative z-10">
                      <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20 backdrop-blur-md shadow-2xl text-2xl font-black">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-base font-black truncate tracking-tight">{userName}</p>
                        <p className="text-xs font-bold text-slate-400 truncate opacity-60 italic">{userEmail}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full w-fit">
                      <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
                      <span className="text-[9px] font-black text-violet-100 uppercase tracking-[0.3em] italic">Command Verified</span>
                   </div>
                </div>

                <div className="p-2 space-y-1">
                   {[
                     { label: 'System Preferences', icon: Settings },
                     { label: 'Activity Logs', icon: Activity },
                     { label: 'Inbox Matrix', icon: Mail }
                   ].map((item, i) => (
                     <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-violet-600 group-hover:shadow-sm transition-all">
                              <item.icon size={18} />
                           </div>
                           <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </button>
                   ))}
                   
                   <div className="h-[1px] bg-slate-100 mx-4 my-3" />
                   
                   <button 
                    onClick={handleLogout}
                    className="w-full h-16 flex items-center justify-center gap-4 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-black uppercase tracking-[0.4em] text-[10px]"
                   >
                      <LogOut size={18} />
                      Logout Unit
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
>>>>>>> development
      </div>
    </header>
  )
}
