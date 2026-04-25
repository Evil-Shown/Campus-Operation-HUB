import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BookingStatusBadge from '../../components/bookings/BookingStatusBadge'
import bookingService from '../../services/bookingService'

export default function BookingDetail() {
  // Member 2 - Booking Management
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    bookingService
      .getBookingById(id)
      .then((res) => setBooking(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load booking'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading booking details...</div>
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>
  if (!booking) return <div className="p-6 text-sm text-gray-500">Booking not found.</div>

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Booking Detail</h1>
        <button onClick={() => navigate(-1)} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Back</button>
      </div>
      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Status</span>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p><span className="font-medium">Resource:</span> {booking.resourceName} ({booking.resourceLocation})</p>
        <p><span className="font-medium">Requested by:</span> {booking.userName}</p>
        <p><span className="font-medium">Date:</span> {booking.bookingDate}</p>
        <p><span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}</p>
        <p><span className="font-medium">Purpose:</span> {booking.purpose}</p>
        <p><span className="font-medium">Expected attendees:</span> {booking.expectedAttendees}</p>
        {booking.adminReviewNote && <p><span className="font-medium">Admin note:</span> {booking.adminReviewNote}</p>}
        {booking.reviewedByName && <p><span className="font-medium">Reviewed by:</span> {booking.reviewedByName}</p>}
      </div>
      <div className="mt-4">
        <Link to="/bookings/my" className="text-sm text-purple-600 hover:underline">Go to My Bookings</Link>
      </div>
    </div>
  )
}
