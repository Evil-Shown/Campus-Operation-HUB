import Badge from '../../components/common/Badge'

const comments = [
  {
    author: 'Nimal Perera',
    date: '2026-04-20',
    text: 'Technician has been notified and will inspect soon.',
  },
  {
    author: 'Helpdesk Team',
    date: '2026-04-21',
    text: 'Spare projector requested from inventory.',
  },
]

const details = [
  { label: 'Category', value: 'IT_EQUIPMENT' },
  { label: 'Priority', value: 'HIGH' },
  { label: 'Reported by', value: 'Student A' },
  { label: 'Assigned to', value: 'Maintenance Team' },
  { label: 'Created at', value: '2026-04-20 09:30' },
]

export default function TicketDetailPage() {
  return (
    <div className="space-y-6">
      <button type="button" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
        Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">#1 — Projector not working</h1>
        <Badge text="OPEN" color="yellow" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Details</p>
        <div className="space-y-2">
          {details.map((item) => (
            <div key={item.label} className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-sm font-medium text-slate-600">{item.label}</span>
              <span className="text-sm text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">Description</p>
        <p className="text-sm text-slate-600">Projector in Computer Lab 3 does not power on during morning sessions.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">Attachments</p>
        <div className="flex gap-3">
          <div className="h-24 w-24 rounded bg-slate-200" />
          <div className="h-24 w-24 rounded bg-slate-200" />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Comments</p>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={`${comment.author}-${comment.date}`} className="rounded-md bg-slate-50 p-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{comment.author}</span>
                <span>{comment.date}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700">{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <textarea rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Add a comment..." />
          <button type="button" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Add Comment
          </button>
        </div>
      </div>
    </div>
  )
}
