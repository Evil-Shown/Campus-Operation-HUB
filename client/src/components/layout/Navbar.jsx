import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, User, Clock, Search, ChevronDown, Mail, ShieldCheck, School, Settings, Bell, Zap, Activity } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')
  const menuRef = useRef(null)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const userName = user?.name || 'Campus Operator'
  const userEmail = user?.email || 'operator@smartcampus.local'
  const userInitial = userName.charAt(0).toUpperCase()
  const userRole = user?.role || 'OPERATOR'

  useEffect(() => {
    const message = sessionStorage.getItem('logoutMessage')
    if (message) {
      setLogoutMessage(message)
      sessionStorage.removeItem('logoutMessage')
      const timer = setTimeout(() => setLogoutMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [])

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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#020617]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <School className="text-primary-400 h-6 w-6" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase transition-colors group-hover:text-primary-500">
                Smart<span className="text-primary-500 group-hover:text-white">Campus</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-0.5">Ops Terminal</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/50 px-4 py-2 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/50 transition-all group">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500" />
            <input
              type="text"
              placeholder="Command search..."
              className="w-48 lg:w-80 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none font-medium"
            />
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[9px] font-black text-slate-500">
              <span className="opacity-70">CMD</span>
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 hover:bg-primary-500/5 rounded-xl transition-all">
              <Activity className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary-500 hover:bg-primary-500/5 rounded-xl transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 text-sm font-black text-white shadow-xl ring-2 ring-transparent group-hover:ring-primary-500/50 transition-all">
                  {userInitial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#020617] bg-emerald-500 shadow-sm" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-[120px] uppercase tracking-tighter">{userName}</p>
                <p className="text-[9px] text-primary-500 font-black uppercase tracking-widest mt-0.5">{userRole}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "circOut" }}
                  className="absolute right-0 mt-4 w-80 overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0f1a] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] z-50 px-2 py-2"
                >
                  <div className="relative rounded-[1.2rem] bg-gradient-to-br from-slate-900 to-[#1e1b4b] p-6 text-white overflow-hidden mb-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-black ring-1 ring-white/20 backdrop-blur-md shadow-2xl">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-base font-black truncate tracking-tight">{userName}</p>
                        <p className="text-xs text-white/50 truncate font-medium">{userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      SECURE COMMAND ACCESS
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        Operator Profile
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4" />
                        Operation Logs
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all uppercase tracking-widest"
                    >
                      <LogOut className="w-4 h-4" />
                      Terminate Link
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {logoutMessage && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500 text-white text-center py-2 text-xs font-black uppercase tracking-[0.2em] shadow-lg"
          >
            {logoutMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ChevronRight(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
