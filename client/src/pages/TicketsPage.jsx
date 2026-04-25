import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, AlertCircle, Clock, ChevronRight, FileText,
  X, Camera, Search, Filter, Loader2, InboxIcon,
  User, ShieldCheck, Paperclip, Ticket,
} from 'lucide-react'
import { createTicket, listTickets } from '../api/tickets'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'OTHER']
const PRIORITIES  = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const STATUSES    = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

function formatDate(v) {
  if (!v) return '—'
  return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusPill({ s }) {
  const cls = { OPEN: 'status-open', IN_PROGRESS: 'status-in-progress', RESOLVED: 'status-resolved', CLOSED: 'status-closed', REJECTED: 'status-rejected' }[s] || 'status-closed'
  return (
    <div className={`status-pill ${cls}`}>
      <span className="status-dot" />
      {s.replace('_',' ')}
    </div>
  )
}

function PriorityBars({ p }) {
  const levels = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }[p] || 1
  const color = { CRITICAL: 'text-rose-500', HIGH: 'text-amber-500', MEDIUM: 'text-blue-500', LOW: 'text-slate-400' }[p]
  return (
    <div className={`priority-bars ${color}`} title={`Priority: ${p}`}>
      {[1, 2, 3, 4].map(num => (
        <div key={num} className={`priority-bar ${num <= levels ? 'active h-full' : 'h-1/2'}`} />
      ))}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
      <div className="skeleton w-10 h-4 rounded" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton w-16 h-5 rounded-full" />
        <div className="skeleton w-10 h-5 rounded-full" />
      </div>
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────
function Field({ label, required, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
        {hint && <span className="ml-1.5 text-xs font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </motion.p>
      )}
    </div>
  )
}

export default function TicketsPage() {
  const { apiBaseUrl, token, user } = useAuth()
  const role = String(user?.role || '').toUpperCase()
  const canSeeAll = ['ADMIN','TECHNICIAN','LEADER','ROLE_ADMIN'].includes(role)

  const [scope, setScope]             = useState(canSeeAll ? 'all' : 'mine')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch]           = useState('')
  const [tickets, setTickets]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [createOpen, setCreateOpen]   = useState(false)
  const [creating, setCreating]       = useState(false)
  const [createError, setCreateError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState({ resourceDetails: '', category: 'OTHER', description: '', priority: 'MEDIUM', contactInfo: user?.email || '' })
  const [files, setFiles] = useState([])

  const isDescriptionValid = form.description.trim().length >= 10
  const canCreate = Boolean(token)
  const query = useMemo(() => ({ scope: canSeeAll ? scope : 'mine', status: statusFilter || undefined }), [canSeeAll, scope, statusFilter])

  useEffect(() => { setScope(p => canSeeAll ? (p === 'mine' ? 'all' : p) : 'mine') }, [canSeeAll])

  useEffect(() => {
    let ignore = false
    setLoading(true); setError('')
    listTickets({ baseUrl: apiBaseUrl, token, scope: query.scope, status: query.status })
      .then(d => { if (!ignore) setTickets(Array.isArray(d) ? d : []) })
      .catch(e => { if (!ignore) setError(e?.message || 'Failed to load tickets') })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [apiBaseUrl, token, query.scope, query.status])

  const submitNewTicket = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.resourceDetails.trim()) errs.resourceDetails = 'Required'
    if (!isDescriptionValid) errs.description = `${form.description.trim().length}/10 characters minimum`
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setFieldErrors({}); setCreating(true); setCreateError('')
    try {
      const created = await createTicket({ baseUrl: apiBaseUrl, token, data: { resourceId: null, resourceLocation: form.resourceDetails.trim(), category: form.category, description: form.description.trim(), priority: form.priority, contactInfo: form.contactInfo.trim() }, files })
      setTickets(p => [created, ...p])
      setCreateOpen(false)
      setForm({ resourceDetails: '', category: 'OTHER', description: '', priority: 'MEDIUM', contactInfo: user?.email || '' })
      setFiles([])
    } catch (err) { setCreateError(err?.message || 'Failed to create ticket') }
    finally { setCreating(false) }
  }

  const filtered = tickets.filter(t =>
    !search || t.description?.toLowerCase().includes(search.toLowerCase()) || String(t.id).includes(search)
  )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Support</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Maintenance Tickets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track and resolve facility issues across campus.</p>
        </div>
        {canCreate && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setCreateOpen(true)}
            className="btn-primary shrink-0"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </motion.button>
        )}
      </div>

      {/* ── Filters ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search tickets…" value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {canSeeAll && (
            <select className="input-field !py-2 !px-3 !w-auto" value={scope} onChange={e => setScope(e.target.value)}>
              <option value="all">All Tickets</option>
              <option value="mine">My Tickets</option>
            </select>
          )}
          <select className="input-field !py-2 !px-3 !w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
        </div>
      </motion.div>

      {/* ── Create Modal ── */}
      <AnimatePresence>
        {createOpen && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setCreateOpen(false)} />
            <motion.div key="modal" initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-refined shadow-2xl">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">New Ticket</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Describe the issue and submit</p>
                    </div>
                  </div>
                  <button onClick={() => setCreateOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={submitNewTicket} className="px-6 py-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Category" required>
                      <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                      </select>
                    </Field>
                    <Field label="Priority" required>
                      <select className="input-field" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Resource / Location" required error={fieldErrors.resourceDetails}>
                    <input className={`input-field ${fieldErrors.resourceDetails ? 'input-error' : ''}`} placeholder="e.g. Lab Projector — Block B, Room 204"
                      value={form.resourceDetails} onChange={e => { setForm(p => ({ ...p, resourceDetails: e.target.value })); setFieldErrors(p => ({ ...p, resourceDetails: '' })) }} />
                  </Field>
                  <Field label="Description" required hint="(min 10 chars)" error={fieldErrors.description}>
                    <textarea rows={4} className={`input-field resize-none ${fieldErrors.description ? 'input-error' : ''}`} placeholder="What happened, where and when?"
                      value={form.description} onChange={e => { setForm(p => ({ ...p, description: e.target.value })); setFieldErrors(p => ({ ...p, description: '' })) }} />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs font-medium transition-colors ${isDescriptionValid ? 'text-emerald-500' : 'text-slate-400'}`}>{form.description.trim().length}/10</span>
                    </div>
                  </Field>
                  <Field label="Preferred Contact" hint="(optional)">
                    <input className="input-field" placeholder="Email or phone" value={form.contactInfo} onChange={e => setForm(p => ({ ...p, contactInfo: e.target.value }))} />
                  </Field>

                  {/* Attachments */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attachments <span className="text-xs font-normal text-slate-400">(optional, max 3)</span></p>
                    <input type="file" accept="image/*" multiple className="hidden" id="modal-files" onChange={e => setFiles(Array.from(e.target.files || []).slice(0,3))} />
                    <label htmlFor="modal-files" className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/5 cursor-pointer transition-all group">
                      <Camera className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                      <span className="text-sm text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{files.length ? `${files.length} file(s) selected — click to change` : 'Click to attach images'}</span>
                    </label>
                    <AnimatePresence>
                      {files.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 mt-2 overflow-hidden">
                          {files.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <Paperclip className="w-3 h-3" />{f.name}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {createError && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />{createError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={creating} className="btn-primary">
                      {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4" /> Create Ticket</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Ticket List ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {loading ? 'Loading…' : `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div key="err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="m-4 flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <InboxIcon className="w-7 h-7 text-slate-400" />
            </motion.div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No tickets found</p>
            <p className="text-sm text-slate-400">Try adjusting filters or create a new ticket.</p>
          </motion.div>
        ) : (
          <ul>
            <AnimatePresence initial={false}>
              {filtered.map((ticket, idx) => (
                <motion.li key={ticket.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: idx * 0.04, duration: 0.22 }}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0 relative"
                >
                  <Link to={`/tickets/${ticket.id}`}
                    className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 group">
                    
                    {/* Vertical ID Bar */}
                    <div className="flex items-center gap-3 w-16 shrink-0">
                      <div className="w-1 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-500/30 transition-colors" />
                      <span className="text-[10px] font-black tracking-tighter text-slate-400 dark:text-slate-600 uppercase">#{ticket.id}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {ticket.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 opacity-60" />{formatDate(ticket.createdAt)}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{ticket.category.replace('_',' ')}</span>
                        {ticket.reporter?.email && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 opacity-60" />{ticket.reporter.name || ticket.reporter.email.split('@')[0]}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <PriorityBars p={ticket.priority} />
                      <StatusPill s={ticket.status} />
                      {ticket.attachmentPaths?.length > 0 && (
                        <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">{ticket.attachmentPaths.length}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 transition-all">
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors shrink-0" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </motion.div>
  )
}
