import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTicket } from '../../api/tickets'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function TicketCreatePage() {
  const navigate = useNavigate()
  const { apiBaseUrl, token, user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    resourceId: '',
    category: 'OTHER',
    description: '',
    priority: 'MEDIUM',
    contactInfo: user?.email || '',
  })
  const [files, setFiles] = useState([])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!token) {
      setError('Please sign in first')
      return
    }
    if (form.description.trim().length < 10) {
      setError('Description must be at least 10 characters')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        resourceId: form.resourceId ? Number(form.resourceId) : null,
        category: form.category,
        description: form.description.trim(),
        priority: form.priority,
        contactInfo: form.contactInfo.trim(),
      }
      const created = await createTicket({ baseUrl: apiBaseUrl, token, data: payload, files })
      navigate(`/tickets/${created.id}`)
    } catch (err) {
      setError(err?.message || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
        <p className="text-sm text-slate-600">Submit a new incident ticket with key details.</p>
      </div>

      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Resource ID (optional)</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.resourceId}
            onChange={(e) => setForm((prev) => ({ ...prev, resourceId: e.target.value.replace(/[^\d]/g, '') }))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description (min 10 chars)</label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.priority}
            onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Contact info</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={form.contactInfo}
            onChange={(e) => setForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Attach images (max 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 3))}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Image preview area</p>
          {files.length ? (
            <ul className="space-y-1 text-xs text-slate-600">
              {files.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
              ))}
            </ul>
          ) : (
            <div className="h-12 rounded bg-slate-100" />
          )}
        </div>

        {error ? <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  )
}
