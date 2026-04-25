const rows = [
  {
    name: 'Lecture Hall A101',
    type: 'LECTURE_HALL',
    capacity: 80,
    location: 'Block A',
    status: 'ACTIVE',
  },
  {
    name: 'Computer Lab 3',
    type: 'LAB',
    capacity: 40,
    location: 'Block B',
    status: 'ACTIVE',
  },
  {
    name: 'Meeting Room 5',
    type: 'MEETING_ROOM',
    capacity: 10,
    location: 'Block C',
    status: 'OUT_OF_SERVICE',
  },
]

export default function AdminResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Resources</h1>
          <p className="text-sm text-slate-600">Create, update, and archive campus resources.</p>
        </div>
        <button type="button" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Add Resource
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-slate-100">
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.capacity}</td>
                <td className="px-4 py-3">{row.location}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                      Edit
                    </button>
                    <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
