import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, MessageCircle, XCircle, Check, Bell, Filter, Trash2, RefreshCw } from 'lucide-react'
import { listNotifications, markAllRead, markOneRead } from '../api/notifications'
import { useAuth } from '../context/AuthContext'

function getNotificationIcon(type) {
  const icons = {
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
    BOOKING_APPROVED: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    BOOKING_REJECTED: 'text-rose-500 bg-rose-50 border-rose-200',
    TICKET_UPDATED: 'text-blue-500 bg-blue-50 border-blue-200',
    TICKET_RESOLVED: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    TICKET_ASSIGNED: 'text-indigo-500 bg-indigo-50 border-indigo-200',
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all')
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
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead({ baseUrl: apiBaseUrl, token })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
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
                  className={`bg-white/80 backdrop-blur-sm border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${
                    !notif.read ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100'
                  }`}
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
                            onClick={() => handleMarkAsRead(notif.id)}
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
    </div>
  )
}
