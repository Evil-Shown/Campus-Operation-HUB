// Member 2 - Booking Management
const STATUS_CONFIG = {
  APPROVED: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
  PENDING: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  REJECTED: 'bg-rose-500/10 text-rose-700 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
  CANCELLED: 'bg-slate-500/10 text-slate-600 border border-slate-500/20 shadow-[0_0_10px_rgba(100,116,139,0.1)]',
}

export default function BookingStatusBadge({ status }) {
  const classes = STATUS_CONFIG[status] || STATUS_CONFIG.CANCELLED

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm transition-all duration-300 ${classes}`}>
      {status}
    </span>
  )
}
