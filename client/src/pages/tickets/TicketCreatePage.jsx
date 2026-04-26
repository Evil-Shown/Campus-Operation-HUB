import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Paperclip, Send, Loader2, ArrowLeft, Camera, CheckCircle2, Ticket } from 'lucide-react'
import { createTicket } from '../../api/tickets'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'OTHER']
const PRIORITIES  = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function Field({ label, required, hint, error, children }) {
  return (
    <motion.div layout className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
        {hint && <span className="ml-1.5 text-xs font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p key="err" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 overflow-hidden">
            <AlertCircle className="w-3 h-3 shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const slideUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export default function TicketCreatePage() {
  const navigate = useNavigate()
  const { apiBaseUrl, token, user } = useAuth()

  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    resourceDetails: '', category: 'OTHER', description: '', priority: 'MEDIUM', contactInfo: user?.email || '',
  })
  const [files, setFiles] = useState([])

  const isDescValid = form.description.trim().length >= 10

  const validate = () => {
    const e = {}
    if (!form.resourceDetails.trim()) e.resourceDetails = 'Resource or location is required'
    if (!isDescValid) e.description = `${form.description.trim().length}/10 characters minimum`
    return e
  }

  const patchForm = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setFieldErrors(p => { const n = { ...p }; delete n[key]; return n })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setGlobalError('')
    if (!token) { setGlobalError('Please sign in first'); return }
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setSubmitting(true)
    try {
      const created = await createTicket({
        baseUrl: apiBaseUrl, token,
        data: { resourceId: null, resourceLocation: form.resourceDetails.trim(), category: form.category, description: form.description.trim(), priority: form.priority, contactInfo: form.contactInfo.trim() },
        files,
      })
      setSuccess(true)
      setTimeout(() => navigate(`/tickets/${created.id}`), 800)
    } catch (err) {
      setGlobalError(err?.message || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <motion.div variants={slideUp}>
        <button type="button" onClick={() => navigate('/tickets')} className="btn-secondary !py-1.5 !px-3 !text-xs mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tickets
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Report an Issue</h1>
            <p className="text-sm text-slate-400 mt-0.5">Fill in the details and we'll route it to the right team.</p>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div variants={slideUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

        {/* Progress bar at top when submitting */}
        <AnimatePresence>
          {submitting && (
            <motion.div key="progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} style={{ transformOrigin: 'left' }} className="h-0.5 bg-primary-500" />
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-6 space-y-5">

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Category" required>
                <select className="input-field" value={form.category} onChange={e => patchForm('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                </select>
              </Field>
              <Field label="Priority" required>
                <select className="input-field" value={form.priority} onChange={e => patchForm('priority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Resource / Location" required error={fieldErrors.resourceDetails}>
              <input className={`input-field ${fieldErrors.resourceDetails ? 'input-error' : ''}`}
                placeholder="e.g. Lab Projector — Block B, Room 204"
                value={form.resourceDetails} onChange={e => patchForm('resourceDetails', e.target.value)} />
            </Field>

            <Field label="Description" required hint="(min 10 chars)" error={fieldErrors.description}>
              <textarea rows={5} className={`input-field resize-none ${fieldErrors.description ? 'input-error' : ''}`}
                placeholder="Describe the issue clearly — what, where, and when."
                value={form.description} onChange={e => patchForm('description', e.target.value)} />
              <motion.div layout className="flex justify-end mt-1">
                <motion.span
                  animate={{ color: isDescValid ? '#10b981' : '#94a3b8' }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-medium"
                >
                  {form.description.trim().length}/10
                </motion.span>
              </motion.div>
            </Field>

            <Field label="Preferred Contact" hint="(optional)">
              <input className="input-field" placeholder="Email or phone number" value={form.contactInfo} onChange={e => patchForm('contactInfo', e.target.value)} />
            </Field>
          </div>

          {/* Upload section */}
          <div className="p-6">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Attachments <span className="text-xs font-normal text-slate-400">(optional, max 3)</span>
            </p>
            <input type="file" accept="image/*" multiple className="hidden" id="create-files" onChange={e => setFiles(Array.from(e.target.files || []).slice(0,3))} />
            <label htmlFor="create-files"
              className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/5 cursor-pointer transition-all group">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                <Camera className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {files.length ? `${files.length} file(s) selected — click to change` : 'Click to attach images'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </label>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div key="files" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="flex flex-wrap gap-2 mt-3 overflow-hidden">
                  {files.map((f, i) => (
                    <motion.span key={i} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i * 0.06 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <Paperclip className="w-3 h-3" />{f.name}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <AnimatePresence>
              {globalError && (
                <motion.div key="gerr" initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0,y:-6 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />{globalError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => navigate('/tickets')} className="btn-secondary" disabled={submitting}>Cancel</button>
              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={submitting || success} className="btn-primary min-w-[140px]">
                <AnimatePresence mode="wait" initial={false}>
                  {success ? (
                    <motion.span key="ok" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Created!
                    </motion.span>
                  ) : submitting ? (
                    <motion.span key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Submit Report
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
