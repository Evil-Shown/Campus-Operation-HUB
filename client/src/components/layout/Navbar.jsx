import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Search, ChevronDown, Settings, Activity, Grid, Mail } from 'lucide-react'
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
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 px-6 lg:px-10 flex items-center justify-between">
      {/* Universal Search */}
      <div className="flex items-center gap-12">
        <div className="relative group hidden lg:block">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
             <Search size={18} className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
           </div>
           <input 
              type="text" 
              placeholder="Search resources, bookings..." 
              className="bg-gray-50 border border-transparent rounded-xl pl-11 pr-5 py-2 w-[350px] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all"
           />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <NotificationBell />
           <button className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm">
             <Activity size={18} />
           </button>
           <button className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm">
             <Grid size={18} />
           </button>
        </div>

        <div className="h-6 w-[1px] bg-gray-100 mx-1" />

        {/* User Identity */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200"
          >
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white shadow-sm overflow-hidden relative">
               <span className="relative z-10">{userInitial}</span>
            </div>
            <div className="hidden sm:block text-left">
               <p className="text-xs font-semibold text-gray-900 leading-none">{userName}</p>
               <p className="text-[10px] font-medium text-gray-500 mt-0.5 leading-none">{userRole}</p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden p-2 z-50"
              >
                <div className="p-5 bg-indigo-50 rounded-xl mb-2">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                   {[
                     { label: 'Account Settings', icon: Settings },
                     { label: 'Booking History', icon: Activity },
                     { label: 'Messages', icon: Mail }
                   ].map((item, i) => (
                     <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                              <item.icon size={16} />
                           </div>
                           <span className="text-xs font-medium text-gray-700">{item.label}</span>
                        </div>
                        <ChevronDown size={12} className="-rotate-90 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                     </button>
                   ))}
                   
                   <div className="h-[1px] bg-gray-100 my-2 mx-2" />
                   
                   <button 
                    onClick={handleLogout}
                    className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-white border border-gray-100 text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-semibold text-xs"
                   >
                      <LogOut size={16} />
                      Log out
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
