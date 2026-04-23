import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, User, Clock, Search, ChevronDown, Mail, ShieldCheck, GraduationCap, Settings, Bell } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')
  const menuRef = useRef(null)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const userName = user?.name || 'Campus User'
  const userEmail = user?.email || 'user@smartcampus.local'
  const userInitial = userName.charAt(0).toUpperCase()

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
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="text-white h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">SmartCampus</p>
              <p className="text-[10px] uppercase tracking-widest text-primary-500 font-bold">Ops Hub</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-48 lg:w-64 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <NotificationBell />
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 text-sm font-bold text-primary-600 dark:text-primary-400 ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all">
                  {userInitial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">{userName}</p>
                <p className="text-[10px] text-slate-500 font-medium">Standard User</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl z-50"
              >
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-5 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-bold ring-2 ring-white/30 backdrop-blur-sm">
                      {userInitial}
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[160px]">{userName}</p>
                      <p className="text-xs text-white/70 truncate max-w-[160px]">{userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Institution Account
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <Clock className="w-4 h-4" />
                    Recent Activity
                  </button>
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-white/5 capitalize">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>
      {logoutMessage && (
        <div className="bg-amber-500 text-white text-center py-2 text-xs font-bold animate-pulse">
          {logoutMessage}
        </div>
      )}
    </>
  )
}
