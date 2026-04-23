import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createTicket, listTickets } from '../api/tickets'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

function formatDate(value) {
  if (!value) {
    return '—'
  }
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString()
}

function StatusPill({ status }) {
  const styles = {
    OPEN: 'bg-blue-50 text-blue-700 ring-blue-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    CLOSED: 'bg-slate-100 text-slate-700 ring-slate-200',
    REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {status || '—'}
    </span>
  )
}

export default function TicketsPage() {
  const { apiBaseUrl, token, user } = useAuth()
  const [scope, setScope] = useState(user?.role === 'leader' ? 'all' : 'mine')
  const [statusFilter, setStatusFilter] = useState('')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState({
    resourceId: '',
    category: 'OTHER',
    description: '',
    priority: 'MEDIUM',
    contactInfo: user?.email || '',
  })
  const [files, setFiles] = useState([])

  const canSeeAll = user?.role === 'leader'
  const canCreate = Boolean(token)

  const query = useMemo(
    () => ({
      scope: canSeeAll ? scope : 'mine',
      status: statusFilter || undefined,
    }),
    [canSeeAll, scope, statusFilter],
  )

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError('')
      try {
        const data = await listTickets({
          baseUrl: apiBaseUrl,
          token,
          scope: query.scope,
          status: query.status,
        })
        if (!ignore) {
          setTickets(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Failed to load tickets')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    run()
    return () => {
      ignore = true
    }
  }, [apiBaseUrl, token, query.scope, query.status])

  const submitNewTicket = async (e) => {
    e.preventDefault()
    if (!canCreate) {
      return
    }

    setCreating(true)
    setCreateError('')
    try {
      const payload = {
        resourceId: form.resourceId ? Number(form.resourceId) : null,
        category: form.category,
        description: form.description.trim(),
        priority: form.priority,
        contactInfo: form.contactInfo.trim(),
      }

      const created = await createTicket({
        baseUrl: apiBaseUrl,
        token,
        data: payload,
        files,
      })

      setTickets((prev) => [created, ...prev])
      setCreateOpen(false)
      setForm((prev) => ({
        ...prev,
        resourceId: '',
        category: 'OTHER',
        description: '',
        priority: 'MEDIUM',
      }))
      setFiles([])
    } catch (err) {
      setCreateError(err?.message || 'Failed to create ticket')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Maintenance tickets</h1>
          <p className="mt-1 text-sm text-slate-600">Report issues, attach evidence, and track resolution status.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canSeeAll ? (
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              aria-label="Ticket scope"
            >
              <option value="all">All tickets</option>
              <option value="mine">My tickets</option>
            </select>
          ) : null}

          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Status filter"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => setCreateOpen(true)}
            disabled={!canCreate}
          >
            New ticket
          </button>
        </div>
      </div>

      {createOpen ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create ticket</h2>
              <p className="mt-1 text-sm text-slate-600">Attach up to 3 images (PNG/JPG). Description must be at least 10 characters.</p>
            </div>
            <button type="button" className="text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setCreateOpen(false)}>
              Close
            </button>
          </div>

          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={submitNewTicket}>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Category
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Priority
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Resource ID (optional)
              <input
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
                inputMode="numeric"
                value={form.resourceId}
                onChange={(e) => setForm((prev) => ({ ...prev, resourceId: e.target.value.replace(/[^\d]/g, '') }))}
                placeholder="e.g. 12"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Contact info
              <input
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
                value={form.contactInfo}
                onChange={(e) => setForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
                placeholder="Email or phone"
              />
            </label>

            <label className="md:col-span-2 grid gap-1 text-sm font-medium text-slate-700">
              Description
              <textarea
                className="min-h-[110px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the issue (min 10 characters)"
              />
            </label>

            <label className="md:col-span-2 grid gap-1 text-sm font-medium text-slate-700">
              Attach images (max 3)
              <input
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []).slice(0, 3)
                  setFiles(selected)
                }}
              />
              {files.length ? <span className="text-xs font-normal text-slate-500">{files.length} file(s) selected</span> : null}
            </label>

            {createError ? <p className="md:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{createError}</p> : null}

            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating…' : 'Create ticket'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Tickets</div>

        {loading ? <div className="px-4 py-10 text-center text-sm text-slate-600">Loading tickets…</div> : null}
        {error ? <div className="px-4 py-4 text-sm text-rose-700">{error}</div> : null}

        {!loading && !error && tickets.length === 0 ? <div className="px-4 py-10 text-center text-sm text-slate-600">No tickets found.</div> : null}

        {!loading && !error && tickets.length ? (
          <ul className="divide-y divide-slate-200">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/tickets/${ticket.id}`} className="font-semibold text-slate-900 hover:underline">
                        Ticket #{ticket.id}
                      </Link>
                      <StatusPill status={ticket.status} />
                      <span className="text-xs font-semibold text-slate-500">{ticket.priority}</span>
                      <span className="text-xs text-slate-400">{ticket.category}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{ticket.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                      {ticket.reporter?.email ? <span>Reporter: {ticket.reporter.email}</span> : null}
                      {ticket.assignee?.email ? <span>Assignee: {ticket.assignee.email}</span> : null}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-slate-500">
                    {ticket.attachmentPaths?.length ? <span>{ticket.attachmentPaths.length} attachment(s)</span> : <span>No attachments</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

