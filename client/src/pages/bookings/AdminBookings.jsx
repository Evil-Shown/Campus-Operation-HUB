import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import BookingCard from '../../components/bookings/BookingCard'

function AdminBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'ROLE_ADMIN') {
      navigate('/dashboard')
      return
    }

    const loadPendingBookings = async () => {
      try {
        const response = await api.get('/bookings?status=PENDING')
        setBookings(response.data)
      } catch (err) {
        setError('Failed to load pending bookings.')
      } finally {
        setLoading(false)
      }
    }

    loadPendingBookings()
  }, [navigate])

  const handleApprove = async (id) => {
    try {
      await api.patch(`/bookings/${id}/approve`)
      setBookings((prev) => prev.filter((booking) => booking.id !== id))
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Could not approve — a conflicting booking exists.')
      } else {
        alert(err.response?.data?.message || 'Failed to approve booking.')
      }
    }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason (optional):')
    if (reason === null) {
      return
    }

    try {
      const query = reason.trim() ? `?reason=${encodeURIComponent(reason)}` : ''
      await api.patch(`/bookings/${id}/reject${query}`)
      setBookings((prev) => prev.filter((booking) => booking.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-16 text-gray-600">
          <span className="animate-spin border-2 border-gray-400 border-t-transparent rounded-full w-6 h-6 mb-3" />
          <p>Loading pending bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600 text-center py-8">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Pending Approvals</h1>
        {bookings.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
            {bookings.length} pending
          </span>
        )}
      </div>

      <p className="text-gray-500 mb-6">Review and action pending booking requests</p>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl">✅</div>
          <p className="text-xl font-semibold text-gray-700 mt-3">All caught up!</p>
          <p className="text-gray-500 mt-1">No pending bookings to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminBookings
