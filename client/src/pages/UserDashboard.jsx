import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  ChevronRight,
  TrendingUp,
  Activity,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Monitor,
  BookOpen,
  Dumbbell,
  Utensils,
  Car,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StatsCard from '../components/StatsCard'
import { listMyBookings } from '../api/bookings'
import { listTickets } from '../api/tickets'
import { listResources } from '../api/resources'


function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    resolved: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    open: 'bg-rose-50 text-rose-700 border-rose-100',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-100'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium capitalize ${styles[status?.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-100'}`}>
      {status}
    </span>
  )
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHrs / 24)
  
  if (diffHrs < 1) return 'Just now'
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  })
}

function formatTimeRange(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const format = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${format(start)} - ${format(end)}`
}

export default function UserDashboard() {
  const { user, apiBaseUrl, token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState([])
  const [tickets, setTickets] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const [bookingsData, ticketsData, resourcesData] = await Promise.all([
          listMyBookings({ baseUrl: apiBaseUrl, token }).catch(e => {
            console.error('Failed to fetch bookings:', e)
            return []
          }),
          listTickets({ baseUrl: apiBaseUrl, token, scope: 'mine' }).catch(e => {
            console.error('Failed to fetch tickets:', e)
            return []
          }),
          listResources({ baseUrl: apiBaseUrl, token }).catch(e => {
            console.error('Failed to fetch resources:', e)
            return []
          })
        ])
        
        setBookings(bookingsData || [])
        setTickets(ticketsData || [])
        setResources(resourcesData || [])
      } catch (err) {
        setError(err.message)
        console.error('Dashboard data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (apiBaseUrl && token) {
      fetchData()
    }
  }, [apiBaseUrl, token])

  // Calculate resource categories dynamically
  const resourceCategories = [
    { name: 'Study Rooms', icon: BookOpen, type: 'STUDY_ROOM', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', path: '/resources?type=STUDY_ROOM' },
    { name: 'Computer Labs', icon: Monitor, type: 'COMPUTER_LAB', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', path: '/resources?type=COMPUTER_LAB' },
    { name: 'Meeting Rooms', icon: Users, type: 'MEETING_ROOM', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', path: '/resources?type=MEETING_ROOM' },
    { name: 'Lecture Halls', icon: BarChart3, type: 'LECTURE_HALL', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', path: '/resources?type=LECTURE_HALL' },
    { name: 'Equipment', icon: Cpu, type: 'EQUIPMENT', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', path: '/resources?type=EQUIPMENT' },
    { name: 'All Resources', icon: Search, type: null, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', path: '/resources' }
  ].map(cat => ({
    ...cat,
    count: cat.type ? resources.filter(r => r.type === cat.type && r.status === 'ACTIVE').length : resources.filter(r => r.status === 'ACTIVE').length
  }))

  const stats = [
    { 
      icon: Calendar, 
      title: 'Upcoming Bookings', 
      value: bookings.filter(b => new Date(b.startTime) >= new Date()).length,
      subtitle: 'in the next 7 days',
      color: 'indigo' 
    },
    { 
      icon: Clock, 
      title: 'Pending Approval', 
      value: bookings.filter(b => b.status === 'PENDING').length,
      subtitle: 'awaiting admin review',
      color: 'amber' 
    },
    { 
      icon: AlertCircle, 
      title: 'Open Tickets', 
      value: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      subtitle: 'maintenance requests',
      color: 'rose' 
    },
    { 
      icon: CheckCircle, 
      title: 'Completed Bookings', 
      value: bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.endTime) < new Date()).length,
      subtitle: 'this semester',
      color: 'emerald' 
    }
  ]

  // Get upcoming bookings (next 5)
  const upcomingBookings = bookings
    .filter(b => new Date(b.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5)
    .map(booking => ({
      id: `BK-${booking.id}`,
      resourceName: booking.resource?.name || 'Unknown Resource',
      category: booking.resource?.type?.replace('_', ' ') || 'General',
      date: formatDateTime(booking.startTime),
      time: formatTimeRange(booking.startTime, booking.endTime),
      status: booking.status?.toLowerCase() || 'pending',
      location: booking.resource?.location || 'TBD'
    }))

  // Get recent tickets (last 5)
  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(ticket => ({
      id: `TK-${ticket.id}`,
      title: ticket.title || 'Untitled Issue',
      status: ticket.status?.toLowerCase() || 'open',
      priority: ticket.priority?.toLowerCase() || 'medium',
      createdAt: formatTime(ticket.createdAt)
    }))

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="h-32 rounded-xl bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-96 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-rose-500 rounded-full" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Could not load your dashboard</h2>
          <p className="text-sm text-gray-500 mb-6">Check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SECTION 1: PAGE HEADER */}
      <header className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {greeting}, {user?.name?.split(' ')[0] || 'Operator'}
          </h1>
          <p className="text-gray-500 mt-1">
            SLIIT Smart Campus — {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/resources" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Book a Resource
          </Link>
          <Link 
            to="/tickets/new" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <AlertCircle className="w-4 h-4" />
            Report an Issue
          </Link>
        </div>
      </header>

      {/* SECTION 2: STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              <span className="text-sm font-medium text-gray-500">{stat.title}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* SECTION 3: UPCOMING BOOKINGS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming bookings</h2>
          <Link to="/bookings/my" className="text-sm text-indigo-600 font-medium hover:underline">
            View all
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {upcomingBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No upcoming bookings</p>
              <p className="text-xs text-gray-400 mt-1 mb-6">Book a resource to get started</p>
              <Link 
                to="/resources" 
                className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
              >
                Browse resources
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingBookings.map((booking) => {
                const rawId = booking.id.replace('BK-', '');
                return (
                  <Link 
                    key={booking.id} 
                    to={`/bookings/${rawId}`}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {booking.resourceName}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {booking.location}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            {booking.date} · {booking.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <div className="text-right">
                        <StatusBadge status={booking.status} />
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">#{booking.id}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tickets */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent tickets</h2>
            <Link to="/tickets" className="text-sm text-indigo-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full">
            {recentTickets.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">No tickets yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-6">Report a maintenance issue to get started</p>
                <Link 
                  to="/tickets/new" 
                  className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
                >
                  Report an issue
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentTickets.map((ticket) => {
                  const rawId = ticket.id.replace('TK-', '');
                  const priorityColor = 
                    ticket.priority === 'high' || ticket.priority === 'critical' ? 'bg-rose-500' :
                    ticket.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300';
                  
                  return (
                    <Link 
                      key={ticket.id} 
                      to={`/tickets/${rawId}`}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${priorityColor}`} />
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {ticket.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            #{ticket.id} · {ticket.createdAt}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={ticket.status} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { to: '/resources', icon: Calendar, color: 'indigo', title: 'Book a resource', desc: 'Rooms, labs, equipment' },
              { to: '/tickets/new', icon: AlertCircle, color: 'rose', title: 'Report an issue', desc: 'Maintenance & incidents' },
              { to: '/bookings/my', icon: Clock, color: 'amber', title: 'My bookings', desc: 'View and manage your reservations' },
              { to: '/tickets', icon: Activity, color: 'emerald', title: 'My tickets', desc: 'Track your support requests' },
            ].map((action, i) => (
              <Link 
                key={i} 
                to={action.to}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-50 flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* SECTION 5: BROWSE RESOURCES */}
      <section className="space-y-6 pt-12 border-t border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Browse by resource type</h2>
          <p className="text-sm text-gray-400 mt-1">Select a category to view available resources</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {resourceCategories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center group hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${cat.bg} border ${cat.border} group-hover:scale-105 transition-transform`}>
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.count} available</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
