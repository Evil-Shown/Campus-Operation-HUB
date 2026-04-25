export default function BookingFormPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Request a Booking</h1>
        <p className="text-sm text-slate-600">Submit a booking request for a selected resource.</p>
      </div>

      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Resource name</label>
          <input
            type="text"
            value="Computer Lab 3"
            readOnly
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
            <input type="date" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Start time</label>
            <input type="time" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">End time</label>
            <input type="time" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Purpose</label>
          <textarea rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Number of attendees</label>
          <input type="number" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <button
          type="button"
          onClick={() => window.alert('Not connected yet')}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Submit Request
        </button>
      </form>
    </div>
  )
}
