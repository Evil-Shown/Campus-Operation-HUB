const resources = [
  {
    id: 1,
    name: 'Lecture Hall A101',
    type: 'LECTURE_HALL',
    capacity: 80,
    location: 'Block A',
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Computer Lab 3',
    type: 'LAB',
    capacity: 40,
    location: 'Block B',
    status: 'ACTIVE',
  },
  {
    id: 3,
    name: 'Meeting Room 5',
    type: 'MEETING_ROOM',
    capacity: 10,
    location: 'Block C',
    status: 'OUT_OF_SERVICE',
  },
]

export default function ResourceListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resources</h1>
        <p className="text-sm text-slate-600">Browse available campus resources and view key details.</p>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search resources..."
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <select className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600">
          <option>Type (placeholder)</option>
        </select>
        <select className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600">
          <option>Location (placeholder)</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <div key={resource.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{resource.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Type: {resource.type}</p>
            <p className="text-sm text-slate-600">Capacity: {resource.capacity}</p>
            <p className="text-sm text-slate-600">Location: {resource.location}</p>
            <p className="text-sm text-slate-600">Status: {resource.status}</p>
            <button
              type="button"
              className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
