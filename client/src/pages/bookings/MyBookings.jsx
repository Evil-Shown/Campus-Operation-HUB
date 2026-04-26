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
    const loader = isAdmin ? bookingService.getAllBookings : bookingService.getMyBookings

    loader()
      .then((res) => setBookings(res.data || []))
      .catch(() => setError(isAdmin ? 'Failed to load bookings.' : 'Failed to load your bookings.'))
      .finally(() => setLoading(false))
  }, [isAdmin])

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

  const formatDate = (date) => {
    const parsed = date ? new Date(date) : null
    if (!parsed || Number.isNaN(parsed.getTime())) return 'N/A'
    return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const actionBtn = 'rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm'

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-bounce duration-300">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 backdrop-blur-md px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-sm font-medium text-emerald-800 flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
            {toast}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {isAdmin ? 'Booking Management' : 'My Bookings'}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            {isAdmin
              ? 'Review and manage all booking requests across users'
              : 'Manage and track all your facility reservations in one place'}
          </p>
        </div>
        <Link
          to="/bookings/new"
          className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgb(99,102,241,0.25)] flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          <span>New Booking</span>
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2.5 mb-8 flex-wrap">
        {FILTERS.map((f) => {
          const isActive = filter === f;
          const count = f === 'ALL' ? bookings.length : bookings.filter((b) => b.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300
                ${isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
            >
              {f}
              <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative">
            <div className="animate-spin border-4 border-indigo-100 border-t-indigo-600 rounded-full w-12 h-12 box-border" />
            <div className="absolute inset-0 border-4 border-transparent rounded-full animate-pulse" />
          </div>
          <span className="mt-4 text-slate-500 font-medium text-sm animate-pulse">
            Fetching reservations...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center text-rose-600 shadow-sm">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm font-medium hover:underline text-rose-700">Try again</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm text-center py-20 px-4 shadow-sm">
          <div className="text-6xl mb-6 opacity-80 mix-blend-luminosity">✨</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No bookings found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            {filter === "ALL"
              ? "You haven't made any reservations yet. Start exploring available facilities."
              : `You don't have any ${filter.toLowerCase()} bookings at the moment.`}
          </p>
          {filter === "ALL" && (
            <Link
              to="/bookings/new"
              className="mt-6 text-indigo-600 hover:text-indigo-700 font-semibold text-sm inline-flex items-center gap-2 group transition-colors"
            >
              Make your first booking
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>
      )}

      {/* Table & Cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="animate-in fade-in duration-500">
          <div className="hidden md:block bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">ID</th>
                  <th className="px-6 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Resource</th>
                  <th className="px-6 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Date & Time</th>
                  <th className="px-6 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase">Status</th>
                  <th className="px-6 py-4 text-slate-500 font-semibold text-xs tracking-wider uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="group hover:bg-slate-50/60 transition-colors duration-200"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800 bg-slate-100 inline-block px-2.5 py-1 rounded-md text-xs">
                        BK-{b.id}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-800 mb-0.5">{b.resourceName}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {b.resourceLocation}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-slate-700">{formatDate(b.bookingDate)}</div>
                      <div className="text-slate-400 text-xs font-mono mt-0.5">
                        {b.startTimeOnly || b.startTime} - {b.endTimeOnly || b.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-1.5">
                        <BookingStatusBadge status={b.status} />
                        {b.status === 'REJECTED' && b.adminReviewNote && (
                          <div className="text-rose-500/80 text-[11px] font-medium italic max-w-[150px] truncate" title={b.adminReviewNote}>
                            "{b.adminReviewNote}"
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 justify-end items-center">
                        {isAdmin && b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(b.id)}
                              className={`${actionBtn} bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(b.id)}
                              className={`${actionBtn} bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className={`${actionBtn} bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:text-rose-800`}
                          >
                            Cancel
                          </button>
                        )}
                        <Link
                          to={`/bookings/${b.id}`}
                          className={`${actionBtn} bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300`}
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-4 relative overflow-hidden">
                {/* Decorative side accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${b.status === 'APPROVED' ? 'bg-emerald-400' : b.status === 'PENDING' ? 'bg-amber-400' : b.status === 'REJECTED' ? 'bg-rose-400' : 'bg-slate-300'}`} />

                <div className="flex items-center justify-between pl-2">
                  <div className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                    BK-{b.id}
                  </div>
                  <BookingStatusBadge status={b.status} />
                </div>

                <div className="pl-2">
                  <h3 className="text-base font-bold text-slate-800">{b.resourceName}</h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {b.resourceLocation}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 pl-4 border border-slate-100 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Date</span>
                    <span className="font-medium text-slate-700">{formatDate(b.bookingDate)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Time</span>
                    <span className="font-mono text-slate-600 text-xs">
                      {b.startTimeOnly || b.startTime} - {b.endTimeOnly || b.endTime}
                    </span>
                  </div>
                </div>

                {b.status === 'REJECTED' && b.adminReviewNote && (
                  <div className="pl-2 mt-[-0.5rem]">
                    <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-2.5 text-xs text-rose-600 flex gap-2">
                      <span className="text-rose-500">ℹ️</span>
                      <span className="italic leading-relaxed">{b.adminReviewNote}</span>
                    </div>
                  </div>
                )}

                <div className="pl-2 pt-2 flex gap-2.5 flex-wrap">
                  {isAdmin && b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(b.id)}
                        className={`${actionBtn} flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(b.id)}
                        className={`${actionBtn} flex-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className={`${actionBtn} flex-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100`}
                    >
                      Cancel
                    </button>
                  )}
                  <Link
                    to={`/bookings/${b.id}`}
                    className={`${actionBtn} flex-1 text-center bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
