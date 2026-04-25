import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Package,
  CalendarClock,
  AlertCircle,
  Users,
  CheckCircle2,
  Activity,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAdminDashboardData } from '../../api/admin'

function StatusPill({ status }) {
  const map = {
    PENDING:     'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    CONFIRMED:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED:    'bg-red-50 text-red-700 border-red-200',
    CANCELLED:   'bg-gray-100 text-gray-500 border-gray-200',
    OPEN:        'bg-rose-50 text-rose-700 border-rose-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    RESOLVED:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED:      'bg-gray-100 text-gray-500 border-gray-200',
    CRITICAL:    'bg-red-50 text-red-700 border-red-200',
    HIGH:        'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM:      'bg-amber-50 text-amber-700 border-amber-200',
    LOW:         'bg-gray-100 text-gray-600 border-gray-200',
  }
  const style = map[status?.toUpperCase()] || 'bg-gray-100 text-gray-500 border-gray-200'
  return (
    <span className={`inline-flex items-center border rounded-md px-2 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

export default function AdminDashboardPage() {
  const { apiBaseUrl, token } = useAuth()
  const [data, setData] = useState({ resources: [], bookings: [], tickets: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getAdminDashboardData({ baseUrl: apiBaseUrl, token })
      setData(result)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [apiBaseUrl, token])

  // Calculate metrics from actual data
  const pendingBookings = data.bookings.filter(b => b.status === 'PENDING').length
  const openTickets = data.tickets.filter(t => t.status === 'OPEN').length
  const criticalTickets = data.tickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length

  const metrics = [
    {
      label: 'Total resources',
      value: data.resources.length,
      subtitle: 'in the catalogue',
      icon: Package,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Pending bookings',
      value: pendingBookings,
      subtitle: 'awaiting your approval',
      icon: CalendarClock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Open tickets',
      value: openTickets,
      subtitle: 'need attention',
      icon: AlertCircle,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      label: 'Critical issues',
      value: criticalTickets,
      subtitle: 'high or critical priority',
      icon: Activity,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  // Get recent bookings (last 5)
  const recentBookings = data.bookings
    .sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime))
    .slice(0, 5)
    .map(booking => ({
      item: booking.resourceName || booking.resource?.name || 'Unknown Resource',
      user: booking.userName || booking.user?.name || 'Unknown User',
      time: booking.startTime ? new Date(booking.startTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A',
      status: booking.status,
    }))

  // Get recent tickets (last 5 open or in_progress)
  const recentTickets = data.tickets
    .filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(ticket => ({
      id: `#TK-${ticket.id.toString().padStart(3, '0')}`,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
    }))

  // Calculate utilization by resource type
  const resourcesByType = data.resources.reduce((acc, r) => {
    const type = r.type || 'OTHER'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const totalResources = data.resources.length || 1
  const utilization = Object.entries(resourcesByType)
    .map(([label, count]) => ({
      label: label.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      value: Math.round((count / totalResources) * 100),
    }))
    .slice(0, 3)

  if (utilization.length === 0) {
    utilization.push(
      { label: 'Resources', value: 0 },
      { label: 'Utilization', value: 0 },
      { label: 'Capacity', value: 0 }
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1: PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh data
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all shadow-sm">
            <FileText className="h-4 w-4" />
            Export report
          </button>
        </div>
      </div>

      {/* SECTION 2: METRICS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
              </div>
              <div className={`${metric.iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900">Recent bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Requested by</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & time</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentBookings.length > 0 ? (
                  recentBookings.map((row) => (
                    <tr key={`${row.item}-${row.user}-${row.time}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.item}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.time}</td>
                      <td className="px-6 py-4 text-right">
                        <StatusPill status={row.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <CalendarClock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No bookings yet</p>
                      <p className="text-xs text-gray-400 mt-1">Booking requests will appear here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resource Breakdown Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Resources by type</h2>
          <div className="space-y-6">
            {utilization.map((item, idx) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="h-full rounded-full bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-6 pt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-bold text-gray-900">{data.resources.filter(r => r.status === 'ACTIVE').length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Active resources</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{data.resources.filter(r => r.status === 'OUT_OF_SERVICE').length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Out of service</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: BOTTOM GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Open Tickets Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-gray-900">Open tickets</h2>
              {openTickets > 0 && (
                <span className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
                  {openTickets} active
                </span>
              )}
            </div>
            <Link to="/admin/tickets" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentTickets.length > 0 ? (
                  recentTickets.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-indigo-600">{row.id}</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5 truncate max-w-[220px]">{row.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={row.priority} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusPill status={row.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">No open tickets</p>
                      <p className="text-xs text-gray-400 mt-1">All issues have been resolved</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick actions</h2>
          <div className="space-y-3">
            <Link to="/admin/bookings?status=PENDING" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Review pending bookings</p>
                <p className="text-xs text-gray-400 mt-0.5">{pendingBookings} requests waiting</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/admin/tickets?status=OPEN" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Manage open tickets</p>
                <p className="text-xs text-gray-400 mt-0.5">{openTickets} tickets need attention</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/admin/resources/new" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Add new resource</p>
                <p className="text-xs text-gray-400 mt-0.5">Register a room, lab, or equipment</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/admin/resources" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Search className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Browse all resources</p>
                <p className="text-xs text-gray-400 mt-0.5">{data.resources.length} resources in catalogue</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
