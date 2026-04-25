import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Clock, MessageCircle, XCircle, Check, ExternalLink, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { listNotifications, markAllRead, markOneRead } from '../api/notifications'
import { useAuth } from '../context/AuthContext'

function getNotificationIcon(type) {
  const icons = {
    BOOKING_APPROVED: CheckCircle,
    BOOKING_REJECTED: XCircle,
    TICKET_STATUS_CHANGED: MessageCircle,
    TICKET_COMMENT_ADDED: MessageCircle,
    TICKET_UPDATED: MessageCircle,
    COMMENT_ADDED: MessageCircle,
  }
  return icons[type] || Bell
}

function getNotificationColor(type) {
  const colors = {
    BOOKING_APPROVED: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    BOOKING_REJECTED: 'text-rose-500 bg-rose-50 border-rose-200',
    TICKET_STATUS_CHANGED: 'text-blue-500 bg-blue-50 border-blue-200',
    TICKET_COMMENT_ADDED: 'text-purple-500 bg-purple-50 border-purple-200',
    TICKET_UPDATED: 'text-blue-500 bg-blue-50 border-blue-200',
    COMMENT_ADDED: 'text-purple-500 bg-purple-50 border-purple-200',
  }
  return colors[type] || 'text-gray-500 bg-gray-50 border-gray-200'
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHrs / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NotificationDropdown({ isOpen, onClose, onMarkRead, onUnreadCountChange }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const { apiBaseUrl, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchNotifications() {
      if (!isOpen || !apiBaseUrl || !token) return
      
      try {
        setLoading(true)
        const data = await listNotifications({ baseUrl: apiBaseUrl, token })
        setNotifications(data || [])
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [isOpen, apiBaseUrl, token])

  const handleMarkAsRead = async (id) => {
    try {
      await markOneRead({ baseUrl: apiBaseUrl, token, id })
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        const nextUnread = updated.filter((n) => !n.read).length
        onUnreadCountChange?.(nextUnread)
        if (nextUnread === 0) {
          onMarkRead?.()
        }
        return updated
      })
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead({ baseUrl: apiBaseUrl, token })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      onUnreadCountChange?.(0)
      if (onMarkRead) {
        onMarkRead()
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleViewAll = () => {
    navigate('/notifications')
    onClose()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl z-40"
          >
            <div className="border-b border-gray-100 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-gray-500 mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notif) => {
                  const Icon = getNotificationIcon(notif.type)
                  const colorClass = getNotificationColor(notif.type)
                  
                  return (
                    <div
                      key={notif.id}
                      className={`cursor-pointer border-b border-gray-50 p-4 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => {
                        if (!notif.read) {
                          handleMarkAsRead(notif.id)
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-xl border flex items-center justify-center ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-gray-800 truncate">{notif.title}</p>
                            {!notif.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notif.id)
                                }}
                                className="flex-shrink-0 p-1 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-[10px] text-gray-400">{formatTime(notif.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            
            <div className="border-t border-gray-100 p-3">
              <button
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
              >
                View All Notifications
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
