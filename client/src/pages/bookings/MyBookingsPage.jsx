import { motion } from 'framer-motion'
import { 
  History, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Timer, 
  XSquare, 
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react'

const rows = [
  {
    resource: 'Computer Lab 3',
    date: '2026-05-01',
    time: '09:00-11:00',
    purpose: 'Project work',
    status: 'PENDING',
    action: 'TERMINATE',
  },
  {
    resource: 'Lecture Hall A101',
    date: '2026-04-28',
    time: '14:00-16:00',
    purpose: 'Group study',
    status: 'APPROVED',
    action: '',
  },
]

function StatusPill({ status }) {
  const styles = {
    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    APPROVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    REJECTED: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      <div className={`h-1 w-1 rounded-full ${status === 'APPROVED' ? 'bg-emerald-500' : status === 'PENDING' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      {status}
    </span>
  )
}

export default function MyBookingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-2 gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <BookOpen className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-500">Booking Management Portal</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Personal Schedule</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Track institutional resource allocations and approval sequences.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-white/5 flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Requests</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">02</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-end">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Approved Slots</span>
            <span className="text-xl font-black text-emerald-500">14</span>
          </div>
        </div>
      </section>

      {/* Bookings Table */}
      <div className="glass-card !p-0 overflow-hidden border-white/5">
        <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Institutional Allocation Logs</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Reference</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Signature</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Purpose</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {rows.map((row, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight">{row.resource}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> {row.date}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" /> {row.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-[200px] truncate uppercase">{row.purpose}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    {row.action ? (
                      <button className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex justify-end gap-2 pr-2">
                        <div className="h-8 w-1 bg-emerald-500/30 rounded-full" />
                        <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
