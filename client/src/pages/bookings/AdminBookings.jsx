import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import BookingStatusBadge from '../../components/bookings/BookingStatusBadge'
import bookingService from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'

const AdminBookings = () => {
  // Member 2 - Booking Management
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')
  const [resourceId, setResourceId] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    if (authLoading || user?.role !== 'ADMIN') return
    setLoading(true)
    bookingService
      .getAllBookings({
        ...(status ? { status } : {}),
        ...(date ? { date } : {}),
        ...(resourceId ? { resourceId: Number(resourceId) } : {}),
      })
      .then((res) => setBookings(res.data || []))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [authLoading, user?.role, status, date, resourceId])

  if (authLoading) {
    return <div className="flex items-center justify-center py-16 text-sm text-gray-500">Loading...</div>
  }
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  const handleApprove = async (id) => {
    const note = window.prompt('Optional approval note:')
    if (note === null) return
    try {
      await bookingService.approveBooking(id, note)
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'APPROVED', adminReviewNote: note } : b)))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking.')
    }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason (required):')
    if (reason === null || !reason.trim()) return
    try {
      await bookingService.rejectBooking(id, reason.trim())
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'REJECTED', adminReviewNote: reason.trim() } : b)))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking.')
    }
  }

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize))
  const paginated = bookings.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Booking Dashboard</h1>
        <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-0.5 text-sm font-semibold text-yellow-700">
          {bookings.length} results
        </span>
      </div>
      <p className="mb-5 text-sm text-gray-500">Review, approve, or reject booking requests.</p>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1) }} className="rounded-lg border px-3 py-2 text-sm" />
        <input type="number" placeholder="Resource ID" value={resourceId} onChange={(e) => { setResourceId(e.target.value); setPage(1) }} className="rounded-lg border px-3 py-2 text-sm" />
      </div>

      {loading && <div className="py-16 text-center text-sm text-gray-500">Loading bookings...</div>}
      {error && <div className="py-8 text-center text-red-600">{error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="py-20 text-center text-gray-500">No bookings found for current filters.</div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Booking</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Resource</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Requested By</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Date & Time</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold text-gray-800">BK-{b.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-700">{b.resourceName}</div>
                    <div className="text-xs text-gray-400">📍 {b.resourceLocation}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{b.userName}</td>
                  <td className="px-5 py-4 text-gray-600">
                    <div>{b.bookingDate}</div>
                    <div className="text-xs text-gray-400">{b.startTime} - {b.endTime}</div>
                  </td>
                  <td className="px-5 py-4"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/bookings/${b.id}`} className="text-xs text-blue-600 hover:underline">Details</Link>
                      {b.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(b.id)} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700">Approve</button>
                          <button onClick={() => handleReject(b.id)} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-3">
            <button disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded border px-3 py-1 text-xs disabled:opacity-40">Prev</button>
            <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="rounded border px-3 py-1 text-xs disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings
