import React from 'react'

const statusClassMap = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

function StatusBadge({ status }) {
  const colorClass = statusClassMap[status] || 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  )
}

export default StatusBadge
