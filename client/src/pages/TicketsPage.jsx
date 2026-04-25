import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText, 
  X,
  Camera,
  Layers,
  Activity,
  ShieldCheck
} from 'lucide-react'
import { createTicket, listTickets } from '../api/tickets'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

function formatDate(value) {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusPill({ status }) {
  const styles = {
    OPEN: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    IN_PROGRESS: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
    RESOLVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    CLOSED: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    REJECTED: 'bg-rose-900/10 text-rose-900 border-rose-900/20',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.CLOSED}`}>
      {status}
    </span>
  )
}

export default function TicketsPage() {
  const { apiBaseUrl, token, user } = useAuth()
  const role = String(user?.role || '').toUpperCase()
  const canSeeAll = role === 'ADMIN' || role === 'TECHNICIAN' || role === 'LEADER' || role === 'ROLE_ADMIN'
  const [scope, setScope] = useState(canSeeAll ? 'all' : 'mine')
  const [statusFilter, setStatusFilter] = useState('')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const MotionLi = motion.li

  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [form, setForm] = useState({
    resourceDetails: '',
    category: 'OTHER',
    description: '',
    priority: 'MEDIUM',
    contactInfo: user?.email || '',
  })
  const [files, setFiles] = useState([])
  const isDescriptionValid = form.description.trim().length >= 10

  const canCreate = Boolean(token)

  const query = useMemo(() => ({
    scope: canSeeAll ? scope : 'mine',
    status: statusFilter || undefined,
  }), [canSeeAll, scope, statusFilter])

  useEffect(() => {
    // Keep scope aligned with role once user/auth state is fully loaded.
    setScope((prev) => {
      if (canSeeAll && prev === 'mine') return 'all'
      if (!canSeeAll && prev !== 'mine') return 'mine'
      return prev
    })
  }, [canSeeAll])

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      try {
        const data = await listTickets({
          baseUrl: apiBaseUrl,
          token,
          scope: query.scope,
          status: query.status,
        })
        if (!ignore) setTickets(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!ignore) setError(err?.message || 'Protocol failure during ticket retrieval')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [apiBaseUrl, token, query.scope, query.status])

  const submitNewTicket = async (e) => {
    e.preventDefault()
    if (!canCreate) return
    if (!form.resourceDetails.trim()) {
      setCreateError('Resource or location is required')
      return
    }
    setCreating(true)
    setCreateError('')
    try {
      const payload = {
        resourceId: null,
        resourceLocation: form.resourceDetails.trim(),
        category: form.category,
        description: form.description.trim(),
        priority: form.priority,
        contactInfo: form.contactInfo.trim(),
      }
      const created = await createTicket({ baseUrl: apiBaseUrl, token, data: payload, files })
      setTickets((prev) => [created, ...prev])
      setCreateOpen(false)
      setForm({ resourceDetails: '', category: 'OTHER', description: '', priority: 'MEDIUM', contactInfo: user?.email || '' })
      setFiles([])
    } catch (err) {
      setCreateError(err?.message || 'Ticket neutralization failed')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-2 gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-rose-500/10 border border-rose-500/20 shadow-lg shadow-rose-500/5">
            <Activity className="h-8 w-8 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">Tickets</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Maintenance tickets</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Report issues, track status, and collaborate with comments and attachments.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 p-1 backdrop-blur dark:border-white/10 dark:bg-white/5">
            {canSeeAll && (
              <select
                className="bg-transparent px-3 py-2 text-sm font-medium text-slate-700 outline-none dark:text-slate-200 border-r border-slate-200 dark:border-white/10"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="all">Global Queue</option>
                <option value="mine">Personal Only</option>
              </select>
            )}
            <select
              className="bg-transparent px-4 py-2 text-sm font-medium text-slate-700 outline-none dark:text-slate-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            disabled={!canCreate}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Incident
          </button>
        </div>
      </section>

      {/* Create Modal Simulation */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card !bg-white/90 dark:!bg-slate-900/90 backdrop-blur-2xl border-primary-500/30 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create ticket</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provide a clear description and optionally attach photos.</p>
                </div>
              </div>
              <button 
                onClick={() => setCreateOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={submitNewTicket} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Category
                  </label>
                  <select
                    className="input-field bg-white dark:bg-slate-950 font-medium"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Priority
                  </label>
                  <select
                    className="input-field bg-white dark:bg-slate-950 font-medium"
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Resource and Location <span className="font-normal text-slate-500 dark:text-slate-400">(optional)</span>
                  </label>
                  <input
                    className="input-field bg-white dark:bg-slate-950 font-medium"
                    placeholder="e.g. Lab Projector - Block B Room 204"
                    value={form.resourceDetails}
                    onChange={(e) => setForm((prev) => ({ ...prev, resourceDetails: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Description <span className="font-normal text-slate-500 dark:text-slate-400">(min 10 characters)</span>
                  </label>
                  <textarea
                    className="input-field h-[155px] resize-none bg-white dark:bg-slate-950 font-medium"
                    placeholder="Describe the issue (min 10 characters)…"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Preferred contact details
                  </label>
                  <input
                    className="input-field bg-white dark:bg-slate-950 font-medium"
                    placeholder="Email or phone number"
                    value={form.contactInfo}
                    onChange={(e) => setForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-[1.5rem] bg-primary-500/5 border border-primary-500/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/20 text-primary-500">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Attachments</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Attach up to 3 images.</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="evidence-upload"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files || []).slice(0, 3)
                      setFiles(selected)
                    }}
                  />
                  <label 
                    htmlFor="evidence-upload"
                    className="btn-secondary !py-2 !px-4 text-sm cursor-pointer"
                  >
                    Choose files
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="flex gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg border border-white/5 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <FileText className="w-3 h-3" /> {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {createError && (
                <div className="md:col-span-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {createError}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
                <button 
                  type="button" 
                  onClick={() => setCreateOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !isDescriptionValid}
                  className="btn-primary disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Create ticket'}
                </button>
              </div>
              {!isDescriptionValid ? (
                <p className="md:col-span-2 text-xs font-medium text-amber-700">
                  Description must be at least 10 characters.
                </p>
              ) : null}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Terminal List */}
      <section className="glass-card !p-0 overflow-hidden border-white/5">
        <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ticket list</h3>
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing {tickets.length} ticket(s)
          </div>
        </div>

        {error ? (
          <div className="px-6 py-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Activity className="w-10 h-10 text-primary-500 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Scanning Data Streams...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-24 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No tickets found</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try adjusting the filters, or create a new ticket.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {tickets.map((ticket, idx) => (
              <MotionLi 
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Link to={`/tickets/${ticket.id}`} className="block p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">#{ticket.id}</span>
                        <StatusPill status={ticket.status} />
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          ticket.priority === 'CRITICAL' ? 'border-rose-500/30 text-rose-500' :
                          ticket.priority === 'HIGH' ? 'border-amber-500/30 text-amber-500' :
                          'border-slate-300 text-slate-500 dark:border-white/10 dark:text-slate-300'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                          {ticket.category}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-lg group-hover:text-primary-600 transition-colors line-clamp-1 truncate">
                        {ticket.description}
                      </h4>
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Created {formatDate(ticket.createdAt)}</span>
                        {ticket.reporter?.email && <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> Reporter: {ticket.reporter.name || ticket.reporter.email}</span>}
                        {ticket.assignee?.email && <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Assignee: {ticket.assignee.name || ticket.assignee.email}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-8 pl-6 border-l border-slate-100 dark:border-white/5">
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Attachments</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{ticket.attachmentPaths?.length || 0}</p>
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/5 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all text-slate-400 shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionLi>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

