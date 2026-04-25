import React from 'react'

function AvailabilityViewer({ bookings, selectedDate }) {
  const filteredBookings = bookings.filter(
    (b) => new Date(b.startTime).toISOString().split('T')[0] === selectedDate
  )

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Occupied Slots</h4>

      {filteredBookings.length === 0 ? (
        <p className="text-green-600 text-sm">✅ No bookings for this date — resource is free!</p>
      ) : (
        filteredBookings.map((booking) => {
          const start = new Date(booking.startTime)
          const end = new Date(booking.endTime)

          return (
            <div
              key={booking.id}
              className="flex items-center justify-between gap-2 text-sm py-1 border-b border-gray-100"
            >
              <span>
                🕐 {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} —{' '}
                {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">BOOKED</span>
            </div>
          )
        })
      )}
    </div>
  )
}

export default AvailabilityViewer
