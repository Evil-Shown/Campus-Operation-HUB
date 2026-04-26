import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Clock, MessageCircle, XCircle, Check, Bell, RefreshCw, X } from 'lucide-react'
import { listNotifications, markAllRead, markOneRead } from '../api/notifications'
import { useAuth } from '../context/AuthContext'

function getNotificationIcon(type) {
  const icons = {
    BOOKING_PENDING_REVIEW: Bell,
    BOOKING_APPROVED: CheckCircle,
    BOOKING_REJECTED: XCircle,
    TICKET_UPDATED: MessageCircle,
    TICKET_RESOLVED: CheckCircle,
    TICKET_ASSIGNED: Bell,
    COMMENT_ADDED: MessageCircle,
  }
  return icons[type] || Bell
}

function getNotificationColor(type) {
  const colors = {
    BOOKING_PENDING_REVIEW: 'amber',
    BOOKING_APPROVED: 'emerald',
    BOOKING_REJECTED: 'rose',
    TICKET_UPDATED: 'blue',
    TICKET_RESOLVED: 'emerald',
    TICKET_ASSIGNED: 'indigo',
    COMMENT_ADDED: 'violet',
  };
  return colors[type] || 'slate';
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const { apiBaseUrl, token } = useAuth()

  useEffect(() => {
    async function fetchNotifications() {
      if (!apiBaseUrl || !token) return
      
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
  }, [apiBaseUrl, token])

  const handleMarkAsRead = async (id) => {
    try {
      await markOneRead({ baseUrl: apiBaseUrl, token, id })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead({ baseUrl: apiBaseUrl, token })
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const data = await listNotifications({ baseUrl: apiBaseUrl, token })
      setNotifications(data || [])
    } catch (error) {
      console.error('Failed to refresh notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const closeDetailsModal = () => setSelectedNotification(null)

  const handleOpenNotificationDetails = async (notification) => {
    setSelectedNotification(notification)

    if (!notification.read) {
      await handleMarkAsRead(notification.id)
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false
    if (filter === 'read' && !n.read) return false
    if (typeFilter !== 'all' && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const typeCounts = notifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Notifications</h1>
              <p className="text-gray-500 mt-1">Stay updated with your campus activities</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
              <p className="text-2xl font-black text-gray-800 mt-1">{notifications.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unread</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{unreadCount}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bookings</p>
              <p className="text-2xl font-black text-gray-800 mt-1">
                {(typeCounts.BOOKING_APPROVED || 0) + (typeCounts.BOOKING_REJECTED || 0)}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tickets</p>
              <p className="text-2xl font-black text-gray-800 mt-1">
                {(typeCounts.TICKET_UPDATED || 0) + (typeCounts.TICKET_RESOLVED || 0) + (typeCounts.TICKET_ASSIGNED || 0)}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  filter === 'unread' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  filter === 'read' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Read
              </button>
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  typeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setTypeFilter('BOOKING_APPROVED')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  typeFilter === 'BOOKING_APPROVED' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setTypeFilter('TICKET_UPDATED')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  typeFilter === 'TICKET_UPDATED' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tickets
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-wider hover:bg-indigo-100 transition-all"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">No notifications found</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif, idx) => {
              const Icon = getNotificationIcon(notif.type)
              const colorClass = getNotificationColor(notif.type)
              
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white/80 backdrop-blur-sm border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    !notif.read ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100'
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenNotificationDetails(notif)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleOpenNotificationDetails(notif)
                    }
                  }}
                >
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-xl border flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-800">{notif.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">{formatTime(notif.createdAt)}</span>
                            {!notif.read && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                                Unread
                              </span>
                            )}
                          </div>
                        </div>
                        {!notif.read && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation()
                              handleMarkAsRead(notif.id)
                            }}
                            className="flex-shrink-0 p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetailsModal}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="notification-detail-title"
              >
                <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    Notification Details
                  </p>
                  <h2 id="notification-detail-title" className="mt-1 text-xl font-black text-gray-800">
                    {selectedNotification.title}
                  </h2>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close notification details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {selectedNotification.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Type</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{selectedNotification.type || 'N/A'}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {selectedNotification.read ? 'Read' : 'Unread'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Received</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Notification ID</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{selectedNotification.id}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
