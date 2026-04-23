import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Bell,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Star,
  TrendingUp,
  Activity,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Wifi,
  Coffee,
  Car,
  Monitor,
  BookOpen,
  Dumbbell,
  Utensils
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Motion = motion

const resourceCategories = [
  { name: 'Study Rooms', icon: BookOpen, color: 'indigo', count: 12 },
  { name: 'Computer Labs', icon: Monitor, color: 'blue', count: 8 },
  { name: 'Meeting Rooms', icon: Users, color: 'green', count: 6 },
  { name: 'Gym Facilities', icon: Dumbbell, color: 'orange', count: 4 },
  { name: 'Cafeteria', icon: Utensils, color: 'purple', count: 3 },
  { name: 'Parking', icon: Car, color: 'gray', count: 2 }
]

const upcomingBookings = [
  {
    id: 'BK-2024-001',
    resourceName: 'Study Room A-204',
    category: 'Study Rooms',
    date: '2026-04-24',
    time: '10:00 AM - 12:00 PM',
    status: 'confirmed',
    location: 'Building A, Floor 2'
  },
  {
    id: 'BK-2024-002',
    resourceName: 'Computer Lab 3',
    category: 'Computer Labs',
    date: '2026-04-25',
    time: '2:00 PM - 4:00 PM',
    status: 'pending',
    location: 'Building B, Floor 1'
  },
  {
    id: 'BK-2024-003',
    resourceName: 'Meeting Room C-101',
    category: 'Meeting Rooms',
    date: '2026-04-26',
    time: '9:00 AM - 11:00 AM',
    status: 'confirmed',
    location: 'Building C, Floor 1'
  }
]

const recentTickets = [
  {
    id: 'TK-2024-001',
    title: 'WiFi connectivity issues in Study Room A-204',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2026-04-20',
    resolvedAt: '2026-04-21'
  },
  {
    id: 'TK-2024-002',
    title: 'Projector not working in Meeting Room C-101',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2026-04-22',
    resolvedAt: null
  },
  {
    id: 'TK-2024-003',
    title: 'Air conditioning not working in Computer Lab 3',
    status: 'open',
    priority: 'high',
    createdAt: '2026-04-23',
    resolvedAt: null
  }
]

const quickActions = [
  { title: 'Book a Resource', icon: Calendar, color: 'indigo', href: '/resources' },
  { title: 'My Bookings', icon: Clock, color: 'blue', href: '/bookings/my' },
  { title: 'Create Ticket', icon: FileText, color: 'green', href: '/tickets/new' },
  { title: 'View Resources', icon: Search, color: 'purple', href: '/resources' }
]

const notifications = [
  {
    id: 1,
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking for Study Room A-204 has been confirmed',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'ticket',
    title: 'Ticket Updated',
    message: 'Your WiFi issue ticket has been resolved',
    time: '5 hours ago',
    read: false
  },
  {
    id: 3,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on April 25, 2026',
    time: '1 day ago',
    read: true
  }
]

function StatCard({ title, value, change, icon: Icon, color }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-100 border-indigo-200 text-indigo-900',
    blue: 'from-blue-500/20 to-blue-100 border-blue-200 text-blue-900',
    green: 'from-green-500/20 to-green-100 border-green-200 text-green-900',
    orange: 'from-orange-500/20 to-orange-100 border-orange-200 text-orange-900',
    purple: 'from-purple-500/20 to-purple-100 border-purple-200 text-purple-900'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`rounded-2xl border bg-gradient-to-b p-4 shadow-sm ${colors[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        <div className="rounded-xl bg-white/60 p-2">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {change && (
        <div className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1 text-xs font-semibold">
          {change > 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
          )}
          {Math.abs(change)}% from last month
        </div>
      )}
    </motion.div>
  )
}

function StatusBadge({ status }) {
  const variants = {
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    open: 'bg-red-100 text-red-700 border-red-200',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
    resolved: 'bg-green-100 text-green-700 border-green-200'
  }

  const icons = {
    confirmed: <CheckCircle className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    cancelled: <XCircle className="h-3 w-3" />,
    open: <AlertCircle className="h-3 w-3" />,
    'in-progress': <Activity className="h-3 w-3" />,
    resolved: <CheckCircle className="h-3 w-3" />
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${variants[status]}`}>
      {icons[status]}
      {status.toUpperCase()}
    </span>
  )
}

function NotificationItem({ notification }) {
  const icons = {
    booking: <Calendar className="h-4 w-4" />,
    ticket: <FileText className="h-4 w-4" />,
    system: <Settings className="h-4 w-4" />
  }

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex gap-3 p-3 rounded-lg transition-colors ${notification.read ? 'bg-white' : 'bg-indigo-50 border-l-4 border-indigo-500'}`}
    >
      <div className={`rounded-full p-2 ${notification.read ? 'bg-gray-100' : 'bg-indigo-100'}`}>
        <div className={notification.read ? 'text-gray-600' : 'text-indigo-600'}>
          {icons[notification.type]}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
      </div>
    </motion.div>
  )
}

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const stats = [
    { title: 'Active Bookings', value: '3', change: 25, icon: Calendar, color: 'indigo' },
    { title: 'Open Tickets', value: '2', change: -10, icon: FileText, color: 'orange' },
    { title: 'Resources Used', value: '24', change: 15, icon: TrendingUp, color: 'green' },
    { title: 'This Month', value: '18', change: 8, icon: BarChart3, color: 'blue' }
  ]

  const filteredBookings = upcomingBookings.filter(booking =>
    booking.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h2>
                <p className="text-indigo-100">
                  Here's what's happening with your campus bookings and activities today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{stats[0].value}</p>
                    <p className="text-sm text-indigo-100">Active Bookings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={action.href}
                  className={`bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 block`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-3`}>
                    <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{booking.resourceName}</h4>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {booking.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {booking.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Tickets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
                  <Link to="/tickets" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <StatusBadge status={ticket.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {ticket.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {ticket.priority.toUpperCase()} • Created {ticket.createdAt}
                        </p>
                        {ticket.resolvedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Resolved {ticket.resolvedAt}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Resource Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 flex items-center justify-center mb-3`}>
                  <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                </div>
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500 mt-1">{category.count} available</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
