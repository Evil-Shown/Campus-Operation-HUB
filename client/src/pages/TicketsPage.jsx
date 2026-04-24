import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  History, 
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
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${styles[status] || styles.CLOSED}`}>
      {status}
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

  const query = useMemo(() => ({
    scope: canSeeAll ? scope : 'mine',
    status: statusFilter || undefined,
  }), [canSeeAll, scope, statusFilter])

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
      const created = await createTicket({ baseUrl: apiBaseUrl, token, data: payload, files })
      setTickets((prev) => [created, ...prev])
      setCreateOpen(false)
      setForm({ resourceId: '', category: 'OTHER', description: '', priority: 'MEDIUM', contactInfo: user?.email || '' })
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
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-500">Incident Management Console</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Institutional Maintenance</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Report infrastructure anomalies and orchestrate resolution workflows.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-white/5">
            {canSeeAll && (
              <select
                className="bg-transparent text-xs font-bold px-3 py-2 focus:outline-none border-r border-slate-200 dark:border-white/10 uppercase tracking-widest text-slate-600 dark:text-slate-300"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="all">Global Queue</option>
                <option value="mine">Personal Only</option>
              </select>
            )}
            <select
              className="bg-transparent text-xs font-bold px-4 py-2 focus:outline-none uppercase tracking-widest text-slate-600 dark:text-slate-300"
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
            className="btn-primary py-3 px-6 text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-xl shadow-primary-500/20"
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
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Report New Incident</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Generation Layer</p>
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Classification</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary-500 outline-none transition-all"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Threat Priority</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary-500 outline-none transition-all"
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Resource Reference (Optional)</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g. Asset #304"
                    value={form.resourceId}
                    onChange={(e) => setForm((prev) => ({ ...prev, resourceId: e.target.value.replace(/[^\d]/g, '') }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Detailed Description</label>
                  <textarea
                    className="w-full h-[155px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Describe the institutional anomaly (min 10 chars)..."
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
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
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Visual Evidence</p>
                      <p className="text-xs font-bold text-slate-500 uppercase">Attach up to 3 diagnostic captures</p>
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
                    className="btn-secondary !py-2.5 !px-5 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                  >
                    Select Captures
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="flex gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-500">
                        <FileText className="w-3 h-3" /> {f.name.slice(0, 10)}...
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
                  className="px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Terminate Protocol
                </button>
                <button
                  type="submit"
                  disabled={creating || form.description.length < 10}
                  className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 disabled:opacity-50"
                >
                  {creating ? 'Synchronizing...' : 'Initialize Ticket'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Terminal List */}
      <section className="glass-card !p-0 overflow-hidden border-white/5">
        <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Institutional Incident Repository</h3>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {tickets.length} Global Records
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Activity className="w-10 h-10 text-primary-500 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Scanning Data Streams...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-24 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Global Status: Nominal</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">No incidents detected in the active queue.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {tickets.map((ticket, idx) => (
              <motion.li 
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
                        <span className="text-xs font-black text-primary-500 tracking-tighter">#{ticket.id}</span>
                        <StatusPill status={ticket.status} />
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                          ticket.priority === 'CRITICAL' ? 'border-rose-500/30 text-rose-500' :
                          ticket.priority === 'HIGH' ? 'border-amber-500/30 text-amber-500' :
                          'border-slate-300 text-slate-400'
                        }`}>
                          {ticket.priority} PROT.
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                          {ticket.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-200 text-lg group-hover:text-primary-500 transition-colors line-clamp-1 truncate uppercase tracking-tight">
                        {ticket.description.slice(0, 120)}...
                      </h4>
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Initialized: {formatDate(ticket.createdAt)}</span>
                        {ticket.reporter?.email && <span className="flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Report: {ticket.reporter.name || ticket.reporter.email}</span>}
                        {ticket.assignee?.email && <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Sector: {ticket.assignee.name || ticket.assignee.email}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-8 pl-6 border-l border-slate-100 dark:border-white/5">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 mb-1">EVIDENCE</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase">
                          {ticket.attachmentPaths?.length || 0} CAPTURE(S)
                        </p>
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/5 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all text-slate-400 shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

