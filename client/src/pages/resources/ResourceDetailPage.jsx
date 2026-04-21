export default function ResourceDetailPage() {
  const resource = {
    name: 'Computer Lab 3',
    type: 'LAB',
    capacity: 40,
    location: 'Block B',
    status: 'ACTIVE',
    availability: 'Weekdays 08:00 - 17:00',
  }

  const rows = [
    { label: 'Type', value: resource.type },
    { label: 'Capacity', value: resource.capacity },
    { label: 'Location', value: resource.location },
    { label: 'Status', value: resource.status },
    { label: 'Availability', value: resource.availability },
  ]

  return (
    <div className="space-y-5">
      <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{resource.name}</h1>
        <p className="text-sm text-slate-600">Detailed view of the selected resource and booking metadata.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-sm font-medium text-slate-600">{row.label}</span>
              <span className="text-sm text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
        Book this resource
      </button>
    </div>
  )
}
