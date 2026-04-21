const tickets = [
  {
    id: '#1',
    category: 'IT_EQUIPMENT',
    description: 'Projector not working',
    priority: 'HIGH',
    status: 'OPEN',
    date: '2026-04-20',
  },
  {
    id: '#2',
    category: 'ELECTRICAL',
    description: 'Flickering lights',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    date: '2026-04-19',
  },
]

export default function TicketListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incident Tickets</h1>
          <p className="text-sm text-slate-600">View and track reported campus incidents.</p>
        </div>
        <button type="button" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Report an Issue
        </button>
      </div>

      <div className="w-full max-w-xs">
        <label className="mb-1 block text-sm font-medium text-slate-700">Filter by status</label>
        <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600">
          <option>All statuses (placeholder)</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{ticket.id}</td>
                <td className="px-4 py-3">{ticket.category}</td>
                <td className="px-4 py-3">{ticket.description}</td>
                <td className="px-4 py-3">{ticket.priority}</td>
                <td className="px-4 py-3">{ticket.status}</td>
                <td className="px-4 py-3">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
