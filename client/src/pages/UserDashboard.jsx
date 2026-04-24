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
    confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm',
    pending: 'bg-amber-100 text-amber-700 border-amber-200 shadow-sm',
    resolved: 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm',
    open: 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${status === 'confirmed' || status === 'resolved' ? 'bg-current animate-pulse' : 'bg-current opacity-50'}`} />
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
    { name: 'Study Rooms', icon: BookOpen, action: 'ACADEMIC_STUDY', count: resources.filter(r => r.type === 'STUDY_ROOM').length, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { name: 'Computer Labs', icon: Monitor, action: 'TECH_WORKSTATION', count: resources.filter(r => r.type === 'COMPUTER_LAB').length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { name: 'Meeting Rooms', icon: Users, action: 'COLLAB_CENTER', count: resources.filter(r => r.type === 'MEETING_ROOM').length, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
    { name: 'Gym Facilities', icon: Dumbbell, action: 'WELLNESS_NODE', count: resources.filter(r => r.type === 'GYM').length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { name: 'Cafeteria', icon: Utensils, action: 'ENERGY_CORE', count: resources.filter(r => r.type === 'CAFETERIA').length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { name: 'Parking', icon: Car, action: 'LOGISTICS_ZONE', count: resources.filter(r => r.type === 'PARKING').length, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100' }
  ]

  // Calculate stats dynamically
  const activeReservations = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length
  const pendingSupport = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length

  const stats = [
    { icon: Calendar, title: 'Active Reservations', value: activeReservations.toString().padStart(2, '0'), trend: 12, color: 'primary' },
    { icon: ShieldCheck, title: 'Identity Status', value: 'Verified', trend: 100, color: 'blue' },
    { icon: Activity, title: 'Pending Support', value: pendingSupport.toString().padStart(2, '0'), trend: -5, color: 'orange' },
    { icon: Database, title: 'Allocated Storage', value: '42GB', trend: 8, color: 'indigo' },
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 space-y-10 animate-in fade-in duration-1000 pb-10 p-6 lg:p-8">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/30 shadow-xl p-8 lg:p-12 group">
        <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-indigo-100/40 to-transparent pointer-events-none rounded-r-[2rem]" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200/40 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
            >
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Secure Personal Portal</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black text-gray-800 leading-[1] mb-6 tracking-tight uppercase"
            >
              Great to see you, <br />
              <span className="text-indigo-600 font-black">{user?.name?.split(' ')[0] || 'Operator'}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 font-medium text-xl max-w-lg leading-relaxed italic"
            >
              Streamlining institutional workflows with intelligent automation and real-time operational insights.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:w-[480px]">
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} delay={0.3 + (i * 0.1)} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-indigo-500 rounded-full" />
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Active Schedule Matrix</h3>
            </div>
            <Link to="/bookings/my" className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all">
              Initialize View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-5">
            {upcomingBookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-indigo-100 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-indigo-200/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
                      <div className="relative h-16 w-16 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 shadow-sm">
                        <BookOpen className="w-8 h-8 text-indigo-600 group-hover:text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest italic">{booking.category}</span>
                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">Ref: {booking.id}</span>
                      </div>
                      <h4 className="text-xl font-black text-gray-800 uppercase tracking-tight">{booking.resourceName}</h4>
                      <p className="text-xs font-bold text-gray-500 flex items-center gap-2 mt-1 italic">
                        <MapPin className="w-4 h-4 text-indigo-500" /> {booking.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-800 flex items-center gap-2 justify-end mb-1 uppercase tracking-wider">
                        <Calendar className="w-4 h-4 text-indigo-500" /> {booking.date}
                      </p>
                      <p className="text-[10px] font-black text-gray-500 flex items-center gap-2 justify-end uppercase tracking-[0.1em]">
                        <Clock className="w-4 h-4 text-gray-400" /> {booking.time}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm hover:shadow-md">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sentinel Section */}
        <div className="space-y-6">
          <div className="px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-rose-500 rounded-full" />
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Support Sentinel</h3>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/40 blur-3xl -mr-16 -mt-16" />

            <div className="relative p-8 space-y-8">
              {recentTickets.map((ticket, idx) => (
                <div key={ticket.id} className="group relative pl-6 border-l-2 border-gray-100 hover:border-indigo-300 transition-all duration-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1.5 text-left text-left">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest italic leading-none">Security Node {ticket.id}</p>
                      <h5 className="text-sm font-black text-gray-800 tracking-widest uppercase group-hover:text-indigo-600 transition-colors line-clamp-1">{ticket.title}</h5>
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${ticket.priority === 'high' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'} animate-pulse`} />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <StatusBadge status={ticket.status} />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{ticket.createdAt}</span>
                  </div>
                </div>
              ))}
              <button className="w-full h-14 rounded-xl bg-gray-50/80 border border-gray-200 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm mt-4">
                Initialize Protocol
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <section className="space-y-6 pt-6">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-amber-500 rounded-full" />
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Global Asset Directory</h3>
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="bg-white/80 backdrop-blur border border-gray-200 focus:border-indigo-300 rounded-xl pl-11 pr-5 h-11 text-xs font-bold uppercase tracking-widest focus:outline-none transition-all w-64 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 px-1">
          {resourceCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center group cursor-pointer hover:shadow-xl transition-all duration-500"
            >
              <div className={`h-16 w-16 rounded-xl border ${cat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <cat.icon className={`w-8 h-8 ${cat.color} transition-colors`} />
              </div>
              <p className="text-[8px] font-black text-gray-400 mb-1 uppercase tracking-widest italic">{cat.action}</p>
              <h6 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">{cat.name}</h6>
              <div className="mt-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.1em]">{cat.count} ACTIVE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
