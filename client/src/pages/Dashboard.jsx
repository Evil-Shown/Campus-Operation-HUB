import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Package,
  PlusCircle,
  Ticket,
  XCircle,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'

export default function Dashboard({ role }) {
  const stats = [
    { icon: Calendar, title: 'Total Bookings', value: '1,284', trend: 12, color: 'indigo' },
    { icon: Ticket, title: 'Active Tickets', value: '23', trend: -5, color: 'orange' },
    { icon: Package, title: 'Available Resources', value: '142', trend: 8, color: 'green' },
    { icon: Clock, title: 'Pending Approvals', value: '8', trend: 2, color: 'blue' },
  ]

  const recentBookings = [
    { id: 'BK-1234', resource: 'Conference Room A', user: 'John Doe', date: '2026-04-14', status: 'approved' },
    { id: 'BK-1235', resource: 'Lab 3', user: 'Jane Smith', date: '2026-04-14', status: 'pending' },
    { id: 'BK-1236', resource: 'AV Equipment', user: 'Mike Johnson', date: '2026-04-13', status: 'rejected' },
    { id: 'BK-1237', resource: 'Study Room 2', user: 'Sarah Lee', date: '2026-04-13', status: 'approved' },
  ]

  const ticketUpdates = [
    { id: 'TC-101', title: 'Projector not working', status: 'open', priority: 'high', time: '2 hours ago' },
    { id: 'TC-102', title: 'WiFi connectivity issue', status: 'resolved', priority: 'medium', time: '5 hours ago' },
    { id: 'TC-103', title: 'AC not cooling', status: 'in-progress', priority: 'high', time: '1 day ago' },
  ]

  const getStatusBadge = (status) => {
    const badges = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      open: 'bg-red-100 text-red-700',
      resolved: 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
    }

    const icons = {
      approved: <CheckCircle className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
      open: <AlertCircle className="h-3 w-3" />,
      resolved: <CheckCircle className="h-3 w-3" />,
      'in-progress': <Clock className="h-3 w-3" />,
    }

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${badges[status]}`}>
        {icons[status]}
        {status.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {role === 'admin' ? 'Admin' : 'User'}</h2>
          <p className="mt-1 text-gray-500">Here&apos;s what&apos;s happening with your campus operations today.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-indigo-700"
            type="button"
          >
            <PlusCircle className="h-4 w-4" />
            Book Resource
          </button>
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
            type="button"
          >
            <Ticket className="h-4 w-4" />
            Create Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
            <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700" type="button">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500">Booking ID</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500">Resource</th>
                  {role === 'admin' && <th className="p-4 text-left text-xs font-medium text-gray-500">User</th>}
                  <th className="p-4 text-left text-xs font-medium text-gray-500">Date</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <motion.tr
                    key={booking.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    whileHover={{ backgroundColor: '#F9FAFB' }}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="p-4 text-sm text-gray-600">{booking.resource}</td>
                    {role === 'admin' && <td className="p-4 text-sm text-gray-600">{booking.user}</td>}
                    <td className="p-4 text-sm text-gray-500">{booking.date}</td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4">
                      <button className="text-gray-400 hover:text-gray-600" type="button" aria-label="More booking actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Ticket Updates</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {ticketUpdates.map((ticket) => (
              <div key={ticket.id} className="p-4 transition-colors hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                    <p className="mt-1 text-xs text-gray-400">{ticket.time}</p>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${ticket.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-3 text-center">
            <button className="text-sm text-indigo-600 hover:text-indigo-700" type="button">
              View All Tickets
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-100"
            type="button"
          >
            <BookOpen className="h-4 w-4" />
            Book a Resource
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-100"
            type="button"
          >
            <Ticket className="h-4 w-4" />
            Create Ticket
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-100"
            type="button"
          >
            <Calendar className="h-4 w-4" />
            View All Bookings
          </button>
        </div>
      </motion.div>
    </div>
  )
}
