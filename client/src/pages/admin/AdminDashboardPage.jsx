const metrics = [
  { label: 'Total Resources', value: 12 },
  { label: 'Pending Bookings', value: 5 },
  { label: 'Open Tickets', value: 8 },
  { label: 'Total Users', value: 34 },
]

const recentBookings = [
  { item: 'Computer Lab 3', user: 'User A', time: '2026-05-01 09:00' },
  { item: 'Lecture Hall A101', user: 'User B', time: '2026-04-28 14:00' },
  { item: 'Meeting Room 5', user: 'User C', time: '2026-04-29 10:00' },
]

const recentTickets = [
  { id: '#1', title: 'Projector not working', status: 'OPEN' },
  { id: '#2', title: 'Flickering lights', status: 'IN_PROGRESS' },
  { id: '#3', title: 'Leaking tap', status: 'OPEN' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Overview of resources, bookings, tickets, and users.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Bookings</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-700">
              <tr>
                <th className="py-2">Resource</th>
                <th className="py-2">User</th>
                <th className="py-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((row) => (
                <tr key={`${row.item}-${row.user}`} className="border-t border-slate-100">
                  <td className="py-2">{row.item}</td>
                  <td className="py-2">{row.user}</td>
                  <td className="py-2">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Tickets</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-700">
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Issue</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="py-2">{row.id}</td>
                  <td className="py-2">{row.title}</td>
                  <td className="py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
