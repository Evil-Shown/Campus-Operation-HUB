import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import BookingCard from '../../components/bookings/BookingCard'

const filterOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get('/bookings/my')
        setBookings(response.data)
      } catch (err) {
        setError('Failed to load your bookings.')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  const filteredBookings =
    filter === 'ALL' ? bookings : bookings.filter((booking) => booking.status === filter)

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`)
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status: 'CANCELLED' } : booking))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-16 text-gray-600">
          <span className="animate-spin border-2 border-gray-400 border-t-transparent rounded-full w-6 h-6 mb-3" />
          <p>Loading your bookings...</p>
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
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <Link
          to="/bookings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + New Booking
        </Link>
      </div>

      <p className="text-gray-500 mb-6">Track and manage your facility booking requests</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={
              filter === option
                ? 'bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium'
                : 'bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm hover:bg-gray-200'
            }
          >
            {option}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl">📅</div>
          <p className="text-gray-500 mt-2">No bookings found.</p>
          {filter === 'ALL' && (
            <Link to="/bookings/new" className="text-blue-600 hover:underline text-sm mt-1 inline-block">
              Make your first booking →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
