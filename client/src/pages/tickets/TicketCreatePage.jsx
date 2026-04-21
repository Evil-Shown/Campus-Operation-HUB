export default function TicketCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
        <p className="text-sm text-slate-600">Submit a new incident ticket with key details.</p>
      </div>

      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option>ELECTRICAL</option>
            <option>PLUMBING</option>
            <option>IT_EQUIPMENT</option>
            <option>FURNITURE</option>
            <option>OTHER</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Resource/Location</label>
          <input type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description (min 10 chars)</label>
          <textarea rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
            <option>CRITICAL</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Contact info</label>
          <input type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Attach images (max 3)</label>
          <input type="file" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Image preview area</p>
          <div className="flex gap-3">
            <div className="h-20 w-20 rounded bg-slate-200" />
            <div className="h-20 w-20 rounded bg-slate-200" />
            <div className="h-20 w-20 rounded bg-slate-200" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.alert('Not connected yet')}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Submit Report
        </button>
      </form>
    </div>
  )
}
