import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BookingStatusBadge from '../../components/bookings/BookingStatusBadge'
import bookingService from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']

const MyBookings = () => {
  // Member 2 - Booking Management
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    bookingService
      .getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch(() => setError('Failed to load your bookings.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filtered = useMemo(
    () => (filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  )

  const handleCancel = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this booking?')) return
      await bookingService.cancelBooking(id)
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED', adminReviewNote: '' } : b)),
      )
      setToast('Booking cancelled successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.')
    }
  }

  const handleApprove = async (id) => {
    try {
      const noteInput = window.prompt('Enter approval note (optional):')
      if (noteInput === null) return
      const note = noteInput.trim()
      await bookingService.approveBooking(id, note)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'APPROVED', adminReviewNote: note } : b,
        ),
      )
      setToast('Booking approved successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve booking.')
    }
  }

  const handleReject = async (id) => {
    try {
      const reasonInput = window.prompt('Enter rejection reason (required):')
      if (!reasonInput || !reasonInput.trim()) return
      const reason = reasonInput.trim()
      await bookingService.rejectBooking(id, reason)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'REJECTED', adminReviewNote: reason } : b,
        ),
      )
      setToast('Booking rejected successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking.')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const actionBtn = 'rounded-md px-2.5 py-1 text-xs font-medium transition-colors'

  return (
    <div className="max-w-5xl mx-auto p-6">
      {toast && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage your facility booking requests
          </p>
        </div>
        <Link
          to="/bookings/new"
          className="bg-purple-600 hover:bg-purple-700 text-white 
            text-sm font-medium px-4 py-2 rounded-xl 
            transition-colors flex items-center gap-2"
        >
          + New Booking
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mt-5 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium 
              transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {f}
            {f !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bookings.filter((b) => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin border-4 border-purple-600 
            border-t-transparent rounded-full w-8 h-8" />
          <span className="ml-3 text-gray-500 text-sm">
            Loading your bookings...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 text-center py-8">{error}</div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-gray-500 text-sm">No bookings found.</p>
          {filter === "ALL" && (
            <Link
              to="/bookings/new"
              className="text-purple-600 hover:underline text-sm mt-2 
                inline-block"
            >
              Make your first booking →
            </Link>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Booking ID</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Resource</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Time</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      i === filtered.length - 1 ? 'border-0' : ''
                    }`}
                  >
                    <td className="px-5 py-4 font-semibold text-gray-800">BK-{b.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-700">{b.resourceName}</div>
                      <div className="text-gray-400 text-xs">📍 {b.resourceLocation}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(b.bookingDate)}</td>
                    <td className="px-5 py-4 text-gray-600">{b.startTime} - {b.endTime}</td>
                    <td className="px-5 py-4">
                      <BookingStatusBadge status={b.status} />
                      {b.status === 'REJECTED' && b.adminReviewNote && (
                        <div className="text-red-500 text-xs mt-1">{b.adminReviewNote}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 flex-wrap items-center">
                        <Link
                          to={`/bookings/${b.id}`}
                          className={`${actionBtn} border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
                        >
                          Details
                        </Link>
                        {isAdmin && b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(b.id)}
                              className={`${actionBtn} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(b.id)}
                              className={`${actionBtn} border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className={`${actionBtn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-gray-800">BK-{b.id}</p>
                  <BookingStatusBadge status={b.status} />
                </div>
                <p className="text-sm font-medium text-gray-700">{b.resourceName}</p>
                <p className="text-xs text-gray-500">📍 {b.resourceLocation}</p>
                <p className="mt-2 text-sm text-gray-600">{formatDate(b.bookingDate)} | {b.startTime} - {b.endTime}</p>
                {b.status === 'REJECTED' && b.adminReviewNote && (
                  <p className="mt-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600">
                    Reason: {b.adminReviewNote}
                  </p>
                )}
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Link
                    to={`/bookings/${b.id}`}
                    className={`${actionBtn} border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
                  >
                    Details
                  </Link>
                  {isAdmin && b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(b.id)}
                        className={`${actionBtn} border border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(b.id)}
                        className={`${actionBtn} border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className={`${actionBtn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MyBookings
