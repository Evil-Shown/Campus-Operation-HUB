import Badge from '../../components/common/Badge'

const rows = [
  {
    resource: 'Computer Lab 3',
    date: '2026-05-01',
    time: '09:00-11:00',
    purpose: 'Project work',
    status: 'PENDING',
    action: 'Cancel',
  },
  {
    resource: 'Lecture Hall A101',
    date: '2026-04-28',
    time: '14:00-16:00',
    purpose: 'Group study',
    status: 'APPROVED',
    action: '',
  },
]

const statusColors = {
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
}

export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-sm text-slate-600">Track booking requests and their current approval status.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.resource}-${row.date}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{row.resource}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3">{row.time}</td>
                <td className="px-4 py-3">{row.purpose}</td>
                <td className="px-4 py-3">
                  <Badge text={row.status} color={statusColors[row.status]} />
                </td>
                <td className="px-4 py-3">
                  {row.action ? (
                    <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                      {row.action}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
