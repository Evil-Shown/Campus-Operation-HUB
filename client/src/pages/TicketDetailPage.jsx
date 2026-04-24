import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  addTicketComment,
  assignTicket,
  deleteTicket,
  deleteTicketComment,
  getTicket,
  getTicketAttachmentUrl,
  listTicketComments,
  updateTicketStatus,
} from '../api/tickets'
import { useAuth } from '../context/AuthContext'

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

function normalizeRole(role) {
  if (!role) {
    return 'user'
  }
  return role === 'ADMIN' || role === 'leader' ? 'leader' : role === 'TECHNICIAN' ? 'technician' : 'user'
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { apiBaseUrl, token, user } = useAuth()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [status, setStatus] = useState('')
  const [resolutionNote, setResolutionNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [assignError, setAssignError] = useState('')

  const [commentBody, setCommentBody] = useState('')
  const [commenting, setCommenting] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [localComments, setLocalComments] = useState([])

  const canEditStatus = useMemo(() => {
    const role = normalizeRole(user?.role)
    return role === 'leader' || role === 'technician'
  }, [user?.role])

  const canDeleteTicket = useMemo(() => normalizeRole(user?.role) === 'leader', [user?.role])
  const canAssignTicket = useMemo(() => normalizeRole(user?.role) === 'leader', [user?.role])

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError('')
      try {
        const [data, comments] = await Promise.all([
          getTicket({ baseUrl: apiBaseUrl, token, id }),
          listTicketComments({ baseUrl: apiBaseUrl, token, ticketId: id }),
        ])
        if (ignore) {
          return
        }
        setTicket(data)
        setLocalComments(Array.isArray(comments) ? comments : [])
        setStatus(data?.status || '')
        setResolutionNote(data?.resolutionNote || '')
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Failed to load ticket')
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
  }, [apiBaseUrl, token, id])

  const handleStatusSave = async () => {
    if (!canEditStatus || !status) {
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateTicketStatus({
        baseUrl: apiBaseUrl,
        token,
        id,
        status,
        resolutionNote: resolutionNote.trim() || undefined,
      })
      setTicket(updated)
      setResolutionNote(updated?.resolutionNote || '')
      setStatus(updated?.status || status)
    } catch (err) {
      setSaveError(err?.message || 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!canDeleteTicket) {
      return
    }
    const ok = window.confirm(`Delete ticket #${id}? This cannot be undone.`)
    if (!ok) {
      return
    }

    try {
      await deleteTicket({ baseUrl: apiBaseUrl, token, id })
      navigate('/tickets')
    } catch (err) {
      setError(err?.message || 'Failed to delete ticket')
    }
  }

  const handleAssign = async () => {
    if (!canAssignTicket || !assigneeId) {
      return
    }
    setAssigning(true)
    setAssignError('')
    try {
      const updated = await assignTicket({
        baseUrl: apiBaseUrl,
        token,
        id,
        assigneeId: Number(assigneeId),
      })
      setTicket(updated)
      setAssigneeId('')
    } catch (err) {
      setAssignError(err?.message || 'Failed to assign ticket')
    } finally {
      setAssigning(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteTicketComment({ baseUrl: apiBaseUrl, token, ticketId: id, commentId })
      setLocalComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (err) {
      setCommentError(err?.message || 'Failed to delete comment')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentBody.trim()) {
      return
    }

    setCommenting(true)
    setCommentError('')
    try {
      const created = await addTicketComment({ baseUrl: apiBaseUrl, token, ticketId: id, body: commentBody.trim() })
      setLocalComments((prev) => [created, ...prev])
      setCommentBody('')
    } catch (err) {
      setCommentError(err?.message || 'Failed to add comment')
    } finally {
      setCommenting(false)
    }
  }

  if (loading) {
    return <div className="mx-auto w-full max-w-5xl px-1 py-8 text-sm text-slate-600">Loading ticket…</div>
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-1 py-8">
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        <Link to="/tickets" className="text-sm font-semibold text-indigo-600 hover:underline">
          Back to tickets
        </Link>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-1 py-8">
        <p className="text-sm text-slate-600">Ticket not found.</p>
        <Link to="/tickets" className="text-sm font-semibold text-indigo-600 hover:underline">
          Back to tickets
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/tickets" className="text-sm font-semibold text-indigo-600 hover:underline">
            ← Back
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Ticket #{ticket.id}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {ticket.category} • {ticket.priority} • Created {formatDate(ticket.createdAt)}
          </p>
        </div>
        {canDeleteTicket ? (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            Delete ticket
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>

            <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-slate-600">Reporter:</span> {ticket.reporter?.email || '—'}
              </div>
              <div>
                <span className="font-semibold text-slate-600">Contact:</span> {ticket.contactInfo || '—'}
              </div>
              <div>
                <span className="font-semibold text-slate-600">Assignee:</span> {ticket.assignee?.email || '—'}
              </div>
              <div>
                <span className="font-semibold text-slate-600">Resource:</span> {ticket.resource?.name ? `${ticket.resource.name} (#${ticket.resource.id})` : '—'}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">Attachments</h2>
                <p className="mt-1 text-xs text-slate-500">Open uploaded files directly from secure ticket attachment links.</p>
              </div>
            </div>

            {ticket.attachmentPaths?.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {ticket.attachmentPaths.map((path) => (
                  <li key={path} className="rounded-lg bg-slate-50 px-3 py-2">
                    <a
                      href={getTicketAttachmentUrl({ baseUrl: apiBaseUrl, ticketId: ticket.id, fileName: path })}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {path}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No attachments.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Comments</h2>
            <p className="mt-1 text-xs text-slate-500">Full comment history is loaded from the ticket conversation.</p>

            <form className="mt-3 flex flex-col gap-2" onSubmit={handleAddComment}>
              <textarea
                className="min-h-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Write a comment…"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
              />
              {commentError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{commentError}</p> : null}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={commenting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {commenting ? 'Posting…' : 'Post comment'}
                </button>
              </div>
            </form>

            {localComments.length ? (
              <ul className="mt-4 space-y-3">
                {localComments.map((comment) => (
                  <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span>{comment.author?.email || 'Unknown'} </span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
                    {(canDeleteTicket || comment.author?.id === user?.id) ? (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="rounded border border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600">No comments loaded.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">Status</h2>
            <p className="mt-1 text-xs text-slate-500">Current: {ticket.status}</p>

            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Update status
                <select
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal disabled:cursor-not-allowed disabled:bg-slate-50"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!canEditStatus}
                >
                  {STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Resolution note (optional)
                <textarea
                  className="min-h-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal disabled:cursor-not-allowed disabled:bg-slate-50"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  disabled={!canEditStatus}
                  placeholder="What was done to resolve the issue?"
                />
              </label>

              {saveError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{saveError}</p> : null}

              <button
                type="button"
                onClick={handleStatusSave}
                disabled={!canEditStatus || saving}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save status'}
              </button>

              {canAssignTicket ? (
                <div className="grid gap-2 border-t border-slate-100 pt-3">
                  <label className="grid gap-1 text-sm font-medium text-slate-700">
                    Assign to user ID
                    <input
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="e.g. 5"
                    />
                  </label>
                  {assignError ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{assignError}</p> : null}
                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={assigning || !assigneeId}
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {assigning ? 'Assigning…' : 'Assign ticket'}
                  </button>
                </div>
              ) : null}

              {!canEditStatus ? <p className="text-xs text-slate-500">Only Admin/Technician can update ticket status.</p> : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

