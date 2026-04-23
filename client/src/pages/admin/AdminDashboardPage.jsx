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
} from 'lucide-react'

const metrics = [
  {
    label: 'Total Resources',
    value: 12,
    delta: '+8.2%',
    trend: 'up',
    icon: Package,
    tint: 'cyan',
  },
  {
    label: 'Pending Bookings',
    value: 5,
    delta: '-2.1%',
    trend: 'down',
    icon: CalendarClock,
    tint: 'amber',
  },
  {
    label: 'Open Tickets',
    value: 8,
    delta: '+1.6%',
    trend: 'up',
    icon: AlertCircle,
    tint: 'rose',
  },
  {
    label: 'Total Users',
    value: 34,
    delta: '+5.4%',
    trend: 'up',
    icon: Users,
    tint: 'indigo',
  },
]

const recentBookings = [
  { item: 'Computer Lab 3', user: 'User A', time: '2026-05-01 09:00', status: 'APPROVED' },
  { item: 'Lecture Hall A101', user: 'User B', time: '2026-04-28 14:00', status: 'PENDING' },
  { item: 'Meeting Room 5', user: 'User C', time: '2026-04-29 10:00', status: 'APPROVED' },
]

const recentTickets = [
  { id: '#1', title: 'Projector not working', status: 'OPEN', priority: 'HIGH' },
  { id: '#2', title: 'Flickering lights', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: '#3', title: 'Leaking tap', status: 'OPEN', priority: 'LOW' },
]

const utilization = [
  { label: 'Labs', value: 72 },
  { label: 'Lecture Halls', value: 56 },
  { label: 'Meeting Rooms', value: 81 },
]

const toneMap = {
  cyan: 'from-cyan-500/20 to-cyan-100 border-cyan-200 text-cyan-900',
  amber: 'from-amber-500/20 to-amber-100 border-amber-200 text-amber-900',
  rose: 'from-rose-500/20 to-rose-100 border-rose-200 text-rose-900',
  indigo: 'from-indigo-500/20 to-indigo-100 border-indigo-200 text-indigo-900',
}

function Pill({ children, variant = 'neutral' }) {
  const styles = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-cyan-100 text-cyan-700',
  }

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}>{children}</span>
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 p-6 text-white shadow-sm">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Operational Intelligence</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-200">Overview of resources, bookings, tickets, and users.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20">
            <TrendingUp className="h-4 w-4" />
            Export Weekly Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-2xl border bg-gradient-to-b p-4 shadow-sm ${toneMap[metric.tint]}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">{metric.label}</p>
                <p className="mt-1 text-3xl font-bold">{metric.value}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-2">
                <metric.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1 text-xs font-semibold">
              {metric.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {metric.delta} from last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
            <Pill variant="info">Live Queue</Pill>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2.5 font-medium">Resource</th>
                  <th className="py-2.5 font-medium">User</th>
                  <th className="py-2.5 font-medium">Date & Time</th>
                  <th className="py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((row) => (
                  <tr key={`${row.item}-${row.user}`} className="border-b border-slate-50 last:border-0">
                    <td className="py-3.5 font-medium text-slate-800">{row.item}</td>
                    <td className="py-3.5 text-slate-600">{row.user}</td>
                    <td className="py-3.5 text-slate-600">{row.time}</td>
                    <td className="py-3.5">
                      <Pill variant={row.status === 'APPROVED' ? 'success' : 'warning'}>{row.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Space Utilization</h2>
          <p className="mt-1 text-sm text-slate-500">Current occupancy rates by category</p>

          <div className="mt-4 space-y-4">
            {utilization.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
            <Pill variant="warning">Needs Attention</Pill>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2.5 font-medium">ID</th>
                  <th className="py-2.5 font-medium">Issue</th>
                  <th className="py-2.5 font-medium">Status</th>
                  <th className="py-2.5 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3.5 font-medium text-slate-800">{row.id}</td>
                    <td className="py-3.5 text-slate-700">{row.title}</td>
                    <td className="py-3.5">
                      <Pill variant={row.status === 'OPEN' ? 'danger' : 'info'}>{row.status}</Pill>
                    </td>
                    <td className="py-3.5">
                      <Pill
                        variant={
                          row.priority === 'HIGH'
                            ? 'danger'
                            : row.priority === 'MEDIUM'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {row.priority}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Operations Timeline</h2>
          <p className="mt-1 text-sm text-slate-500">Latest facility and support activity</p>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 rounded-full bg-emerald-100 p-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Booking approved for Computer Lab 3</p>
                <p className="text-xs text-slate-500">2 minutes ago</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 rounded-full bg-amber-100 p-1.5">
                <Clock3 className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Ticket #2 moved to IN_PROGRESS</p>
                <p className="text-xs text-slate-500">17 minutes ago</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 rounded-full bg-cyan-100 p-1.5">
                <Users className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">3 new users onboarded</p>
                <p className="text-xs text-slate-500">42 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
