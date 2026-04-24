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

          <div className="hidden md:flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all group">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Command search..."
              className="w-48 lg:w-80 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none font-medium"
            />
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-200 border border-gray-300 text-[9px] font-black text-gray-500">
              <span className="opacity-70">CMD</span>
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Activity className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-200 mx-2" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-all"
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-100 text-sm font-black text-white shadow-xl ring-2 ring-transparent group-hover:ring-indigo-300 transition-all">
                  {userInitial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-gray-800 leading-tight truncate max-w-[120px] uppercase tracking-tighter">{userName}</p>
                <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mt-0.5">{userRole}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "circOut" }}
                  className="absolute right-0 mt-4 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-50 px-2 py-2"
                >
                  <div className="relative rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 p-6 text-white overflow-hidden mb-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-black ring-1 ring-white/20 backdrop-blur-md shadow-2xl">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-base font-black truncate tracking-tight">{userName}</p>
                        <p className="text-xs text-white/50 truncate font-medium">{userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-100/20 border border-emerald-200/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      SECURE COMMAND ACCESS
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all group">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        Operator Profile
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all group">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4" />
                        Operation Logs
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-black text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-widest"
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
