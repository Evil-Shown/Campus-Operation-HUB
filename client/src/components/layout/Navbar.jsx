import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Clock, Search, ChevronDown, Mail, ShieldCheck } from 'lucide-react'
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
      {logoutMessage && (
        <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-6 py-3">
          <Clock className="w-4 h-4 text-orange-600" />
          <p className="text-sm text-orange-800">{logoutMessage}</p>
        </div>
      )}

      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-6 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations Center</p>
          <p className="text-lg font-semibold text-slate-900">Smart Campus</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources, users, tickets"
              className="w-64 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <NotificationBell />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-sm font-semibold text-white">
                {userInitial}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 px-4 py-4 text-white">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">User Account</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-sm font-semibold ring-1 ring-white/30">
                      {userInitial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{userName}</p>
                      <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Active Session
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-100 px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="max-w-[220px] truncate">{userEmail}</span>
                  </div>
                </div>

                <div className="p-2">
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
