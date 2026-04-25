// Member 2 - Booking Management
const STATUS_CONFIG = {
  APPROVED: 'bg-green-100 text-green-700 border border-green-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  REJECTED: 'bg-red-100 text-red-700 border border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border border-gray-200',
}

export default function BookingStatusBadge({ status }) {
  const classes = STATUS_CONFIG[status] || STATUS_CONFIG.CANCELLED

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  )
}
