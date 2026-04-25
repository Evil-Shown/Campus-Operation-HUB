import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import NotificationDropdown from '../NotificationDropdown'
import { getUnreadCount } from '../../api/notifications'
import { useAuth } from '../../context/AuthContext'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { apiBaseUrl, token } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const data = await getUnreadCount({ baseUrl: apiBaseUrl, token })
        setUnreadCount(data?.count || 0)
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    }

    if (apiBaseUrl && token) {
      fetchUnreadCount()
    }
  }, [apiBaseUrl, token])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} onMarkRead={() => setUnreadCount(0)} />
    </div>
  )
}
