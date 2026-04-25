import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Trash2, Paperclip, MessageSquare, Clock,
  User, MapPin, Tag, ShieldAlert, Send, Edit2,
  CheckCircle2, AlertCircle, Loader2, FileText,
  ChevronDown, X,
} from 'lucide-react'
import {
  addTicketComment, assignTicket, deleteTicket, deleteTicketComment,
  getTicket, getTicketAttachmentUrl, listTicketComments,
  updateTicketComment, updateTicketStatus,
} from '../api/tickets'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED','REJECTED']

function fmt(v) {
  if (!v) return '—'
  const d = typeof v === 'string' ? new Date(v) : v
  return isNaN(d) ? String(v) : d.toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })
}
function normalizeRole(r) {
  if (!r) return 'user'
  return r === 'ADMIN' || r === 'leader' ? 'leader' : r === 'TECHNICIAN' ? 'technician' : 'user'
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

function StatusBadge({ status }) {
  return <StatusPill s={status} />
}

function MetaChip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>{children}
    </span>
  )
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</h2>
    </div>
  )
}

export default function TicketDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { apiBaseUrl, token, user } = useAuth()

  const [ticket, setTicket]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [status, setStatus]       = useState('')
  const [resolutionNote, setResolutionNote] = useState('')
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [assignError, setAssignError] = useState('')
  const [commentBody, setCommentBody] = useState('')
  const [commenting, setCommenting]   = useState(false)
  const [commentError, setCommentError] = useState('')
  const [localComments, setLocalComments] = useState([])
  const [editingId, setEditingId]   = useState(null)
  const [editingBody, setEditingBody] = useState('')
  const [editingBusy, setEditingBusy] = useState(false)
  const [attachErr, setAttachErr]   = useState('')

  const canEditStatus  = useMemo(() => { const r = normalizeRole(user?.role); return r === 'leader' || r === 'technician' }, [user?.role])
  const canDeleteTicket = useMemo(() => normalizeRole(user?.role) === 'leader', [user?.role])
  const canAssign       = useMemo(() => normalizeRole(user?.role) === 'leader', [user?.role])

  useEffect(() => {
    let ignore = false
    setLoading(true); setError('')
    Promise.all([getTicket({ baseUrl: apiBaseUrl, token, id }), listTicketComments({ baseUrl: apiBaseUrl, token, ticketId: id })])
      .then(([data, cmts]) => { if (ignore) return; setTicket(data); setLocalComments(Array.isArray(cmts) ? cmts : []); setStatus(data?.status || ''); setResolutionNote(data?.resolutionNote || '') })
      .catch(e => { if (!ignore) setError(e?.message || 'Failed to load ticket') })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [apiBaseUrl, token, id])

  const handleStatusSave = async () => {
    if (!canEditStatus || !status) return
    setSaving(true); setSaveError('')
    try { const u = await updateTicketStatus({ baseUrl: apiBaseUrl, token, id, status, resolutionNote: resolutionNote.trim() || undefined }); setTicket(u); setResolutionNote(u?.resolutionNote || ''); setStatus(u?.status || status) }
    catch (e) { setSaveError(e?.message || 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!canDeleteTicket || !window.confirm(`Delete ticket #${id}? This cannot be undone.`)) return
    try { await deleteTicket({ baseUrl: apiBaseUrl, token, id }); navigate('/tickets') }
    catch (e) { setError(e?.message || 'Failed to delete') }
  }

  const handleAssign = async () => {
    if (!canAssign || !assigneeId) return
    setAssigning(true); setAssignError('')
    try { const u = await assignTicket({ baseUrl: apiBaseUrl, token, id, assigneeId: Number(assigneeId) }); setTicket(u); setAssigneeId('') }
    catch (e) { setAssignError(e?.message || 'Failed') } finally { setAssigning(false) }
  }

  const handleAddComment = async (e) => {
    e.preventDefault(); if (!commentBody.trim()) return
    setCommenting(true); setCommentError('')
    try { const c = await addTicketComment({ baseUrl: apiBaseUrl, token, ticketId: id, body: commentBody.trim() }); setLocalComments(p => [c, ...p]); setCommentBody('') }
    catch (e) { setCommentError(e?.message || 'Failed') } finally { setCommenting(false) }
  }

  const handleDeleteComment = async (cid) => {
    try { await deleteTicketComment({ baseUrl: apiBaseUrl, token, ticketId: id, commentId: cid }); setLocalComments(p => p.filter(c => c.id !== cid)) }
    catch (e) { setCommentError(e?.message || 'Failed') }
  }

  const handleSaveEdit = async (cid) => {
    if (!editingBody.trim()) return
    setEditingBusy(true); setCommentError('')
    try { const u = await updateTicketComment({ baseUrl: apiBaseUrl, token, ticketId: id, commentId: cid, body: editingBody.trim() }); setLocalComments(p => p.map(c => c.id === cid ? u : c)); setEditingId(null) }
    catch (e) { setCommentError(e?.message || 'Failed') } finally { setEditingBusy(false) }
  }

  const handleOpenAttachment = async (fileName) => {
    setAttachErr('')
    try {
      const url = getTicketAttachmentUrl({ baseUrl: apiBaseUrl, ticketId: ticket.id, fileName })
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob(); const obj = URL.createObjectURL(blob)
      window.open(obj, '_blank', 'noopener,noreferrer'); setTimeout(() => URL.revokeObjectURL(obj), 60_000)
    } catch (e) { setAttachErr(e?.message || 'Failed to open attachment') }
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-28 gap-3">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Loader2 className="w-8 h-8 text-primary-500" />
      </motion.div>
      <p className="text-sm text-slate-400">Loading ticket…</p>
    </div>
  )

  /* ── Error ── */
  if (error || !ticket) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm mx-auto py-16 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7 text-rose-500" />
      </div>
      <p className="text-base font-semibold text-slate-900 dark:text-white">{error || 'Ticket not found'}</p>
      <Link to="/tickets" className="btn-secondary inline-flex"><ArrowLeft className="w-4 h-4" /> Back to Tickets</Link>
    </motion.div>
  )

  /* ── Main ── */
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
  const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <Link to="/tickets" className="btn-secondary !py-1.5 !px-3 !text-xs w-fit">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ticket #{ticket.id}</h1>
            <StatusBadge status={ticket.status} />
          </div>
          <div className="flex flex-wrap gap-2">
            <MetaChip icon={<Tag className="w-3.5 h-3.5" />}>{ticket.category.replace('_',' ')}</MetaChip>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <PriorityBars p={ticket.priority} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{ticket.priority}</span>
            </div>
            <MetaChip icon={<Clock className="w-3.5 h-3.5" />}>{fmt(ticket.createdAt)}</MetaChip>
          </div>
        </div>
        {canDeleteTicket && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleDelete} className="btn-danger shrink-0">
            <Trash2 className="w-4 h-4" /> Delete Ticket
          </motion.button>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── LEFT ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Description */}
          <motion.section variants={fadeUp} className="card p-6">
            <SectionHeader icon={<FileText className="w-4 h-4" />} title="Description" />
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <User className="w-4 h-4" />, label: 'Reporter', value: ticket.reporter?.email },
                { icon: <User className="w-4 h-4" />, label: 'Assignee', value: ticket.assignee?.email || 'Unassigned' },
                { icon: <MapPin className="w-4 h-4" />, label: 'Location', value: ticket.resourceLocation },
                { icon: <MessageSquare className="w-4 h-4" />, label: 'Contact', value: ticket.contactInfo },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{label}</p>
                    <p className="text-sm text-slate-800 dark:text-slate-200 truncate">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Attachments */}
          <motion.section variants={fadeUp} className="card p-6">
            <SectionHeader icon={<Paperclip className="w-4 h-4" />} title="Attachments" />
            {ticket.attachmentPaths?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-2">
                {ticket.attachmentPaths.map((path) => (
                  <motion.button key={path} whileHover={{ x: 2 }} type="button" onClick={() => handleOpenAttachment(path)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors text-left group">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{path.split('/').pop() || path}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-slate-400 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">No attachments</div>
            )}
            <AnimatePresence>
              {attachErr && <motion.p initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} className="mt-3 text-sm text-rose-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{attachErr}</motion.p>}
            </AnimatePresence>
          </motion.section>

          {/* Comments */}
          <motion.section variants={fadeUp} className="card p-6">
            <SectionHeader icon={<MessageSquare className="w-4 h-4" />} title={`Comments (${localComments.length})`} />

            {/* Add comment */}
            <form onSubmit={handleAddComment} className="mb-6 space-y-2">
              <textarea className="input-field resize-none min-h-[90px]" placeholder="Write a comment…" value={commentBody} onChange={e => setCommentBody(e.target.value)} />
              <AnimatePresence>{commentError && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="text-xs text-rose-500">{commentError}</motion.p>}</AnimatePresence>
              <div className="flex justify-end">
                <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={commenting || !commentBody.trim()} className="btn-primary">
                  {commenting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</> : <><Send className="w-4 h-4" /> Post Comment</>}
                </motion.button>
              </div>
            </form>

            {/* Comment list */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {localComments.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-8 }} transition={{ delay: i * 0.04 }} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1.5 gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{c.author?.email || 'Unknown'}</span>
                        <span className="text-xs text-slate-400 shrink-0">{fmt(c.createdAt)}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl rounded-tl-sm border border-slate-200 dark:border-slate-700 px-4 py-3 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors">
                        {editingId === c.id ? (
                          <div className="space-y-2">
                            <textarea className="input-field resize-none min-h-[72px]" value={editingBody} onChange={e => setEditingBody(e.target.value)} />
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => { setEditingId(null); setEditingBody('') }} className="btn-secondary !py-1 !px-3 !text-xs"><X className="w-3 h-3" /> Cancel</button>
                              <button type="button" disabled={editingBusy} onClick={() => handleSaveEdit(c.id)} className="btn-primary !py-1 !px-3 !text-xs">
                                {editingBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{c.body}</p>
                        )}
                      </div>
                      {editingId !== c.id && (canDeleteTicket || String(c.author?.id) === String(user?.id)) && (
                        <div className="flex gap-3 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            type="button" 
                            onClick={() => { setEditingId(c.id); setEditingBody(c.body || '') }} 
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Edit
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteComment(c.id)} 
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                          >
                            <Trash2 className="w-2.5 h-2.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {localComments.length === 0 && (
                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center text-sm text-slate-400 py-6">No comments yet.</motion.p>
              )}
            </div>
          </motion.section>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-5">
          <motion.section variants={fadeUp} className="card p-5">
            <SectionHeader icon={<CheckCircle2 className="w-4 h-4" />} title="Status" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Current Status</label>
                <div className="relative">
                  <select className="input-field appearance-none pr-8" value={status} onChange={e => setStatus(e.target.value)} disabled={!canEditStatus}>
                    {STATUSES.map(v => <option key={v} value={v}>{v.replace('_',' ')}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Resolution Note</label>
                <textarea className="input-field resize-none min-h-[88px]" value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} disabled={!canEditStatus} placeholder="Describe how the issue was resolved…" />
              </div>
              <AnimatePresence>
                {saveError && <motion.p initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{saveError}</motion.p>}
              </AnimatePresence>
              <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleStatusSave} disabled={!canEditStatus || saving} className="btn-primary w-full">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
              </motion.button>
              {!canEditStatus && <p className="text-xs text-slate-400 text-center">Admins and technicians can update status.</p>}
            </div>
          </motion.section>

          {canAssign && (
            <motion.section variants={fadeUp} className="card p-5">
              <SectionHeader icon={<User className="w-4 h-4" />} title="Assign To" />
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className="input-field !pl-9" value={assigneeId} onChange={e => setAssigneeId(e.target.value.replace(/[^\d]/g,''))} placeholder="User ID (e.g. 5)" />
                </div>
                <AnimatePresence>{assignError && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="text-xs text-rose-500">{assignError}</motion.p>}</AnimatePresence>
                <motion.button whileTap={{ scale: 0.97 }} type="button" onClick={handleAssign} disabled={assigning || !assigneeId} className="btn-secondary w-full">
                  {assigning ? <><Loader2 className="w-4 h-4 animate-spin" /> Assigning…</> : 'Assign Technician'}
                </motion.button>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </motion.div>
  )
}
