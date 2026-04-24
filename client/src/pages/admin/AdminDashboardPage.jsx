import { motion } from 'framer-motion'
import {
  Package,
  CalendarClock,
  AlertCircle,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Search,
  FileText
} from 'lucide-react'

const metrics = [
  {
    label: 'Managed Assets',
    value: 12,
    delta: '+8.2%',
    trend: 'up',
    icon: Package,
    color: 'from-primary-500 to-indigo-600',
  },
  {
    label: 'Pending Requests',
    value: 5,
    delta: '-2.1%',
    trend: 'down',
    icon: CalendarClock,
    color: 'from-amber-400 to-orange-500',
  },
  {
    label: 'Active Incidents',
    value: 8,
    delta: '+1.6%',
    trend: 'up',
    icon: AlertCircle,
    color: 'from-rose-400 to-red-500',
  },
  {
    label: 'Total Enrollment',
    value: 34,
    delta: '+5.4%',
    trend: 'up',
    icon: Users,
    color: 'from-emerald-400 to-teal-500',
  },
]

const recentBookings = [
  { item: 'Computer Lab 3', user: 'Prof. Aristhoth', time: 'Today, 09:00', status: 'APPROVED' },
  { item: 'Lecture Hall A101', user: 'Dr. Sarah Connor', time: 'Tomorrow, 14:00', status: 'PENDING' },
  { item: 'Meeting Room 5', user: 'Admin Group', time: '28 Apr, 10:00', status: 'APPROVED' },
]

const recentTickets = [
  { id: '#TK-001', title: 'Network instability in Lab 3', status: 'OPEN', priority: 'CRITICAL' },
  { id: '#TK-002', title: 'H-304 Projector Calibration', status: 'IN_PROGRESS', priority: 'NORMAL' },
  { id: '#TK-003', title: 'HVAC unexpected shutdown', status: 'OPEN', priority: 'HIGH' },
]

const utilization = [
  { label: 'Technical Labs', value: 72 },
  { label: 'Academic Halls', value: 56 },
  { label: 'Seminar Rooms', value: 81 },
]

function StatusPill({ status, variant = 'neutral' }) {
  const styles = {
    neutral: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    primary: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
  }

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${styles[variant]}`}>
      {status}
    </span>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Admin Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/30 shadow-xl px-8 py-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white border border-indigo-100 shadow-lg">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700">System Administrator Terminal</p>
              </div>
              <h1 className="text-3xl font-black text-gray-800">Institutional Oversight</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Cross-departmental resource orchestration and incident monitoring.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <FileText className="h-4 w-4" />
              Generate Audit Log
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/60 hover:shadow-xl transition-all">
              <Activity className="h-4 w-4" />
              Live Deployment
            </button>
          </div>
        </div>
      </section>

      {/* Primary Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/80 backdrop-blur-sm border border-gray-100 group shadow-lg hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{metric.label}</p>
                <p className="text-3xl font-black text-gray-800 leading-none">{metric.value < 10 ? `0${metric.value}` : metric.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${metric.color} shadow-lg shadow-primary-500/10 group-hover:scale-110 transition-transform`}>
                <metric.icon className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-black ${metric.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {metric.delta}
              </div>
              <span className="text-[10px] font-bold text-gray-400">vs last cycle</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Reservation Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">Active Reservation Queue</h2>
            <button className="text-[10px] font-black text-indigo-600 border border-indigo-200 rounded-md px-2 py-1 uppercase tracking-widest hover:bg-indigo-50 transition-all">Full Log</button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl !p-0 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Requested</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Requestor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Schedule</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Authorization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((row) => (
                    <tr key={`${row.item}-${row.user}`} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{row.item}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500">{row.user}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-600">{row.time}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={row.status} variant={row.status === 'APPROVED' ? 'success' : 'warning'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Space Utilization Bento Side */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">Asset Telemetry</h2>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg space-y-6 p-6">
            {utilization.map((item) => (
              <div key={item.label} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">{item.label}</span>
                  <span className="text-sm font-black text-gray-800">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 group-hover:brightness-110 transition-all"
                  />
                </div>
              </div>
            ))}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Network Pulse</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7].map(i => <div key={i} className={`h-4 w-1 rounded-full ${i > 4 ? 'bg-indigo-500' : 'bg-gray-200'}`} />)}
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 leading-relaxed">Infrastructure load is within normal parameters. No scaling events required.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Support Terminal */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">Incident Terminal</h2>
            <StatusPill status="8 ACTIVE" variant="danger" />
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl !p-0 overflow-hidden shadow-lg">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Case ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Incident</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTickets.map((row) => (
                  <tr key={row.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-black text-indigo-600">{row.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 truncate max-w-[200px]">{row.title}</p>
                      <StatusPill status={row.status} variant={row.status === 'OPEN' ? 'danger' : 'primary'} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={row.priority} variant={row.priority === 'CRITICAL' ? 'danger' : row.priority === 'HIGH' ? 'warning' : 'neutral'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events Feed */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest px-2">Operational Events</h2>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg space-y-6 p-6">
            {[
              { icon: CheckCircle2, text: 'Resource provisioned for Lab 3', time: '2m ago', color: 'text-emerald-500' },
              { icon: Clock3, text: 'Ticket #TK-002 assigned to Hardware', time: '17m ago', color: 'text-amber-500' },
              { icon: Activity, text: 'Daily systems diagnostic complete', time: '42m ago', color: 'text-primary-500' },
            ].map((event, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-50 ${event.color}`}>
                  <event.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 border-b border-gray-100 pb-4 group-last:border-0">
                  <p className="text-sm font-bold text-gray-800">{event.text}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
