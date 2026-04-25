import React from 'react'
import StatusBadge from './StatusBadge'

function BookingCard({ booking, onCancel, onApprove, onReject }) {
  const start = new Date(booking.startTime)
  const end = new Date(booking.endTime)

  const showCancel = onCancel && (booking.status === 'PENDING' || booking.status === 'APPROVED')
  const showAdminActions = booking.status === 'PENDING'

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 border border-gray-100 hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{booking.resourceName}</h3>
        <p className="text-sm text-gray-500 mt-1">📍 {booking.resourceLocation}</p>
      </div>

      <div className="text-sm text-gray-700">
        <p>{start.toLocaleDateString()}</p>
        <p>
          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} —{' '}
          {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {booking.attendees !== null && booking.attendees !== undefined && (
        <p className="text-sm text-gray-700">👥 {booking.attendees} attendees</p>
      )}

      {booking.purpose && <p className="text-sm text-gray-500 italic">{booking.purpose}</p>}

      <div>
        <StatusBadge status={booking.status} />
        {booking.status === 'REJECTED' && booking.rejectReason && (
          <p className="text-red-600 text-sm mt-1">Reason: {booking.rejectReason}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {showCancel && (
          <button
            type="button"
            className="text-sm text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50"
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        )}

        {onApprove && showAdminActions && (
          <button
            type="button"
            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={() => onApprove(booking.id)}
          >
            Approve
          </button>
        )}

        {onReject && showAdminActions && (
          <button
            type="button"
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={() => onReject(booking.id)}
          >
            Reject
          </button>
        )}
      </div>
    </div>
  )
}

export default BookingCard
